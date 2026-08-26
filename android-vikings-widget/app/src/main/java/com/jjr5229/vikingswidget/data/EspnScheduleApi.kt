package com.jjr5229.vikingswidget.data

import android.util.Log
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.time.Instant
import java.time.format.DateTimeParseException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

/**
 * Reads the Vikings schedule from ESPN's public (undocumented, key-free) team
 * schedule endpoint.
 *
 * Because the endpoint is undocumented, every field here is read defensively:
 * a shape change should degrade the affected game rather than throw. Anything
 * that cannot be parsed into at least an opponent is dropped.
 */
object EspnScheduleApi {

    private const val TAG = "EspnScheduleApi"

    /** ESPN's numeric team id for the Minnesota Vikings. */
    private const val VIKINGS_TEAM_ID = "16"
    private const val VIKINGS_ABBREVIATION = "MIN"

    private const val ENDPOINT =
        "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/min/schedule"

    private const val CONNECT_TIMEOUT_MS = 15_000
    private const val READ_TIMEOUT_MS = 15_000

    /**
     * Fetches the schedule for [season], or the current season when null.
     *
     * @throws IOException on any network or HTTP failure.
     */
    suspend fun fetch(season: Int? = null): Schedule = withContext(Dispatchers.IO) {
        val url = if (season == null) ENDPOINT else "$ENDPOINT?season=$season"
        val body = get(url)
        parse(body)
    }

    private fun get(url: String): String {
        val connection = (URL(url).openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = CONNECT_TIMEOUT_MS
            readTimeout = READ_TIMEOUT_MS
            // ESPN rejects some default Java agents outright.
            setRequestProperty("User-Agent", "VikingsScheduleWidget/1.0 (Android)")
            setRequestProperty("Accept", "application/json")
        }
        try {
            val code = connection.responseCode
            if (code !in 200..299) {
                throw IOException("ESPN returned HTTP $code")
            }
            return connection.inputStream.bufferedReader().use { it.readText() }
        } finally {
            connection.disconnect()
        }
    }

    /** Visible for testing: turns a raw ESPN payload into a [Schedule]. */
    fun parse(body: String): Schedule {
        val root = JSONObject(body)
        // optInt returns 0 rather than null for a missing key, so each
        // candidate has to be rejected explicitly to fall through to the next.
        val season = sequenceOf("season", "requestedSeason")
            .mapNotNull { root.optJSONObject(it)?.optInt("year") }
            .firstOrNull { it > 0 }
            ?: 0

        val events = root.optJSONArray("events") ?: JSONArray()
        val games = buildList {
            for (i in 0 until events.length()) {
                val event = events.optJSONObject(i) ?: continue
                val game = runCatching { parseEvent(event) }.getOrElse {
                    Log.w(TAG, "Skipping unparseable event at index $i", it)
                    null
                }
                if (game != null) add(game)
            }
        }.sortedWith(compareBy(nullsLast()) { it.kickoff })

        return Schedule(season = season, games = games, fetchedAt = Instant.now())
    }

    private fun parseEvent(event: JSONObject): Game? {
        val competition = event.optJSONArray("competitions")?.optJSONObject(0)

        val competitors = competition?.optJSONArray("competitors") ?: return null
        var vikings: JSONObject? = null
        var opponent: JSONObject? = null
        for (i in 0 until competitors.length()) {
            val competitor = competitors.optJSONObject(i) ?: continue
            if (isVikings(competitor)) vikings = competitor else opponent = competitor
        }
        if (vikings == null || opponent == null) return null

        val opponentTeam = opponent.optJSONObject("team")
        val opponentAbbr = opponentTeam?.optString("abbreviation").orEmptyIfBlank()
            ?: opponentTeam?.optString("shortDisplayName").orEmptyIfBlank()
            ?: return null

        val statusType = competition.optJSONObject("status")?.optJSONObject("type")
        val state = when (statusType?.optString("state")) {
            "in" -> GameState.IN_PROGRESS
            "post" -> GameState.FINAL
            else -> GameState.UPCOMING
        }

        val kickoff = parseKickoff(event, competition)
        val vikingsScore = readScore(vikings)
        val opponentScore = readScore(opponent)

        // ESPN sets `winner` only once a game is final; fall back to the scores
        // so an in-progress or partially-populated event still reads sensibly.
        val outcome = when {
            state != GameState.FINAL -> Outcome.NONE
            vikings.has("winner") && vikings.optBoolean("winner") -> Outcome.WIN
            opponent.has("winner") && opponent.optBoolean("winner") -> Outcome.LOSS
            vikingsScore == null || opponentScore == null -> Outcome.NONE
            vikingsScore > opponentScore -> Outcome.WIN
            vikingsScore < opponentScore -> Outcome.LOSS
            else -> Outcome.TIE
        }

        return Game(
            id = event.optString("id").orEmptyIfBlank() ?: "$opponentAbbr@${kickoff ?: "tbd"}",
            week = readWeek(event),
            kickoff = kickoff,
            opponentAbbreviation = opponentAbbr,
            opponentName = opponentTeam?.optString("displayName").orEmptyIfBlank() ?: opponentAbbr,
            isHome = vikings.optString("homeAway") == "home",
            venue = competition.optJSONObject("venue")?.optString("fullName").orEmptyIfBlank(),
            state = state,
            outcome = outcome,
            vikingsScore = vikingsScore,
            opponentScore = opponentScore,
            statusDetail = statusType?.optString("shortDetail").orEmptyIfBlank(),
        )
    }

    private fun isVikings(competitor: JSONObject): Boolean {
        val team = competitor.optJSONObject("team")
        if (team?.optString("abbreviation") == VIKINGS_ABBREVIATION) return true
        // `id` lives on the competitor in some payloads and on the team in others.
        return competitor.optString("id") == VIKINGS_TEAM_ID ||
            team?.optString("id") == VIKINGS_TEAM_ID
    }

    /**
     * Score is an object (`{"value": 27, "displayValue": "27"}`) on the team
     * schedule endpoint but a bare string on the scoreboard endpoint. Accept both.
     */
    private fun readScore(competitor: JSONObject): Int? {
        competitor.optJSONObject("score")?.let { obj ->
            if (obj.has("value")) return obj.optDouble("value").toInt()
            return obj.optString("displayValue").toIntOrNull()
        }
        return competitor.optString("score").toIntOrNull()
    }

    private fun readWeek(event: JSONObject): String {
        val week = event.optJSONObject("week")
        week?.optString("text").orEmptyIfBlank()?.let { return it }
        val number = week?.optInt("number", 0) ?: 0
        if (number > 0) return "Week $number"

        // Postseason events carry their name on seasonType instead of week.
        event.optJSONObject("seasonType")?.optString("name").orEmptyIfBlank()?.let { return it }
        return ""
    }

    private fun parseKickoff(event: JSONObject, competition: JSONObject?): Instant? {
        val raw = event.optString("date").orEmptyIfBlank()
            ?: competition?.optString("date").orEmptyIfBlank()
            ?: return null
        return try {
            Instant.parse(raw)
        } catch (e: DateTimeParseException) {
            // ESPN commonly emits "2026-09-14T17:00Z" which Instant handles, but
            // also "2026-09-14T17:00-04:00" which it does not.
            try {
                java.time.OffsetDateTime.parse(raw).toInstant()
            } catch (e2: DateTimeParseException) {
                Log.w(TAG, "Unparseable kickoff date: $raw")
                null
            }
        }
    }

    private fun String?.orEmptyIfBlank(): String? =
        if (this.isNullOrBlank() || this == "null") null else this
}

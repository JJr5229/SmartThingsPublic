package com.jjr5229.vikingswidget.data

import java.time.Instant
import org.json.JSONArray
import org.json.JSONObject

/**
 * The app's own on-disk schedule format, used for both the bundled fallback
 * asset and the network cache.
 *
 * Deliberately flat and hand-editable so the bundled `schedule_fallback.json`
 * can be filled in by hand when the season schedule is published:
 *
 * ```json
 * {
 *   "season": 2026,
 *   "games": [
 *     {
 *       "week": "Week 1",
 *       "kickoff": "2026-09-13T17:00:00Z",
 *       "opponent": "GB",
 *       "opponentName": "Green Bay Packers",
 *       "home": true,
 *       "venue": "U.S. Bank Stadium"
 *     }
 *   ]
 * }
 * ```
 *
 * `kickoff` is an ISO-8601 instant in UTC; the widget renders it in the
 * device's own time zone. Omit it (or use null) for a game with no set time.
 * Score and state fields are written by the cache and may be omitted by hand.
 */
object ScheduleJson {

    fun decode(body: String): Schedule {
        val root = JSONObject(body)
        val array = root.optJSONArray("games") ?: JSONArray()
        val games = buildList {
            for (i in 0 until array.length()) {
                val obj = array.optJSONObject(i) ?: continue
                val game = runCatching { decodeGame(obj, i) }.getOrNull()
                if (game != null) add(game)
            }
        }.sortedWith(compareBy(nullsLast()) { it.kickoff })

        val fetchedAt = root.optString("fetchedAt")
            .takeIf { it.isNotBlank() && it != "null" }
            ?.let { runCatching { Instant.parse(it) }.getOrNull() }

        return Schedule(
            season = root.optInt("season", 0),
            games = games,
            fetchedAt = fetchedAt,
        )
    }

    private fun decodeGame(obj: JSONObject, index: Int): Game? {
        val opponent = obj.optString("opponent").takeIf { it.isNotBlank() } ?: return null
        val kickoff = obj.optString("kickoff")
            .takeIf { it.isNotBlank() && it != "null" }
            ?.let { runCatching { Instant.parse(it) }.getOrNull() }

        val vikingsScore = if (obj.has("vikingsScore") && !obj.isNull("vikingsScore")) {
            obj.optInt("vikingsScore")
        } else {
            null
        }
        val opponentScore = if (obj.has("opponentScore") && !obj.isNull("opponentScore")) {
            obj.optInt("opponentScore")
        } else {
            null
        }

        val state = when (obj.optString("state")) {
            "IN_PROGRESS" -> GameState.IN_PROGRESS
            "FINAL" -> GameState.FINAL
            else -> GameState.UPCOMING
        }
        val outcome = when (obj.optString("outcome")) {
            "WIN" -> Outcome.WIN
            "LOSS" -> Outcome.LOSS
            "TIE" -> Outcome.TIE
            else -> Outcome.NONE
        }

        return Game(
            id = obj.optString("id").takeIf { it.isNotBlank() } ?: "$opponent-$index",
            week = obj.optString("week"),
            kickoff = kickoff,
            opponentAbbreviation = opponent,
            opponentName = obj.optString("opponentName").takeIf { it.isNotBlank() } ?: opponent,
            isHome = obj.optBoolean("home", true),
            venue = obj.optString("venue").takeIf { it.isNotBlank() },
            state = state,
            outcome = outcome,
            vikingsScore = vikingsScore,
            opponentScore = opponentScore,
            statusDetail = obj.optString("statusDetail").takeIf { it.isNotBlank() },
        )
    }

    fun encode(schedule: Schedule): String {
        val array = JSONArray()
        schedule.games.forEach { game ->
            array.put(
                JSONObject().apply {
                    put("id", game.id)
                    put("week", game.week)
                    put("kickoff", game.kickoff?.toString())
                    put("opponent", game.opponentAbbreviation)
                    put("opponentName", game.opponentName)
                    put("home", game.isHome)
                    put("venue", game.venue)
                    put("state", game.state.name)
                    put("outcome", game.outcome.name)
                    put("vikingsScore", game.vikingsScore)
                    put("opponentScore", game.opponentScore)
                    put("statusDetail", game.statusDetail)
                },
            )
        }
        return JSONObject().apply {
            put("season", schedule.season)
            put("fetchedAt", schedule.fetchedAt?.toString())
            put("games", array)
        }.toString()
    }
}

package com.jjr5229.vikingswidget.data

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

/** Where a game sits relative to now, as reported by the source. */
enum class GameState {
    /** Scheduled, not yet started. */
    UPCOMING,

    /** Currently being played. */
    IN_PROGRESS,

    /** Final. */
    FINAL,
}

/** Result of a completed game from the Vikings' point of view. */
enum class Outcome { WIN, LOSS, TIE, NONE }

/**
 * One Vikings game.
 *
 * [kickoff] is null only when a source lists a game without a firm date/time
 * (flex-scheduled games occasionally appear this way before a window is set).
 */
data class Game(
    val id: String,
    val week: String,
    val kickoff: Instant?,
    val opponentAbbreviation: String,
    val opponentName: String,
    val isHome: Boolean,
    val venue: String?,
    val state: GameState,
    val outcome: Outcome,
    val vikingsScore: Int?,
    val opponentScore: Int?,
    /** Source-provided status blurb, e.g. "Final/OT" or "3rd Quarter, 4:12". */
    val statusDetail: String?,
) {
    /** "vs GB" for home, "@ CHI" for away. */
    fun matchupLabel(): String = if (isHome) "vs $opponentAbbreviation" else "@ $opponentAbbreviation"

    /** "W 27-24", "L 17-24", or null when there is no score to show yet. */
    fun scoreLabel(): String? {
        val us = vikingsScore ?: return null
        val them = opponentScore ?: return null
        val prefix = when (outcome) {
            Outcome.WIN -> "W"
            Outcome.LOSS -> "L"
            Outcome.TIE -> "T"
            Outcome.NONE -> ""
        }
        return if (prefix.isEmpty()) "$us-$them" else "$prefix $us-$them"
    }

    /** "Sun 9/14" in the device's zone, or "TBD" when the source has no date. */
    fun dateLabel(zone: ZoneId = ZoneId.systemDefault()): String {
        val at = kickoff ?: return "TBD"
        return DATE_FORMAT.withZone(zone).format(at)
    }

    /** "12:00 PM" in the device's zone, or null when the source has no date. */
    fun timeLabel(zone: ZoneId = ZoneId.systemDefault()): String? {
        val at = kickoff ?: return null
        return TIME_FORMAT.withZone(zone).format(at)
    }

    private companion object {
        val DATE_FORMAT: DateTimeFormatter =
            DateTimeFormatter.ofPattern("EEE M/d", Locale.US)
        val TIME_FORMAT: DateTimeFormatter =
            DateTimeFormatter.ofPattern("h:mm a", Locale.US)
    }
}

/** A full season of games plus the record they add up to. */
data class Schedule(
    val season: Int,
    val games: List<Game>,
    /** When this data was fetched. Null for the bundled fallback. */
    val fetchedAt: Instant?,
) {
    val wins: Int get() = games.count { it.outcome == Outcome.WIN }
    val losses: Int get() = games.count { it.outcome == Outcome.LOSS }
    val ties: Int get() = games.count { it.outcome == Outcome.TIE }

    /** "10-6" or "10-6-1" when there is a tie. */
    fun recordLabel(): String = if (ties > 0) "$wins-$losses-$ties" else "$wins-$losses"

    /**
     * Index of the game to scroll to: the one in progress, else the next
     * upcoming one, else the last game of the season.
     */
    fun focusIndex(): Int {
        val live = games.indexOfFirst { it.state == GameState.IN_PROGRESS }
        if (live >= 0) return live
        val next = games.indexOfFirst { it.state == GameState.UPCOMING }
        return if (next >= 0) next else (games.size - 1).coerceAtLeast(0)
    }

    companion object {
        val EMPTY = Schedule(season = 0, games = emptyList(), fetchedAt = null)
    }
}

package com.jjr5229.vikingswidget.data

import java.time.Instant
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ScheduleJsonTest {

    @Test
    fun `round-trips a schedule through encode and decode`() {
        val original = Schedule(
            season = 2026,
            fetchedAt = Instant.parse("2026-09-14T18:30:00Z"),
            games = listOf(
                Game(
                    id = "401001",
                    week = "Week 1",
                    kickoff = Instant.parse("2026-09-13T17:00:00Z"),
                    opponentAbbreviation = "GB",
                    opponentName = "Green Bay Packers",
                    isHome = true,
                    venue = "U.S. Bank Stadium",
                    state = GameState.FINAL,
                    outcome = Outcome.WIN,
                    vikingsScore = 27,
                    opponentScore = 24,
                    statusDetail = "Final",
                ),
            ),
        )

        val decoded = ScheduleJson.decode(ScheduleJson.encode(original))

        assertEquals(original.season, decoded.season)
        assertEquals(original.fetchedAt, decoded.fetchedAt)
        assertEquals(original.games, decoded.games)
    }

    @Test
    fun `decodes the hand-written fallback shape with only required fields`() {
        val body = """
            {
              "season": 2026,
              "games": [
                {"week": "Week 1", "kickoff": "2026-09-13T17:00:00Z",
                 "opponent": "GB", "opponentName": "Green Bay Packers",
                 "home": true, "venue": "U.S. Bank Stadium"}
              ]
            }
        """.trimIndent()

        val schedule = ScheduleJson.decode(body)
        val game = schedule.games.single()

        assertEquals(2026, schedule.season)
        assertEquals("GB", game.opponentAbbreviation)
        assertTrue(game.isHome)
        assertEquals(GameState.UPCOMING, game.state)
        assertEquals(Outcome.NONE, game.outcome)
        assertNull(game.vikingsScore)
        assertNull(game.scoreLabel())
        assertNull(schedule.fetchedAt)
    }

    @Test
    fun `keeps a zero score distinct from a missing one`() {
        val body = """
            {"season":2026,"games":[
              {"opponent":"CHI","state":"FINAL","outcome":"LOSS",
               "vikingsScore":0,"opponentScore":13}
            ]}
        """.trimIndent()

        val game = ScheduleJson.decode(body).games.single()

        assertEquals(0, game.vikingsScore)
        assertEquals("L 0-13", game.scoreLabel())
    }

    @Test
    fun `drops games with no opponent and keeps the rest`() {
        val body = """
            {"season":2026,"games":[
              {"week":"Week 1"},
              {"opponent":"DET","kickoff":"2026-09-20T17:00:00Z"}
            ]}
        """.trimIndent()

        assertEquals(listOf("DET"), ScheduleJson.decode(body).games.map { it.opponentAbbreviation })
    }

    @Test
    fun `treats the shipped empty fallback as having no games`() {
        val body = """{"season":2026,"games":[]}"""
        val schedule = ScheduleJson.decode(body)

        assertTrue(schedule.games.isEmpty())
        assertEquals("0-0", schedule.recordLabel())
        assertFalse(schedule.games.isNotEmpty())
    }
}

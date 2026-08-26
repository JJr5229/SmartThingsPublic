package com.jjr5229.vikingswidget.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Exercises the ESPN payload parser against the shapes the endpoint is known
 * to emit. The endpoint is undocumented, so these fixtures are the contract we
 * are coding against — if ESPN changes shape, these are what should be updated
 * first, from a real captured response.
 */
class EspnScheduleApiTest {

    @Test
    fun `parses a completed home win`() {
        val schedule = EspnScheduleApi.parse(PAYLOAD)
        val game = schedule.games.first { it.opponentAbbreviation == "GB" }

        assertEquals(GameState.FINAL, game.state)
        assertEquals(Outcome.WIN, game.outcome)
        assertEquals(27, game.vikingsScore)
        assertEquals(24, game.opponentScore)
        assertTrue(game.isHome)
        assertEquals("vs GB", game.matchupLabel())
        assertEquals("W 27-24", game.scoreLabel())
        assertEquals("Week 1", game.week)
    }

    @Test
    fun `parses a completed away loss with string scores`() {
        val schedule = EspnScheduleApi.parse(PAYLOAD)
        val game = schedule.games.first { it.opponentAbbreviation == "CHI" }

        assertEquals(Outcome.LOSS, game.outcome)
        assertEquals(17, game.vikingsScore)
        assertEquals(20, game.opponentScore)
        assertEquals("@ CHI", game.matchupLabel())
        assertEquals("L 17-20", game.scoreLabel())
    }

    @Test
    fun `parses an in-progress game`() {
        val schedule = EspnScheduleApi.parse(PAYLOAD)
        val game = schedule.games.first { it.opponentAbbreviation == "DET" }

        assertEquals(GameState.IN_PROGRESS, game.state)
        assertEquals(Outcome.NONE, game.outcome)
        assertEquals("3rd Quarter, 4:12", game.statusDetail)
    }

    @Test
    fun `parses an upcoming game with no score`() {
        val schedule = EspnScheduleApi.parse(PAYLOAD)
        val game = schedule.games.first { it.opponentAbbreviation == "NO" }

        assertEquals(GameState.UPCOMING, game.state)
        assertNull(game.scoreLabel())
        assertEquals("U.S. Bank Stadium", game.venue)
    }

    @Test
    fun `sorts games by kickoff and puts undated games last`() {
        val schedule = EspnScheduleApi.parse(PAYLOAD)
        val order = schedule.games.map { it.opponentAbbreviation }

        assertEquals(listOf("GB", "CHI", "DET", "NO", "TBD"), order)
        assertNull(schedule.games.last().kickoff)
        assertEquals("TBD", schedule.games.last().dateLabel())
    }

    @Test
    fun `computes the season record from completed games only`() {
        val schedule = EspnScheduleApi.parse(PAYLOAD)

        assertEquals(1, schedule.wins)
        assertEquals(1, schedule.losses)
        assertEquals("1-1", schedule.recordLabel())
    }

    @Test
    fun `focus index points at the in-progress game`() {
        val schedule = EspnScheduleApi.parse(PAYLOAD)

        assertEquals("DET", schedule.games[schedule.focusIndex()].opponentAbbreviation)
    }

    @Test
    fun `drops unparseable events instead of failing the whole payload`() {
        val body = """
            {"season":{"year":2026},"events":[
              {"id":"1","date":"2026-09-13T17:00Z"},
              {"id":"2","competitions":[{"competitors":[]}]}
            ]}
        """.trimIndent()

        assertEquals(0, EspnScheduleApi.parse(body).games.size)
    }

    @Test
    fun `tolerates a payload with no events at all`() {
        val schedule = EspnScheduleApi.parse("""{"season":{"year":2026}}""")

        assertEquals(2026, schedule.season)
        assertTrue(schedule.games.isEmpty())
    }

    private companion object {
        /**
         * Mirrors ESPN's team-schedule shape, including the two score
         * encodings seen in the wild (object with `value`, and bare string).
         */
        val PAYLOAD = """
        {
          "season": {"year": 2026},
          "events": [
            {
              "id": "401001",
              "date": "2026-09-13T17:00Z",
              "week": {"number": 1, "text": "Week 1"},
              "competitions": [{
                "venue": {"fullName": "U.S. Bank Stadium"},
                "status": {"type": {"state": "post", "completed": true, "shortDetail": "Final"}},
                "competitors": [
                  {"homeAway": "home", "winner": true,
                   "team": {"abbreviation": "MIN", "displayName": "Minnesota Vikings"},
                   "score": {"value": 27, "displayValue": "27"}},
                  {"homeAway": "away", "winner": false,
                   "team": {"abbreviation": "GB", "displayName": "Green Bay Packers"},
                   "score": {"value": 24, "displayValue": "24"}}
                ]
              }]
            },
            {
              "id": "401002",
              "date": "2026-09-20T18:00Z",
              "week": {"number": 2, "text": "Week 2"},
              "competitions": [{
                "venue": {"fullName": "Soldier Field"},
                "status": {"type": {"state": "post", "completed": true, "shortDetail": "Final"}},
                "competitors": [
                  {"homeAway": "away", "winner": false,
                   "team": {"abbreviation": "MIN", "displayName": "Minnesota Vikings"},
                   "score": "17"},
                  {"homeAway": "home", "winner": true,
                   "team": {"abbreviation": "CHI", "displayName": "Chicago Bears"},
                   "score": "20"}
                ]
              }]
            },
            {
              "id": "401003",
              "date": "2026-09-24T00:15Z",
              "week": {"number": 3, "text": "Week 3"},
              "competitions": [{
                "venue": {"fullName": "Ford Field"},
                "status": {"type": {"state": "in", "shortDetail": "3rd Quarter, 4:12"}},
                "competitors": [
                  {"homeAway": "away",
                   "team": {"abbreviation": "MIN", "displayName": "Minnesota Vikings"},
                   "score": {"value": 14}},
                  {"homeAway": "home",
                   "team": {"abbreviation": "DET", "displayName": "Detroit Lions"},
                   "score": {"value": 10}}
                ]
              }]
            },
            {
              "id": "401004",
              "date": "2026-10-04T17:00Z",
              "week": {"number": 4, "text": "Week 4"},
              "competitions": [{
                "venue": {"fullName": "U.S. Bank Stadium"},
                "status": {"type": {"state": "pre", "shortDetail": "Sun, October 4th"}},
                "competitors": [
                  {"homeAway": "home",
                   "team": {"abbreviation": "MIN", "displayName": "Minnesota Vikings"}},
                  {"homeAway": "away",
                   "team": {"abbreviation": "NO", "displayName": "New Orleans Saints"}}
                ]
              }]
            },
            {
              "id": "401005",
              "week": {"number": 5, "text": "Week 5"},
              "competitions": [{
                "status": {"type": {"state": "pre"}},
                "competitors": [
                  {"homeAway": "home",
                   "team": {"abbreviation": "MIN", "displayName": "Minnesota Vikings"}},
                  {"homeAway": "away",
                   "team": {"abbreviation": "TBD", "displayName": "To Be Determined"}}
                ]
              }]
            }
          ]
        }
        """.trimIndent()
    }
}

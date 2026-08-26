# Vikings Schedule Widget

An Android home-screen widget showing the full Minnesota Vikings season —
scrollable, with results filled in as games are played.

Built with [Glance](https://developer.android.com/jetpack/androidx/releases/glance)
(Jetpack Compose for app widgets).

## Status

**This has never been compiled.** It was written in an environment with no
Android SDK and no access to `dl.google.com`, so no Gradle build was possible.
Expect to fix a few things on the first build in Android Studio.

What *was* verified:

- All XML and JSON resources parse.
- `EspnScheduleApi.parse` and `ScheduleJson` were compiled with `kotlinc` 2.0.21
  against real `org.json`, and their 14 unit tests pass. These are the parts
  most likely to be wrong, so they are the parts that were tested.

What was **not** verified: anything touching the Android SDK — the Glance UI,
the manifest, resource references, WorkManager wiring.

## Building

```
cd android-vikings-widget
./gradlew :app:installDebug      # or just open this directory in Android Studio
```

Then long-press the home screen → Widgets → **Vikings Schedule**.

Run the tests with `./gradlew :app:testDebugUnitTest`.

This is a standalone Gradle build. It is deliberately *not* wired into the
`SmartThingsPublic` root build, which is an unrelated Groovy/jcenter build that
predates AGP — the two share a repository, nothing else.

## Where the data comes from

The widget reads ESPN's public, key-free NFL team schedule endpoint:

```
https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/min/schedule
```

That endpoint is undocumented and can change shape without notice, so
`EspnScheduleApi` parses defensively: an unrecognized field degrades one game
rather than failing the whole payload, and a response that yields no games is
treated as a failure so the previous data is kept.

Data is resolved in this order:

1. **Network** — refreshed every 3 hours by `ScheduleRefreshWorker`, and on
   demand via the widget's Refresh button.
2. **Cache** — the last successful fetch, in the app's private storage.
3. **Bundled fallback** — `app/src/main/assets/schedule_fallback.json`.

### Filling in the bundled fallback

`schedule_fallback.json` ships with an **empty** `games` array. It was left
empty on purpose rather than filled in from memory — a widget showing
confidently wrong kickoff times is worse than one showing none.

To populate it, paste the published season schedule in this shape:

```json
{
  "season": 2026,
  "games": [
    {
      "week": "Week 1",
      "kickoff": "2026-09-13T17:00:00Z",
      "opponent": "GB",
      "opponentName": "Green Bay Packers",
      "home": true,
      "venue": "U.S. Bank Stadium"
    }
  ]
}
```

`kickoff` is an ISO-8601 instant in **UTC**; the widget renders it in the
device's own time zone. Omit it for a game with no set time and the row shows
"TBD". Leave scores out — those come from the network. See `ScheduleJson.kt`
for every accepted field.

This fallback only appears when the network fails *and* no cache exists, so in
practice it matters on first launch offline.

## Layout

| Path | What it does |
| --- | --- |
| `data/Game.kt` | Game and Schedule models, label formatting, season record |
| `data/EspnScheduleApi.kt` | Fetches and parses the ESPN payload |
| `data/ScheduleJson.kt` | The app's own JSON format, for the cache and the fallback |
| `data/ScheduleRepository.kt` | Network → cache → bundled resolution |
| `widget/VikingsScheduleWidget.kt` | The Glance UI |
| `widget/VikingsWidgetReceiver.kt` | Widget lifecycle, schedules background work |
| `widget/RefreshAction.kt` | Refresh button handler |
| `work/ScheduleRefreshWorker.kt` | Periodic background refresh |
| `MainActivity.kt` | Minimal host screen with a manual refresh |

`updatePeriodMillis` is set to 0 and refreshes go through WorkManager instead —
the AppWidget mechanism is capped at 30 minutes and is unreliable across OEM
builds.

## Notes

- `minSdk` is 26. The launcher icon is adaptive-only, which is fine at that level.
- Scores can lag a live game by up to the 3-hour refresh interval; the Refresh
  button covers the gap. Polling harder would cost battery for a widget that is
  mostly read between games.
- ESPN's `score` field is an object on this endpoint and a bare string on the
  scoreboard endpoint. `readScore` accepts both.

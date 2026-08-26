package com.jjr5229.vikingswidget.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.lazy.LazyColumn
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.jjr5229.vikingswidget.data.Game
import com.jjr5229.vikingswidget.data.GameState
import com.jjr5229.vikingswidget.data.Outcome
import com.jjr5229.vikingswidget.data.Schedule
import com.jjr5229.vikingswidget.data.ScheduleRepository

/**
 * Home-screen widget listing the full Vikings season, scrollable, with results
 * filled in as games are played.
 */
class VikingsScheduleWidget : GlanceAppWidget() {

    override val sizeMode: SizeMode = SizeMode.Exact

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // Read cached/bundled data synchronously so the widget paints
        // immediately; the network refresh happens on a WorkManager schedule
        // and via the refresh button, each of which triggers a re-render.
        val schedule = ScheduleRepository(context).load()

        provideContent {
            GlanceTheme {
                WidgetBody(schedule)
            }
        }
    }

    @Composable
    private fun WidgetBody(schedule: Schedule) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(VikingsTheme.Surface)
                .cornerRadius(16.dp)
                .padding(horizontal = 12.dp, vertical = 10.dp),
        ) {
            Header(schedule)
            Spacer(GlanceModifier.height(8.dp))

            if (schedule.games.isEmpty()) {
                EmptyState()
            } else {
                val focus = schedule.focusIndex()
                LazyColumn(modifier = GlanceModifier.fillMaxSize()) {
                    items(count = schedule.games.size) { index ->
                        GameRow(
                            game = schedule.games[index],
                            isNext = index == focus &&
                                schedule.games[index].state != GameState.FINAL,
                        )
                    }
                }
            }
        }
    }

    @Composable
    private fun Header(schedule: Schedule) {
        Row(
            modifier = GlanceModifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = GlanceModifier.defaultWeight()) {
                Text(
                    text = "VIKINGS",
                    style = TextStyle(
                        color = VikingsTheme.OnSurface,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                    ),
                )
                val subtitle = buildString {
                    if (schedule.season > 0) append(schedule.season)
                    if (schedule.games.any { it.state == GameState.FINAL }) {
                        if (isNotEmpty()) append("  ·  ")
                        append(schedule.recordLabel())
                    }
                }
                if (subtitle.isNotEmpty()) {
                    Text(
                        text = subtitle,
                        style = TextStyle(
                            color = VikingsTheme.Accent,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                        ),
                    )
                }
            }

            // Tapping the header area refreshes rather than opening the app;
            // a schedule widget is glanceable, so refresh is the common action.
            Box(
                modifier = GlanceModifier
                    .cornerRadius(12.dp)
                    .background(VikingsTheme.SurfaceRaised)
                    .padding(horizontal = 10.dp, vertical = 5.dp)
                    .clickable(actionRunCallback<RefreshAction>()),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = "Refresh",
                    style = TextStyle(
                        color = VikingsTheme.OnSurface,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                    ),
                )
            }
        }
    }

    @Composable
    private fun GameRow(game: Game, isNext: Boolean) {
        val rowModifier = GlanceModifier
            .fillMaxWidth()
            .cornerRadius(10.dp)
            .let { if (isNext) it.background(VikingsTheme.SurfaceRaised) else it }
            .padding(horizontal = 8.dp, vertical = 7.dp)

        Column(modifier = GlanceModifier.fillMaxWidth()) {
            Row(
                modifier = rowModifier,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                // Date column, fixed width so opponents line up down the list.
                Column(modifier = GlanceModifier.width(58.dp)) {
                    Text(
                        text = game.dateLabel(),
                        style = TextStyle(
                            color = if (isNext) VikingsTheme.Accent else VikingsTheme.OnSurfaceMuted,
                            fontSize = 11.sp,
                            fontWeight = if (isNext) FontWeight.Bold else FontWeight.Normal,
                        ),
                        maxLines = 1,
                    )
                    val time = game.timeLabel()
                    if (time != null && game.state == GameState.UPCOMING) {
                        Text(
                            text = time,
                            style = TextStyle(
                                color = VikingsTheme.OnSurfaceMuted,
                                fontSize = 9.sp,
                            ),
                            maxLines = 1,
                        )
                    }
                }

                Spacer(GlanceModifier.width(6.dp))

                Text(
                    text = game.matchupLabel(),
                    style = TextStyle(
                        color = VikingsTheme.OnSurface,
                        fontSize = 13.sp,
                        fontWeight = if (isNext) FontWeight.Bold else FontWeight.Medium,
                    ),
                    maxLines = 1,
                    modifier = GlanceModifier.defaultWeight(),
                )

                TrailingStatus(game)
            }
            Spacer(
                GlanceModifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(VikingsTheme.Divider),
            )
        }
    }

    /** Score for played games, a live badge in progress, bye/week label otherwise. */
    @Composable
    private fun TrailingStatus(game: Game) {
        when (game.state) {
            GameState.FINAL -> {
                val label = game.scoreLabel()
                if (label != null) {
                    Text(
                        text = label,
                        style = TextStyle(
                            color = when (game.outcome) {
                                Outcome.WIN -> VikingsTheme.Win
                                Outcome.LOSS -> VikingsTheme.Loss
                                else -> VikingsTheme.OnSurfaceMuted
                            },
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                        ),
                        maxLines = 1,
                    )
                }
            }

            GameState.IN_PROGRESS -> {
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = game.scoreLabel() ?: "LIVE",
                        style = TextStyle(
                            color = VikingsTheme.Accent,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                        ),
                        maxLines = 1,
                    )
                    val detail = game.statusDetail
                    if (detail != null) {
                        Text(
                            text = detail,
                            style = TextStyle(
                                color = VikingsTheme.OnSurfaceMuted,
                                fontSize = 9.sp,
                            ),
                            maxLines = 1,
                        )
                    }
                }
            }

            GameState.UPCOMING -> {
                Text(
                    text = game.week,
                    style = TextStyle(
                        color = VikingsTheme.OnSurfaceMuted,
                        fontSize = 10.sp,
                    ),
                    maxLines = 1,
                )
            }
        }
    }

    @Composable
    private fun EmptyState() {
        Column(
            modifier = GlanceModifier.fillMaxSize().padding(8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "No schedule yet",
                style = TextStyle(
                    color = VikingsTheme.OnSurface,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                ),
            )
            Spacer(GlanceModifier.height(4.dp))
            Text(
                text = "Tap Refresh to load the season.",
                style = TextStyle(color = VikingsTheme.OnSurfaceMuted, fontSize = 11.sp),
            )
        }
    }
}

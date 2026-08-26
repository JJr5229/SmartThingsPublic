package com.jjr5229.vikingswidget

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.jjr5229.vikingswidget.data.ScheduleRepository
import com.jjr5229.vikingswidget.widget.VikingsScheduleWidget
import kotlinx.coroutines.launch

/**
 * Minimal host activity. The widget is the product; this screen exists so the
 * app is launchable and offers a manual refresh for troubleshooting.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Scaffold { padding ->
                    HomeScreen(Modifier.padding(padding))
                }
            }
        }
    }
}

@Composable
private fun HomeScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val repository = remember { ScheduleRepository(context) }
    var status by remember { mutableStateOf("Add the Vikings widget to your home screen.") }

    Column(
        modifier = modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("Vikings Schedule", style = MaterialTheme.typography.headlineSmall)
        Text(status, style = MaterialTheme.typography.bodyMedium)

        Button(onClick = {
            scope.launch {
                status = "Refreshing…"
                val result = repository.refresh()
                VikingsScheduleWidget().updateAll(context)
                status = if (result.success) {
                    "Loaded ${result.schedule.games.size} games for ${result.schedule.season}."
                } else {
                    "Couldn't reach the schedule service. Showing saved data."
                }
            }
        }) {
            Text("Refresh now")
        }
    }
}

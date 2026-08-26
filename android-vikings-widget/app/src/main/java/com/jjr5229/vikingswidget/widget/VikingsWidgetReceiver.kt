package com.jjr5229.vikingswidget.widget

import android.content.Context
import android.content.Intent
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import com.jjr5229.vikingswidget.work.ScheduleRefreshWorker

class VikingsWidgetReceiver : GlanceAppWidgetReceiver() {

    override val glanceAppWidget: GlanceAppWidget = VikingsScheduleWidget()

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        // First instance placed: start the periodic refresh and pull once now
        // so the widget is populated rather than showing the empty state.
        ScheduleRefreshWorker.schedulePeriodic(context)
        ScheduleRefreshWorker.refreshNow(context)
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        // Last instance removed: stop doing background work.
        ScheduleRefreshWorker.cancel(context)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        // A device reboot or app update clears WorkManager's view in some OEM
        // builds; re-scheduling is cheap and idempotent under KEEP.
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == Intent.ACTION_MY_PACKAGE_REPLACED
        ) {
            ScheduleRefreshWorker.schedulePeriodic(context)
        }
    }
}

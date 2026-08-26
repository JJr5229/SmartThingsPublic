package com.jjr5229.vikingswidget.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.action.ActionCallback
import com.jjr5229.vikingswidget.data.ScheduleRepository

/** Refresh button: pulls from the network, then re-renders every widget instance. */
class RefreshAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters,
    ) {
        ScheduleRepository(context).refresh()
        VikingsScheduleWidget().updateAll(context)
    }
}

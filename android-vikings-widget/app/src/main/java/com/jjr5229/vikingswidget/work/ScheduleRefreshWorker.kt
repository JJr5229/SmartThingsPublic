package com.jjr5229.vikingswidget.work

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.jjr5229.vikingswidget.data.ScheduleRepository
import com.jjr5229.vikingswidget.widget.VikingsScheduleWidget
import java.util.concurrent.TimeUnit

/**
 * Keeps the widget's cached schedule current in the background.
 *
 * AppWidget's own `updatePeriodMillis` is capped at 30 minutes and is not
 * honored consistently across OEM builds, so refreshes run through WorkManager
 * instead.
 */
class ScheduleRefreshWorker(
    context: Context,
    params: WorkerParameters,
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val result = ScheduleRepository(applicationContext).refresh()
        VikingsScheduleWidget().updateAll(applicationContext)

        // Retry a failed fetch; WorkManager backs off exponentially. Successive
        // failures eventually stop, and the next periodic run picks it back up.
        return if (result.success) Result.success() else Result.retry()
    }

    companion object {
        private const val PERIODIC_WORK_NAME = "vikings-schedule-refresh"
        private const val ONE_SHOT_WORK_NAME = "vikings-schedule-refresh-now"

        /**
         * Every 3 hours. Scores can lag a live game by up to that long, which
         * the Refresh button covers; polling harder would cost battery for a
         * widget that is mostly read between games.
         */
        private const val REFRESH_INTERVAL_HOURS = 3L

        private val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        fun schedulePeriodic(context: Context) {
            val request = PeriodicWorkRequestBuilder<ScheduleRefreshWorker>(
                REFRESH_INTERVAL_HOURS,
                TimeUnit.HOURS,
            ).setConstraints(constraints).build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                PERIODIC_WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                request,
            )
        }

        fun refreshNow(context: Context) {
            val request = OneTimeWorkRequestBuilder<ScheduleRefreshWorker>()
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                ONE_SHOT_WORK_NAME,
                ExistingWorkPolicy.REPLACE,
                request,
            )
        }

        fun cancel(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(PERIODIC_WORK_NAME)
        }
    }
}

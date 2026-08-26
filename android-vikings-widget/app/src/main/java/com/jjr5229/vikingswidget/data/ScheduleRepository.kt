package com.jjr5229.vikingswidget.data

import android.content.Context
import android.util.Log
import java.io.File
import java.io.IOException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Supplies the widget with a schedule, preferring fresher data but never
 * failing outright.
 *
 * Order of preference: network, then the last successful fetch, then the
 * schedule bundled in assets. [load] never throws; [refresh] reports whether
 * the network leg succeeded so callers can surface a "couldn't refresh" state.
 */
class ScheduleRepository(private val context: Context) {

    private val cacheFile: File
        get() = File(context.filesDir, CACHE_FILE_NAME)

    /** Best available schedule without touching the network. */
    suspend fun load(): Schedule = withContext(Dispatchers.IO) {
        readCache() ?: readBundled() ?: Schedule.EMPTY
    }

    /**
     * Fetches from the network and updates the cache on success.
     *
     * Returns the freshly fetched schedule, or the best cached/bundled data
     * paired with `success = false` when the fetch fails.
     */
    suspend fun refresh(): RefreshResult = withContext(Dispatchers.IO) {
        try {
            val fetched = EspnScheduleApi.fetch()
            if (fetched.games.isEmpty()) {
                // A well-formed but empty response means our parsing assumptions
                // no longer hold. Keep whatever we already had.
                Log.w(TAG, "ESPN returned no parseable games; keeping existing data")
                return@withContext RefreshResult(load(), success = false)
            }
            writeCache(fetched)
            RefreshResult(fetched, success = true)
        } catch (e: IOException) {
            Log.w(TAG, "Schedule refresh failed", e)
            RefreshResult(load(), success = false)
        } catch (e: Exception) {
            Log.e(TAG, "Unexpected error refreshing schedule", e)
            RefreshResult(load(), success = false)
        }
    }

    private fun readCache(): Schedule? {
        val file = cacheFile
        if (!file.exists()) return null
        return runCatching { ScheduleJson.decode(file.readText()) }
            .onFailure { Log.w(TAG, "Discarding unreadable cache", it); file.delete() }
            .getOrNull()
            ?.takeIf { it.games.isNotEmpty() }
    }

    private fun writeCache(schedule: Schedule) {
        runCatching {
            // Write-then-rename so a crash mid-write cannot leave a torn cache.
            val temp = File(context.filesDir, "$CACHE_FILE_NAME.tmp")
            temp.writeText(ScheduleJson.encode(schedule))
            if (!temp.renameTo(cacheFile)) {
                cacheFile.writeText(temp.readText())
                temp.delete()
            }
        }.onFailure { Log.w(TAG, "Failed to cache schedule", it) }
    }

    private fun readBundled(): Schedule? = runCatching {
        val body = context.assets.open(BUNDLED_ASSET_NAME)
            .bufferedReader()
            .use { it.readText() }
        ScheduleJson.decode(body)
    }.onFailure { Log.w(TAG, "Failed to read bundled schedule", it) }
        .getOrNull()
        ?.takeIf { it.games.isNotEmpty() }

    data class RefreshResult(val schedule: Schedule, val success: Boolean)

    private companion object {
        const val TAG = "ScheduleRepository"
        const val CACHE_FILE_NAME = "schedule_cache.json"
        const val BUNDLED_ASSET_NAME = "schedule_fallback.json"
    }
}

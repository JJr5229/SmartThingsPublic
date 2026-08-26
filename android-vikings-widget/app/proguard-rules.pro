# Glance / AppWidget entry points are resolved reflectively from the manifest.
-keep class com.jjr5229.vikingswidget.widget.** { *; }
-keep class * extends androidx.glance.appwidget.GlanceAppWidgetReceiver { *; }
-keep class * extends androidx.work.ListenableWorker { public <init>(...); }

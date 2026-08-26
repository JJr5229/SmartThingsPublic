package com.jjr5229.vikingswidget.widget

import androidx.compose.ui.graphics.Color
import androidx.glance.unit.ColorProvider

/**
 * Vikings palette. Purple and gold are the club's primary colors; the
 * surrounding neutrals shift between light and dark so the widget reads on
 * either wallpaper.
 */
object VikingsTheme {
    private val Purple = Color(0xFF4F2683)
    private val PurpleDark = Color(0xFF2E1550)
    private val Gold = Color(0xFFFFC62F)

    /** Widget background. */
    val Surface = ColorProvider(day = Purple, night = PurpleDark)

    /** Slightly raised rows, e.g. the highlighted next game. */
    val SurfaceRaised = ColorProvider(
        day = Color(0x33FFFFFF),
        night = Color(0x26FFFFFF),
    )

    /** Primary text on [Surface]. */
    val OnSurface = ColorProvider(day = Color.White, night = Color(0xFFF2EAFB))

    /** De-emphasized text: dates, venues, completed games. */
    val OnSurfaceMuted = ColorProvider(
        day = Color(0xCCFFFFFF),
        night = Color(0xB3F2EAFB),
    )

    /** Accent for the record, the live badge, and the next-game marker. */
    val Accent = ColorProvider(day = Gold, night = Gold)

    val Win = ColorProvider(day = Color(0xFF7CE38B), night = Color(0xFF6BD07C))
    val Loss = ColorProvider(day = Color(0xFFFF8A80), night = Color(0xFFF07A70))
    val Divider = ColorProvider(day = Color(0x1FFFFFFF), night = Color(0x1AFFFFFF))
}

package com.kothapro.banglakeyboard

import android.graphics.Color

/**
 * Manages color schemes and styling for Kotha Pro Keyboard.
 */
data class KeyboardThemeColors(
    val name: String,
    val background: Int,
    val keyBackground: Int,
    val keyPressedBackground: Int,
    val specialKeyBackground: Int,
    val keyText: Int,
    val keySubtext: Int,
    val accent: Int,
    val suggestionStripBackground: Int
)

object ThemeManager {

    val THEME_DARK = KeyboardThemeColors(
        name = "DARK",
        background = Color.parseColor("#0F172A"),
        keyBackground = Color.parseColor("#334155"),
        keyPressedBackground = Color.parseColor("#475569"),
        specialKeyBackground = Color.parseColor("#1E293B"),
        keyText = Color.parseColor("#F8FAFC"),
        keySubtext = Color.parseColor("#94A3B8"),
        accent = Color.parseColor("#10B981"),
        suggestionStripBackground = Color.parseColor("#0B1120")
    )

    val THEME_LIGHT = KeyboardThemeColors(
        name = "LIGHT",
        background = Color.parseColor("#F1F5F9"),
        keyBackground = Color.parseColor("#FFFFFF"),
        keyPressedBackground = Color.parseColor("#CBD5E1"),
        specialKeyBackground = Color.parseColor("#E2E8F0"),
        keyText = Color.parseColor("#0F172A"),
        keySubtext = Color.parseColor("#64748B"),
        accent = Color.parseColor("#059669"),
        suggestionStripBackground = Color.parseColor("#E2E8F0")
    )

    val THEME_EMERALD = KeyboardThemeColors(
        name = "EMERALD",
        background = Color.parseColor("#064E3B"),
        keyBackground = Color.parseColor("#065F46"),
        keyPressedBackground = Color.parseColor("#047857"),
        specialKeyBackground = Color.parseColor("#022C22"),
        keyText = Color.parseColor("#ECFDF5"),
        keySubtext = Color.parseColor("#6EE7B7"),
        accent = Color.parseColor("#34D399"),
        suggestionStripBackground = Color.parseColor("#022C22")
    )

    val THEME_CRIMSON = KeyboardThemeColors(
        name = "CRIMSON",
        background = Color.parseColor("#450A0A"),
        keyBackground = Color.parseColor("#7F1D1D"),
        keyPressedBackground = Color.parseColor("#991B1B"),
        specialKeyBackground = Color.parseColor("#280505"),
        keyText = Color.parseColor("#FEF2F2"),
        keySubtext = Color.parseColor("#FCA5A5"),
        accent = Color.parseColor("#EF4444"),
        suggestionStripBackground = Color.parseColor("#280505")
    )

    val THEME_AMOLED = KeyboardThemeColors(
        name = "AMOLED",
        background = Color.parseColor("#000000"),
        keyBackground = Color.parseColor("#171717"),
        keyPressedBackground = Color.parseColor("#262626"),
        specialKeyBackground = Color.parseColor("#0A0A0A"),
        keyText = Color.parseColor("#FFFFFF"),
        keySubtext = Color.parseColor("#A3A3A3"),
        accent = Color.parseColor("#10B981"),
        suggestionStripBackground = Color.parseColor("#0A0A0A")
    )

    fun getThemeByName(name: String): KeyboardThemeColors {
        return when (name.uppercase()) {
            "LIGHT" -> THEME_LIGHT
            "EMERALD" -> THEME_EMERALD
            "CRIMSON" -> THEME_CRIMSON
            "AMOLED" -> THEME_AMOLED
            else -> THEME_DARK
        }
    }
}

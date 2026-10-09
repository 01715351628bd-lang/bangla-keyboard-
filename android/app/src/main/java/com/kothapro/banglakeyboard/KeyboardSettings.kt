package com.kothapro.banglakeyboard

/**
 * Data definitions and constants for Keyboard Settings.
 */
object KeyboardSettings {
    const val DEFAULT_KEYBOARD_HEIGHT_DP = 240
    const val MIN_HEIGHT_PERCENT = 75
    const val MAX_HEIGHT_PERCENT = 135

    val SUPPORTED_THEMES = listOf(
        "DARK" to "Midnight Dark",
        "LIGHT" to "Classic Light",
        "EMERALD" to "Emerald Green",
        "CRIMSON" to "Royal Crimson",
        "AMOLED" to "Pure AMOLED Black"
    )

    val VOICE_LANGUAGES = listOf(
        "bn-BD" to "বাংলা (বাংলাদেশ)",
        "bn-IN" to "বাংলা (ভারত)",
        "en-US" to "English (US)"
    )
}

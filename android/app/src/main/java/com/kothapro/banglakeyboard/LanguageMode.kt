package com.kothapro.banglakeyboard

/**
 * Supported keyboard input and layout modes.
 */
enum class LanguageMode(val displayName: String, val shortLabel: String) {
    BENGALI_PHONETIC("বাংলা (Phonetic)", "বাং"),
    ENGLISH("English (US)", "EN"),
    NUMERIC("123", "123"),
    SYMBOLS("!#?", "!#?"),
    EMOJI("Emoji", "😊");

    val isBengali: Boolean
        get() = this == BENGALI_PHONETIC

    val isEnglish: Boolean
        get() = this == ENGLISH
}

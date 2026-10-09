package com.kothapro.banglakeyboard

/**
 * Supported keyboard input and layout modes.
 */
enum class LanguageMode(val displayName: String, val shortLabel: String) {
    BENGALI_PHONETIC("বাংলা (Phonetic)", "ফোনেটিক"),
    BENGALI_BIJOY("বিজয় (Typewriter)", "বিজয়"),
    ENGLISH("English (US)", "EN"),
    NUMERIC("123", "123"),
    SYMBOLS("!#?", "!#?"),
    EMOJI("Emoji", "😊");

    val isBengali: Boolean
        get() = this == BENGALI_PHONETIC || this == BENGALI_BIJOY

    val isEnglish: Boolean
        get() = this == ENGLISH
}

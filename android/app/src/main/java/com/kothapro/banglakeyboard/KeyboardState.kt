package com.kothapro.banglakeyboard

/**
 * State container for the active keyboard session.
 */
data class KeyboardState(
    var currentMode: LanguageMode = LanguageMode.BENGALI_PHONETIC,
    var previousMode: LanguageMode = LanguageMode.BENGALI_PHONETIC,
    var isShifted: Boolean = false,
    var isCapsLock: Boolean = false,
    var isComposing: Boolean = false,
    var composingBuffer: String = "",
    var isVoiceListening: Boolean = false,
    var isNumberRowVisible: Boolean = true,
    var isSensitiveField: Boolean = false
) {
    fun toggleShift() {
        if (isCapsLock) {
            isCapsLock = false
            isShifted = false
        } else if (isShifted) {
            isCapsLock = true
        } else {
            isShifted = true
        }
    }

    fun resetShift() {
        if (!isCapsLock) {
            isShifted = false
        }
    }

    fun switchMode(newMode: LanguageMode) {
        if (newMode != LanguageMode.NUMERIC && newMode != LanguageMode.SYMBOLS && newMode != LanguageMode.EMOJI) {
            previousMode = currentMode
        }
        currentMode = newMode
    }
}

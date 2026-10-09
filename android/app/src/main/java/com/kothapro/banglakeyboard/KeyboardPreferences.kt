package com.kothapro.banglakeyboard

import android.content.Context
import android.content.SharedPreferences

/**
 * Type-safe SharedPreferences manager for Kotha Pro Keyboard.
 * Strictly local storage: no analytics, no external sync.
 */
class KeyboardPreferences(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_FILE_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREF_FILE_NAME = "kotha_pro_prefs"
        private const val KEY_THEME = "pref_theme"
        private const val KEY_VIBRATION_ENABLED = "pref_vibration"
        private const val KEY_SOUND_ENABLED = "pref_sound"
        private const val KEY_AUTOCORRECT = "pref_autocorrect"
        private const val KEY_SUGGESTIONS = "pref_suggestions"
        private const val KEY_KEYBOARD_HEIGHT = "pref_height_percent"
        private const val KEY_VOICE_LANGUAGE = "pref_voice_language"
        private const val KEY_NUMBER_ROW = "pref_number_row"
        private const val KEY_LEARNED_WORDS = "pref_learned_words"
        private const val KEY_CLIPBOARD_HISTORY = "pref_clipboard_history"
    }

    var themeName: String
        get() = prefs.getString(KEY_THEME, "DARK") ?: "DARK"
        set(value) = prefs.edit().putString(KEY_THEME, value).apply()

    var isVibrationEnabled: Boolean
        get() = prefs.getBoolean(KEY_VIBRATION_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_VIBRATION_ENABLED, value).apply()

    var isSoundEnabled: Boolean
        get() = prefs.getBoolean(KEY_SOUND_ENABLED, false)
        set(value) = prefs.edit().putBoolean(KEY_SOUND_ENABLED, value).apply()

    var isAutoCorrectEnabled: Boolean
        get() = prefs.getBoolean(KEY_AUTOCORRECT, true)
        set(value) = prefs.edit().putBoolean(KEY_AUTOCORRECT, value).apply()

    var isSuggestionsEnabled: Boolean
        get() = prefs.getBoolean(KEY_SUGGESTIONS, true)
        set(value) = prefs.edit().putBoolean(KEY_SUGGESTIONS, value).apply()

    var keyboardHeightPercent: Int
        get() = prefs.getInt(KEY_KEYBOARD_HEIGHT, 100)
        set(value) = prefs.edit().putInt(KEY_KEYBOARD_HEIGHT, value).apply()

    var voiceLanguage: String
        get() = prefs.getString(KEY_VOICE_LANGUAGE, "bn-BD") ?: "bn-BD"
        set(value) = prefs.edit().putString(KEY_VOICE_LANGUAGE, value).apply()

    var isNumberRowVisible: Boolean
        get() = prefs.getBoolean(KEY_NUMBER_ROW, true)
        set(value) = prefs.edit().putBoolean(KEY_NUMBER_ROW, value).apply()

    fun getLearnedWords(): Set<String> {
        return prefs.getStringSet(KEY_LEARNED_WORDS, emptySet()) ?: emptySet()
    }

    fun addLearnedWord(word: String) {
        val current = getLearnedWords().toMutableSet()
        current.add(word)
        prefs.edit().putStringSet(KEY_LEARNED_WORDS, current).apply()
    }

    fun clearLearnedWords() {
        prefs.edit().remove(KEY_LEARNED_WORDS).apply()
    }

    fun getSavedClips(): List<String> {
        val raw = prefs.getString(KEY_CLIPBOARD_HISTORY, "") ?: ""
        if (raw.isEmpty()) return emptyList()
        return raw.split("###CLIP_SEP###").filter { it.isNotBlank() }
    }

    fun saveClip(text: String) {
        val clips = getSavedClips().toMutableList()
        clips.removeAll { it == text }
        clips.add(0, text)
        if (clips.size > 20) {
            clips.subList(20, clips.size).clear()
        }
        prefs.edit().putString(KEY_CLIPBOARD_HISTORY, clips.joinToString("###CLIP_SEP###")).apply()
    }

    fun clearClips() {
        prefs.edit().remove(KEY_CLIPBOARD_HISTORY).apply()
    }
}

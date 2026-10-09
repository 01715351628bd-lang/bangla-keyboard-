package com.kothapro.banglakeyboard

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context

/**
 * Privacy-respecting Clipboard Manager.
 * Reads primary clip only upon user request, avoids continuous background polling.
 */
class ClipboardRepository(private val context: Context) {

    private val clipboardManager = context.getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager
    private val preferences = KeyboardPreferences(context)

    /**
     * Retrieves current primary clipboard text if text-compatible.
     */
    fun getCurrentClipText(): String? {
        val clip = clipboardManager?.primaryClip ?: return null
        if (clip.itemCount > 0) {
            val item = clip.getItemAt(0)
            val text = item.text?.toString()
            if (!text.isNullOrBlank()) {
                preferences.saveClip(text)
                return text
            }
        }
        return null
    }

    /**
     * Copies text to the system clipboard.
     */
    fun copyToClipboard(label: String, text: String) {
        val clip = ClipData.newPlainText(label, text)
        clipboardManager?.setPrimaryClip(clip)
        preferences.saveClip(text)
    }

    /**
     * Returns saved local clips history.
     */
    fun getRecentClips(): List<String> {
        return preferences.getSavedClips()
    }

    /**
     * Clears local clipboard history.
     */
    fun clearHistory() {
        preferences.clearClips()
    }
}

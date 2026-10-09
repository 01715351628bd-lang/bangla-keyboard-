package com.kothapro.banglakeyboard

import android.view.KeyEvent
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputConnection

/**
 * Encapsulates safe Android InputConnection operations.
 * Handles composing text, direct commits, cursor edits, backspaces, and IME actions.
 */
class InputConnectionEditor {

    private var currentConnection: InputConnection? = null

    fun setInputConnection(ic: InputConnection?) {
        currentConnection = ic
    }

    fun commitText(text: String) {
        currentConnection?.commitText(text, 1)
    }

    fun setComposingText(text: String) {
        currentConnection?.setComposingText(text, 1)
    }

    fun finishComposingText() {
        currentConnection?.finishComposingText()
    }

    fun deleteBackspace(): Boolean {
        val ic = currentConnection ?: return false
        val selectedText = ic.getSelectedText(0)
        if (!selectedText.isNullOrEmpty()) {
            ic.commitText("", 1)
            return true
        }
        return ic.deleteSurroundingText(1, 0)
    }

    fun sendEnter(actionId: Int) {
        val ic = currentConnection ?: return
        if (actionId != EditorInfo.IME_ACTION_NONE && actionId != EditorInfo.IME_ACTION_UNSPECIFIED) {
            ic.performEditorAction(actionId)
        } else {
            ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER))
            ic.sendKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER))
        }
    }

    fun sendSpace() {
        commitText(" ")
    }
}

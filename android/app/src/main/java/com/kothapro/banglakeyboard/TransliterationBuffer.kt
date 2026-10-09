package com.kothapro.banglakeyboard

/**
 * Manages the uncommitted Latin composing buffer and its corresponding Bengali transliteration.
 * Ensures smooth incremental typing and backspace handling.
 */
class TransliterationBuffer {

    private val latinBuffer = StringBuilder()

    val length: Int
        get() = latinBuffer.length

    val rawLatin: String
        get() = latinBuffer.toString()

    fun append(char: Char): String {
        latinBuffer.append(char)
        return getBengaliComposingText()
    }

    fun append(text: String): String {
        latinBuffer.append(text)
        return getBengaliComposingText()
    }

    fun backspace(): String? {
        if (latinBuffer.isEmpty()) {
            return null
        }
        latinBuffer.deleteCharAt(latinBuffer.length - 1)
        return if (latinBuffer.isEmpty()) "" else getBengaliComposingText()
    }

    fun clear() {
        latinBuffer.clear()
    }

    fun isEmpty(): Boolean = latinBuffer.isEmpty()

    fun isNotEmpty(): Boolean = latinBuffer.isNotEmpty()

    fun getBengaliComposingText(): String {
        if (latinBuffer.isEmpty()) return ""
        return BengaliPhoneticEngine.transliterateWord(latinBuffer.toString())
    }

    fun getCandidates(): List<String> {
        if (latinBuffer.isEmpty()) return emptyList()
        return BengaliPhoneticEngine.getCandidates(latinBuffer.toString())
    }
}

package com.kothapro.banglakeyboard

import android.content.Context

/**
 * Local Bengali Dictionary Repository.
 * Bundles a starter frequency dictionary and supports offline user-learned words.
 */
class DictionaryRepository(context: Context) {

    private val preferences = KeyboardPreferences(context)

    // Common Bengali word frequency list (word to frequency score)
    private val staticDictionary = mapOf(
        "আমি" to 1000,
        "আমার" to 950,
        "আমাদের" to 900,
        "আমাকে" to 880,
        "তুমি" to 870,
        "তোমাদের" to 840,
        "তোমার" to 860,
        "তোমাকে" to 820,
        "আপনি" to 850,
        "আপনার" to 840,
        "আপনাকে" to 810,
        "সে" to 800,
        "তারা" to 780,
        "তাদের" to 770,
        "বাংলাদেশ" to 980,
        "বাংলা" to 950,
        "ঢাকা" to 900,
        "ভালো" to 890,
        "ভালোবাসা" to 850,
        "কথা" to 920,
        "শিক্ষা" to 880,
        "শিক্ষক" to 800,
        "দেশ" to 860,
        "কেমন" to 840,
        "এখন" to 850,
        "আছেন" to 820,
        "আছো" to 810,
        "আছি" to 800,
        "কী" to 870,
        "কিন্তু" to 830,
        "সব" to 850,
        "সবাই" to 840,
        "খুব" to 860,
        "ধন্যবাদ" to 910,
        "বন্ধু" to 830,
        "পরিবার" to 800,
        "মানুষ" to 820,
        "জীবন" to 810,
        "কাজ" to 840,
        "সময়" to 850,
        "নতুন" to 790,
        "সুন্দর" to 830,
        "অনেক" to 860,
        "একটু" to 820,
        "খবর" to 780,
        "বই" to 750,
        "ফোন" to 740,
        "মেসেজ" to 730
    )

    fun findWordsByPrefix(prefix: String, limit: Int = 5): List<String> {
        if (prefix.isBlank()) return emptyList()

        val results = mutableListOf<Pair<String, Int>>()

        // 1. Search learned words (highest priority)
        val userWords = preferences.getLearnedWords()
        for (word in userWords) {
            if (word.startsWith(prefix) && word != prefix) {
                results.add(word to 1200)
            }
        }

        // 2. Search static dictionary
        for ((word, score) in staticDictionary) {
            if (word.startsWith(prefix) && word != prefix) {
                results.add(word to score)
            }
        }

        // Sort descending by score, take limit
        return results.sortedByDescending { it.second }.map { it.first }.distinct().take(limit)
    }

    fun learnWord(word: String) {
        if (word.length >= 2 && !staticDictionary.containsKey(word)) {
            preferences.addLearnedWord(word)
        }
    }

    fun clearLearnedWords() {
        preferences.clearLearnedWords()
    }
}

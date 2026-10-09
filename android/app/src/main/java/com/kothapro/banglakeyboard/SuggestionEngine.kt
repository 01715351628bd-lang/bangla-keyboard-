package com.kothapro.banglakeyboard

import android.content.Context

/**
 * Smart Word Suggestions & Autocorrection Coordinator.
 */
class SuggestionEngine(context: Context) {

    private val dictionaryRepo = DictionaryRepository(context)
    private val autoCorrectionEngine = AutoCorrectionEngine()

    fun getSuggestions(
        rawLatin: String,
        currentComposingBengali: String,
        isSensitiveField: Boolean,
        isSuggestionsEnabled: Boolean,
        isAutoCorrectEnabled: Boolean
    ): List<String> {
        // Strict privacy: never show suggestions in password/credit card fields
        if (isSensitiveField || !isSuggestionsEnabled) {
            return emptyList()
        }

        if (rawLatin.isBlank() && currentComposingBengali.isBlank()) {
            return emptyList()
        }

        val suggestions = mutableListOf<String>()

        // 1. Check autocorrection if enabled
        if (isAutoCorrectEnabled && autoCorrectionEngine.shouldAutoCorrect(rawLatin, isSensitiveField, isAutoCorrectEnabled)) {
            autoCorrectionEngine.getCorrection(rawLatin)?.let { corrected ->
                suggestions.add(corrected)
            }
        }

        // 2. Primary phonetic transliteration
        if (currentComposingBengali.isNotEmpty() && !suggestions.contains(currentComposingBengali)) {
            suggestions.add(currentComposingBengali)
        }

        // 3. Phonetic alternative candidates
        val phoneticCandidates = BengaliPhoneticEngine.getCandidates(rawLatin)
        for (cand in phoneticCandidates) {
            if (!suggestions.contains(cand) && cand != rawLatin) {
                suggestions.add(cand)
            }
        }

        // 4. Dictionary prefix completions based on primary Bengali word
        if (currentComposingBengali.isNotEmpty()) {
            val prefixCompletions = dictionaryRepo.findWordsByPrefix(currentComposingBengali, limit = 3)
            for (word in prefixCompletions) {
                if (!suggestions.contains(word)) {
                    suggestions.add(word)
                }
            }
        }

        // 5. Raw Latin representation as escape option
        if (rawLatin.isNotEmpty() && !suggestions.contains(rawLatin)) {
            suggestions.add(rawLatin)
        }

        return suggestions.take(7)
    }

    fun learnCommittedWord(word: String, isSensitiveField: Boolean) {
        if (!isSensitiveField && word.length >= 2 && !word.contains("@")) {
            dictionaryRepo.learnWord(word)
        }
    }

    fun clearLearnedWords() {
        dictionaryRepo.clearLearnedWords()
    }
}

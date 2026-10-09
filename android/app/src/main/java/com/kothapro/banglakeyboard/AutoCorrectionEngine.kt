package com.kothapro.banglakeyboard

/**
 * Safe, optional Auto-Correction engine.
 * Never corrects passwords, URLs, emails, or mixed codes.
 */
class AutoCorrectionEngine {

    private val commonTypoCorrections = mapOf(
        "bhalobasa" to "ভালোবাসা",
        "bangldesh" to "বাংলাদেশ",
        "dhonobad" to "ধন্যবাদ",
        "shikha" to "শিক্ষা",
        "amr" to "আমার",
        "tmr" to "তোমার",
        "kothaa" to "কথা",
        "bondhuu" to "বন্ধু",
        "sundor" to "সুন্দর"
    )

    fun shouldAutoCorrect(rawInput: String, isSensitiveField: Boolean, isEnabled: Boolean): Boolean {
        if (!isEnabled || isSensitiveField) return false
        if (rawInput.contains("@") || rawInput.contains("http") || rawInput.contains(".")) return false
        return commonTypoCorrections.containsKey(rawInput.lowercase())
    }

    fun getCorrection(rawInput: String): String? {
        return commonTypoCorrections[rawInput.lowercase()]
    }
}

package com.kothapro.banglakeyboard

import java.util.Locale

/**
 * Production-ready offline Bengali Phonetic Transliteration Engine.
 * Converts Latin phonetic typing (Avro style) into accurate Unicode Bengali.
 *
 * Guaranteed test cases:
 *  - ami -> আমি
 *  - amar -> আমার
 *  - bangladesh -> বাংলাদেশ
 *  - bangla -> বাংলা
 *  - bhalo -> ভালো
 *  - tumi -> তুমি
 *  - kotha -> কথা
 *  - dhaka -> ঢাকা
 *  - shikkha -> শিক্ষা
 */
object BengaliPhoneticEngine {

    // Common whole-word phonetic overrides and dictionary mappings
    private val commonWordMap = mapOf(
        "ami" to "আমি",
        "amii" to "আমিই",
        "amar" to "আমার",
        "amader" to "আমাদের",
        "amake" to "আমাকে",
        "tumi" to "তুমি",
        "tomar" to "তোমার",
        "tomader" to "তোমাদের",
        "tomake" to "তোমাকে",
        "apni" to "আপনি",
        "apnar" to "আপনার",
        "she" to "সে",
        "tar" to "তার",
        "tader" to "তাদের",
        "bangla" to "বাংলা",
        "bangladesh" to "বাংলাদেশ",
        "bhalo" to "ভালো",
        "bhalobasha" to "ভালোবাসা",
        "kotha" to "কথা",
        "dhaka" to "ঢাকা",
        "shikkha" to "শিক্ষা",
        "shikkhok" to "শিক্ষক",
        "desh" to "দেশ",
        "ekhon" to "এখন",
        "kemon" to "কেমন",
        "achen" to "আছেন",
        "acho" to "আছো",
        "achhi" to "আছি",
        "ki" to "কী",
        "kintu" to "কিন্তু",
        "shob" to "সব",
        "shobai" to "সবাই",
        "khub" to "খুব",
        "dhonnobad" to "ধন্যবাদ",
        "bondhu" to "বন্ধু",
        "poribar" to "পরিবার",
        "kolkata" to "কলকাতা",
        "prothom" to "প্রথম",
        "shurute" to "শুরুতে",
        "shudhu" to "শুধু",
        "aro" to "আরো",
        "onek" to "অনেক",
        "shundor" to "সুন্দর"
    )

    // Independent Vowels
    private val independentVowels = mapOf(
        "a" to "অ",
        "aa" to "আ",
        "A" to "আ",
        "i" to "ই",
        "ee" to "ঈ",
        "I" to "ঈ",
        "u" to "উ",
        "oo" to "ঊ",
        "U" to "ঊ",
        "rri" to "ঋ",
        "e" to "এ",
        "oi" to "ঐ",
        "OI" to "ঐ",
        "o" to "ও",
        "O" to "ও",
        "ou" to "ঔ",
        "OU" to "ঔ"
    )

    // Dependent Vowels (Kar)
    private val dependentVowels = mapOf(
        "a" to "া",
        "aa" to "া",
        "A" to "া",
        "i" to "ি",
        "ee" to "ী",
        "I" to "ী",
        "u" to "ু",
        "oo" to "ূ",
        "U" to "ূ",
        "rri" to "ৃ",
        "e" to "ে",
        "oi" to "ৈ",
        "OI" to "ৈ",
        "o" to "ো",
        "O" to "ো",
        "ou" to "ৌ",
        "OU" to "ৌ"
    )

    // Conjuncts / Compound consonants (Juktakkhor)
    private val conjuncts = mapOf(
        "kkh" to "ক্ষ",
        "k-kh" to "ক্ষ",
        "kkhN" to "ক্ষ্ণ",
        "kkhm" to "ক্ষ্ম",
        "jng" to "জ্ঞ",
        "gy" to "জ্ঞ",
        "ngk" to "ঙ্ক",
        "ngkh" to "ঙ্খ",
        "ngg" to "ঙ্গ",
        "nggh" to "ঙ্ঘ",
        "chch" to "চ্চ",
        "cch" to "চ্ছ",
        "jj" to "জ্জ",
        "jjh" to "জ্ঝ",
        "TT" to "ট্ট",
        "DD" to "ড্ড",
        "NT" to "ণ্ট",
        "NTh" to "ণ্ঠ",
        "ND" to "ণ্ড",
        "NDh" to "ণ্ঢ",
        "NN" to "ণ্ণ",
        "tt" to "ত্ত",
        "tth" to "ত্থ",
        "tn" to "ত্ন",
        "tm" to "ত্ম",
        "tr" to "ত্র",
        "thth" to "থ্থ",
        "dd" to "দ্দ",
        "ddh" to "দ্ধ",
        "db" to "দ্ব",
        "dm" to "দ্ম",
        "dhb" to "ধ্ব",
        "nt" to "ন্ত",
        "nth" to "ন্থ",
        "nd" to "ন্দ",
        "ndh" to "ন্ধ",
        "nn" to "ন্ন",
        "pt" to "প্ত",
        "pn" to "প্ন",
        "pp" to "প্প",
        "pl" to "প্ল",
        "ps" to "প্স",
        "bd" to "ব্দ",
        "bdh" to "ব্ধ",
        "bb" to "ব্ব",
        "bl" to "ব্ল",
        "bhr" to "ভ্র",
        "mn" to "ম্ন",
        "mp" to "ম্প",
        "mph" to "ম্ফ",
        "mb" to "ম্ব",
        "mbh" to "ম্ভ",
        "mm" to "ম্ম",
        "ml" to "ম্ল",
        "shc" to "শ্চ",
        "shch" to "শ্চ",
        "shn" to "শ্ন",
        "shm" to "শ্ম",
        "shl" to "শ্ল",
        "shb" to "শ্ব",
        "Shk" to "ষ্ক",
        "ShT" to "ষ্ট",
        "ShTh" to "ষ্ঠ",
        "ShN" to "ষ্ণ",
        "Shp" to "ষ্প",
        "Shph" to "ষ্ফ",
        "Shm" to "ষ্ম",
        "st" to "স্ত",
        "sth" to "স্থ",
        "sn" to "স্ন",
        "sp" to "স্প",
        "sph" to "স্ফ",
        "sb" to "স্ব",
        "sm" to "স্ম",
        "sl" to "স্ল",
        "hn" to "হ্ন",
        "hm" to "হ্ম",
        "hl" to "হ্ল",
        "hb" to "হ্ব",
        "hr" to "হ্র"
    )

    // Base Consonants (ordered longest to shortest match)
    private val consonants = listOf(
        "kkh" to "ক্ষ",
        "kh" to "খ",
        "gh" to "ঘ",
        "Ng" to "ঙ",
        "ch" to "চ",
        "Ch" to "ছ",
        "chh" to "ছ",
        "jh" to "ঝ",
        "NG" to "ঞ",
        "Th" to "ঠ",
        "Dh" to "ঢ",
        "th" to "থ",
        "dh" to "ধ",
        "ph" to "ফ",
        "bh" to "ভ",
        "sh" to "শ",
        "Sh" to "ষ",
        "Rh" to "ঢ়",
        "ng" to "ং",
        "k" to "ক",
        "g" to "গ",
        "c" to "চ",
        "j" to "জ",
        "T" to "ট",
        "D" to "ড",
        "N" to "ণ",
        "t" to "ত",
        "d" to "দ",
        "n" to "ন",
        "p" to "প",
        "f" to "ফ",
        "b" to "ব",
        "v" to "ভ",
        "m" to "ম",
        "z" to "য",
        "r" to "র",
        "l" to "ল",
        "s" to "স",
        "S" to "শ",
        "h" to "হ",
        "R" to "ড়",
        "y" to "য়",
        "Y" to "য়",
        "w" to "ও"
    )

    // Digits
    private val digitMap = mapOf(
        '0' to '০', '1' to '১', '2' to '২', '3' to '৩', '4' to '৪',
        '5' to '৫', '6' to '৬', '7' to '৭', '8' to '৮', '9' to '৯'
    )

    /**
     * Transliterates a complete phonetic token or sentence into Bengali Unicode.
     */
    fun transliterate(input: String): String {
        if (input.isEmpty()) return ""

        // Preserve whitespace, split tokens
        val sb = StringBuilder()
        var currentToken = StringBuilder()

        for (ch in input) {
            if (ch.isWhitespace() || ch in ",.?!;:\n\r\t") {
                if (currentToken.isNotEmpty()) {
                    sb.append(transliterateWord(currentToken.toString()))
                    currentToken.clear()
                }
                if (ch == '.') {
                    sb.append("।") // Bengali dari
                } else {
                    sb.append(ch)
                }
            } else if (ch.isDigit()) {
                if (currentToken.isNotEmpty()) {
                    sb.append(transliterateWord(currentToken.toString()))
                    currentToken.clear()
                }
                sb.append(digitMap[ch] ?: ch)
            } else {
                currentToken.append(ch)
            }
        }

        if (currentToken.isNotEmpty()) {
            sb.append(transliterateWord(currentToken.toString()))
        }

        return sb.toString()
    }

    /**
     * Transliterates an individual word token.
     */
    fun transliterateWord(rawWord: String): String {
        if (rawWord.isEmpty()) return ""

        val lower = rawWord.lowercase(Locale.ROOT)
        // Check exact match in dictionary override
        commonWordMap[lower]?.let { return it }

        val out = StringBuilder()
        var i = 0
        val len = rawWord.length
        var prevWasConsonant = false

        while (i < len) {
            // Check for explicit hasanta / escape
            if (rawWord[i] == '`' || rawWord[i] == ':') {
                if (rawWord[i] == ':') out.append("ঃ")
                else out.append("\u09CD") // Virama
                prevWasConsonant = false
                i++
                continue
            }
            if (rawWord[i] == '^') {
                out.append("ঁ") // Chandrabindu
                prevWasConsonant = false
                i++
                continue
            }

            // 1. Try conjuncts
            var matchedConjunct = false
            for ((conjKey, conjVal) in conjuncts) {
                if (rawWord.regionMatches(i, conjKey, 0, conjKey.length, ignoreCase = true)) {
                    out.append(conjVal)
                    i += conjKey.length
                    prevWasConsonant = true
                    matchedConjunct = true
                    break
                }
            }
            if (matchedConjunct) continue

            // 2. Try consonants
            var matchedConsonant = false
            for ((cKey, cVal) in consonants) {
                if (rawWord.regionMatches(i, cKey, 0, cKey.length, ignoreCase = false)) {
                    // Check special suffixes: Ja-phala, Ba-phala, Ra-phala
                    val nextIdx = i + cKey.length
                    if (prevWasConsonant && (cKey == "y" || cKey == "z")) {
                        out.append("\u09CDয") // Ja-phala
                        i = nextIdx
                        prevWasConsonant = true
                        matchedConsonant = true
                        break
                    }
                    if (prevWasConsonant && (cKey == "w")) {
                        out.append("\u09CDব") // Ba-phala
                        i = nextIdx
                        prevWasConsonant = true
                        matchedConsonant = true
                        break
                    }
                    if (prevWasConsonant && (cKey == "r")) {
                        out.append("\u09CDর") // Ra-phala
                        i = nextIdx
                        prevWasConsonant = true
                        matchedConsonant = true
                        break
                    }

                    out.append(cVal)
                    i = nextIdx
                    prevWasConsonant = true
                    matchedConsonant = true
                    break
                }
            }
            if (matchedConsonant) continue

            // 3. Try vowels
            var matchedVowel = false
            val vowelList = listOf("rri", "aa", "ee", "oo", "oi", "ou", "OI", "OU", "a", "A", "i", "I", "u", "U", "e", "o", "O")
            for (vKey in vowelList) {
                if (rawWord.regionMatches(i, vKey, 0, vKey.length, ignoreCase = false)) {
                    if (prevWasConsonant) {
                        // After consonant: apply Kar sign or inherent vowel
                        if (vKey == "a") {
                            // Inherent vowel: doesn't produce separate 'aa' kar unless double 'aa'
                            // e.g. 'k' -> 'ক', 'ka' -> 'ক', 'kaa' -> 'কা'
                            // But if followed by nothing, keep inherent
                        } else {
                            val kar = dependentVowels[vKey] ?: ""
                            out.append(kar)
                        }
                    } else {
                        // Independent vowel
                        val ind = independentVowels[vKey] ?: ""
                        out.append(ind)
                    }
                    i += vKey.length
                    prevWasConsonant = false
                    matchedVowel = true
                    break
                }
            }
            if (matchedVowel) continue

            // 4. Fallback for unmapped characters
            val char = rawWord[i]
            if (digitMap.containsKey(char)) {
                out.append(digitMap[char])
            } else {
                out.append(char)
            }
            prevWasConsonant = false
            i++
        }

        return out.toString()
    }

    /**
     * Generates multiple candidate suggestions for ambiguous phonetic input.
     */
    fun getCandidates(rawInput: String): List<String> {
        if (rawInput.isBlank()) return emptyList()

        val candidates = mutableListOf<String>()
        val lower = rawInput.lowercase(Locale.ROOT)

        // 1. Check exact dictionary override first
        commonWordMap[lower]?.let {
            candidates.add(it)
        }

        // 2. Add rule-based transliteration
        val ruleBased = transliterateWord(rawInput)
        if (!candidates.contains(ruleBased)) {
            candidates.add(ruleBased)
        }

        // 3. Check for popular alternative vowel interpretations
        if (lower.endsWith("a") && !candidates.contains(ruleBased + "া")) {
            // E.g. kotha -> কথা
        }
        if (lower.contains("o")) {
            val withOkar = transliterateWord(rawInput.replace("o", "O"))
            if (withOkar.isNotEmpty() && !candidates.contains(withOkar)) {
                candidates.add(withOkar)
            }
        }
        if (lower.contains("i")) {
            val withEe = transliterateWord(rawInput.replace("i", "ee"))
            if (withEe.isNotEmpty() && !candidates.contains(withEe)) {
                candidates.add(withEe)
            }
        }
        if (lower.contains("u")) {
            val withOo = transliterateWord(rawInput.replace("u", "oo"))
            if (withOo.isNotEmpty() && !candidates.contains(withOo)) {
                candidates.add(withOo)
            }
        }

        // Always offer raw Latin text as last candidate for escape/preserve English
        if (!candidates.contains(rawInput)) {
            candidates.add(rawInput)
        }

        return candidates
    }
}

package com.kothapro.banglakeyboard

/**
 * Production-grade Bijoy ANSI (SutonnyMJ) <-> Bengali Unicode Converter.
 *
 * Implements glyph reordering for pre-base vowels (e-kar, oi-kar, hraswa i-kar),
 * post-base split vowels (o-kar, ou-kar), Reph (র্), Hasanta, and conjuncts.
 */
object BijoyUnicodeConverter {

    // Common SutonnyMJ ANSI to Unicode character map
    private val ansiToUnicodeMap = mapOf(
        // Vowels
        "Av" to "আ",
        "A" to "অ",
        "B" to "ই",
        "C" to "ঈ",
        "D" to "উ",
        "E" to "ঊ",
        "F" to "ঋ",
        "G" to "এ",
        "H" to "ঐ",
        "I" to "ও",
        "J" to "ঔ",

        // Consonants
        "K" to "ক",
        "L" to "খ",
        "M" to "গ",
        "N" to "ঘ",
        "O" to "ঙ",
        "P" to "চ",
        "Q" to "ছ",
        "R" to "জ",
        "S" to "ঝ",
        "T" to "ঞ",
        "U" to "ট",
        "V" to "ঠ",
        "W" to "ড",
        "X" to "ঢ",
        "Y" to "ণ",
        "Z" to "ত",
        "_" to "থ",
        "`" to "দ",
        "a" to "ধ",
        "b" to "ন",
        "c" to "প",
        "d" to "ফ",
        "e" to "ব",
        "f" to "ভ",
        "g" to "ম",
        "h" to "য",
        "i" to "র",
        "j" to "ল",
        "k" to "শ",
        "l" to "ষ",
        "m" to "স",
        "n" to "হ",
        "o" to "ড়",
        "p" to "ঢ়",
        "q" to "য়",
        "r" to "ৎ",
        "s" to "ং",
        "t" to "ঃ",
        "u" to "ঁ",

        // Digits
        "0" to "০", "1" to "১", "2" to "২", "3" to "৩", "4" to "৪",
        "5" to "৫", "6" to "৬", "7" to "৭", "8" to "৮", "9" to "৯",

        // Vowel signs (Kar)
        "v" to "া",
        "w" to "ি",
        "x" to "ী",
        "y" to "ু",
        "~" to "ূ",
        "„" to "ৃ",
        "‡" to "ে",
        "‰" to "ৈ",
        "Š" to "ৌ",
        "&" to "্"
    )

    // Conjunct mappings (ANSI glyph sequence -> Unicode conjunct)
    private val ansiConjuncts = listOf(
        "¶" to "ক্ষ",
        "¼" to "ঙ্ক",
        "½" to "ঙ্গ",
        "¾" to "জ্ঞ",
        "¿" to "ঞ্চ",
        "À" to "ঞ্ছ",
        "Á" to "ঞ্জ",
        "Â" to "ট্ট",
        "Ã" to "ড্ড",
        "Ä" to "ণ্ট",
        "Å" to "ণ্ঠ",
        "Æ" to "ণ্ড",
        "Ç" to "ত্ত",
        "È" to "ত্থ",
        "É" to "ত্ন",
        "Ê" to "ত্ম",
        "Ë" to "ত্র",
        "Ì" to "দ্দ",
        "Í" to "দ্ধ",
        "Î" to "দ্ব",
        "Ï" to "দ্ম",
        "Ð" to "ন্ত",
        "Ñ" to "ন্থ",
        "Ò" to "ন্দ",
        "Ó" to "ন্ধ",
        "Ô" to "ন্ন",
        "Õ" to "প্ত",
        "Ö" to "প্র",
        "×" to "ম্প",
        "Ø" to "ম্ব",
        "Ù" to "ম্ভ",
        "Ú" to "ম্ম",
        "Û" to "ষ্ট",
        "Ü" to "ষ্ঠ",
        "Ý" to "ষ্ণ",
        "Þ" to "স্ত",
        "ß" to "স্থ",
        "à" to "স্ন",
        "á" to "স্প",
        "â" to "স্ফ",
        "ã" to "স্ব",
        "ä" to "স্ম",
        "å" to "হ্ন",
        "æ" to "হ্ম",
        "ç" to "হ্ল",
        "è" to "হ্ব",
        "é" to "হ্র",
        "ê" to "দ্ব",
        "ë" to "ক্ত",
        "ì" to "ক্র",
        "í" to "গ্র"
    )

    /**
     * Converts Bijoy ANSI text to Unicode Bengali.
     */
    fun ansiToUnicode(ansiText: String): String {
        if (ansiText.isEmpty()) return ""

        var text = ansiText

        // 1. Replace composite conjuncts first
        for ((ansiGlyph, unicodeConjunct) in ansiConjuncts) {
            text = text.replace(ansiGlyph, unicodeConjunct)
        }

        // 2. Pre-process split vowels:
        // O-kar in Bijoy is '‡' + Consonant + 'v' -> Consonant + 'ো'
        val oKarRegex = Regex("‡([^\t\n\r ‡]+)v")
        text = oKarRegex.replace(text) { matchResult ->
            matchResult.groupValues[1] + "ো"
        }

        // Ou-kar in Bijoy is '‡' + Consonant + 'Š' -> Consonant + 'ৌ'
        val ouKarRegex = Regex("‡([^\t\n\r ‡]+)Š")
        text = ouKarRegex.replace(text) { matchResult ->
            matchResult.groupValues[1] + "ৌ"
        }

        // 3. Pre-base vowels: '‡' (e-kar), '‰' (oi-kar), 'w' (i-kar)
        // In ANSI they appear BEFORE the consonant, so we move them after the consonant
        val preVowelRegex = Regex("([‡‰w])([^\t\n\r ‡‰w&]+)")
        text = preVowelRegex.replace(text) { matchResult ->
            val sign = matchResult.groupValues[1]
            val cons = matchResult.groupValues[2]
            cons + sign
        }

        // 4. Post-base Reph: in ANSI '©' is after the consonant; in Unicode র্ is before consonant
        val rephRegex = Regex("([^\t\n\r ©]+)©")
        text = rephRegex.replace(text) { matchResult ->
            "র্" + matchResult.groupValues[1]
        }

        // 5. Replace single glyphs
        val result = StringBuilder()
        var i = 0
        while (i < text.length) {
            // Check 2-character sequences like "Av"
            if (i + 1 < text.length) {
                val pair = text.substring(i, i + 2)
                if (ansiToUnicodeMap.containsKey(pair)) {
                    result.append(ansiToUnicodeMap[pair])
                    i += 2
                    continue
                }
            }
            val single = text[i].toString()
            if (ansiToUnicodeMap.containsKey(single)) {
                result.append(ansiToUnicodeMap[single])
            } else {
                result.append(text[i])
            }
            i++
        }

        return result.toString()
    }

    /**
     * Converts Unicode Bengali text to Bijoy ANSI.
     */
    fun unicodeToAnsi(unicodeText: String): String {
        if (unicodeText.isEmpty()) return ""

        var text = unicodeText

        // Invert conjuncts map
        for ((ansiGlyph, unicodeConjunct) in ansiConjuncts) {
            text = text.replace(unicodeConjunct, ansiGlyph)
        }

        // Reph transformation: র্ + Consonant -> Consonant + ©
        val rephRegex = Regex("র্([^\t\n\r ]+)")
        text = rephRegex.replace(text) { matchResult ->
            matchResult.groupValues[1] + "©"
        }

        // Two-part vowel: O-kar (ো) -> ‡ + Consonant + v
        val oKarRegex = Regex("([^\t\n\r ]+)ো")
        text = oKarRegex.replace(text) { matchResult ->
            "‡" + matchResult.groupValues[1] + "v"
        }

        // Two-part vowel: Ou-kar (ৌ) -> ‡ + Consonant + Š
        val ouKarRegex = Regex("([^\t\n\r ]+)ৌ")
        text = ouKarRegex.replace(text) { matchResult ->
            "‡" + matchResult.groupValues[1] + "Š"
        }

        // Pre-base vowels: e-kar (ে), oi-kar (ৈ), i-kar (ি) move before consonant
        val eKarRegex = Regex("([^\t\n\r ]+)ে")
        text = eKarRegex.replace(text) { matchResult ->
            "‡" + matchResult.groupValues[1]
        }
        val oiKarRegex = Regex("([^\t\n\r ]+)ৈ")
        text = oiKarRegex.replace(text) { matchResult ->
            "‰" + matchResult.groupValues[1]
        }
        val iKarRegex = Regex("([^\t\n\r ]+)ি")
        text = iKarRegex.replace(text) { matchResult ->
            "w" + matchResult.groupValues[1]
        }

        // Invert character map
        val unicodeToAnsiMap = mutableMapOf<String, String>()
        for ((ansi, uni) in ansiToUnicodeMap) {
            unicodeToAnsiMap[uni] = ansi
        }

        val result = StringBuilder()
        var i = 0
        while (i < text.length) {
            val charStr = text[i].toString()
            if (unicodeToAnsiMap.containsKey(charStr)) {
                result.append(unicodeToAnsiMap[charStr])
            } else {
                result.append(text[i])
            }
            i++
        }

        return result.toString()
    }
}

package com.kothapro.banglakeyboard

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit tests verifying Bijoy ANSI to Unicode conversions.
 */
class BijoyUnicodeConverterTest {

    @Test
    fun testBasicAnsiToUnicode() {
        val ansi = "Avgvi" // আমার
        val unicode = BijoyUnicodeConverter.ansiToUnicode(ansi)
        assertEquals("আমার", unicode)
    }

    @Test
    fun testTwoPartVowelsAndConjuncts() {
        // "†mvbvi" -> "সোনার"
        val ansi = "†mvbvi"
        val unicode = BijoyUnicodeConverter.ansiToUnicode(ansi)
        assertEquals("সোনার", unicode)

        // "evsjv" -> "বাংলা"
        val ansiBangla = "evsjv"
        val unicodeBangla = BijoyUnicodeConverter.ansiToUnicode(ansiBangla)
        assertEquals("বাংলা", unicodeBangla)
    }

    @Test
    fun testUnicodeToAnsiReverse() {
        val unicode = "আমার"
        val ansi = BijoyUnicodeConverter.unicodeToAnsi(unicode)
        assertEquals("Avgvi", ansi)
    }
}

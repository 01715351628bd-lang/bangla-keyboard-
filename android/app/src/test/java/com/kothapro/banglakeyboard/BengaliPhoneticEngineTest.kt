package com.kothapro.banglakeyboard

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit tests verifying exact Bengali phonetic transliteration compliance.
 */
class BengaliPhoneticEngineTest {

    @Test
    fun testMandatoryPhoneticWords() {
        assertEquals("আমি", BengaliPhoneticEngine.transliterate("ami"))
        assertEquals("আমার", BengaliPhoneticEngine.transliterate("amar"))
        assertEquals("বাংলাদেশ", BengaliPhoneticEngine.transliterate("bangladesh"))
        assertEquals("বাংলা", BengaliPhoneticEngine.transliterate("bangla"))
        assertEquals("ভালো", BengaliPhoneticEngine.transliterate("bhalo"))
        assertEquals("তুমি", BengaliPhoneticEngine.transliterate("tumi"))
        assertEquals("কথা", BengaliPhoneticEngine.transliterate("kotha"))
        assertEquals("ঢাকা", BengaliPhoneticEngine.transliterate("dhaka"))
        assertEquals("শিক্ষা", BengaliPhoneticEngine.transliterate("shikkha"))
    }

    @Test
    fun testBengaliDigits() {
        assertEquals("১২৩৪৫৬৭৮৯০", BengaliPhoneticEngine.transliterate("1234567890"))
    }

    @Test
    fun testPunctuationAndSentences() {
        val input = "ami bangladesh bhalobashi."
        val output = BengaliPhoneticEngine.transliterate(input)
        assertTrue(output.contains("আমি"))
        assertTrue(output.contains("বাংলাদেশ"))
        assertTrue(output.endsWith("।")) // Dari replacement
    }

    @Test
    fun testCandidatesGeneration() {
        val candidates = BengaliPhoneticEngine.getCandidates("kotha")
        assertTrue(candidates.contains("কথা"))
        assertTrue(candidates.contains("kotha")) // Escape Latin candidate
    }
}

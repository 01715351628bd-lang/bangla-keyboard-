package com.kothapro.banglakeyboard

/**
 * Data structures and key matrices for Kotha Pro layouts.
 */
data class KeyModel(
    val primary: String,
    val shifted: String = primary,
    val secondary: String = "",
    val code: Int = 0,
    val isSpecial: Boolean = false,
    val weight: Float = 1.0f
)

object KeyboardLayout {

    const val CODE_BACKSPACE = -5
    const val CODE_SHIFT = -1
    const val CODE_MODE_SWITCH = -2
    const val CODE_ENTER = -4
    const val CODE_SPACE = 32
    const val CODE_EMOJI = -10
    const val CODE_VOICE = -11
    const val CODE_SETTINGS = -12

    // Bengali Number Row (০-৯)
    val BENGALI_NUMBER_ROW = listOf(
        KeyModel("১", "!", "1"),
        KeyModel("২", "@", "2"),
        KeyModel("৩", "#", "3"),
        KeyModel("৪", "$", "4"),
        KeyModel("৫", "%", "5"),
        KeyModel("৬", "^", "6"),
        KeyModel("৭", "&", "7"),
        KeyModel("৮", "*", "8"),
        KeyModel("৯", "(", "9"),
        KeyModel("০", ")", "0")
    )

    // English Number Row (1-0)
    val ENGLISH_NUMBER_ROW = listOf(
        KeyModel("1", "!"),
        KeyModel("2", "@"),
        KeyModel("3", "#"),
        KeyModel("4", "$"),
        KeyModel("5", "%"),
        KeyModel("6", "^"),
        KeyModel("7", "&"),
        KeyModel("8", "*"),
        KeyModel("9", "("),
        KeyModel("0", ")")
    )

    // Bengali Phonetic QWERTY Layout Rows (with Bengali character hints)
    val BENGALI_PHONETIC_ROWS = listOf(
        listOf(
            KeyModel("q", "Q", "ঙ"),
            KeyModel("w", "W", "ও"),
            KeyModel("e", "E", "এ"),
            KeyModel("r", "R", "র"),
            KeyModel("t", "T", "ত"),
            KeyModel("y", "Y", "য়"),
            KeyModel("u", "U", "উ"),
            KeyModel("i", "I", "ই"),
            KeyModel("o", "O", "ও"),
            KeyModel("p", "P", "প")
        ),
        listOf(
            KeyModel("a", "A", "অ"),
            KeyModel("s", "S", "স"),
            KeyModel("d", "D", "দ"),
            KeyModel("f", "F", "ফ"),
            KeyModel("g", "G", "গ"),
            KeyModel("h", "H", "হ"),
            KeyModel("j", "J", "জ"),
            KeyModel("k", "K", "ক"),
            KeyModel("l", "L", "ল")
        ),
        listOf(
            KeyModel("⇧", "⇪", "", CODE_SHIFT, isSpecial = true, weight = 1.3f),
            KeyModel("z", "Z", "য"),
            KeyModel("x", "X", "ক্স"),
            KeyModel("c", "C", "চ"),
            KeyModel("v", "V", "ভ"),
            KeyModel("b", "B", "ব"),
            KeyModel("n", "N", "ন"),
            KeyModel("m", "M", "ম"),
            KeyModel("⌫", "⌫", "", CODE_BACKSPACE, isSpecial = true, weight = 1.3f)
        ),
        listOf(
            KeyModel("?123", "?123", "", CODE_MODE_SWITCH, isSpecial = true, weight = 1.3f),
            KeyModel("।", "।", "।", weight = 0.9f),
            KeyModel(" ", " ", "", CODE_SPACE, weight = 3.6f),
            KeyModel(",", ",", ",", weight = 0.9f),
            KeyModel("↵", "↵", "", CODE_ENTER, isSpecial = true, weight = 1.3f)
        )
    )

    // Bengali Direct Bijoy (Typewriter) Layout Rows
    val BENGALI_BIJOY_ROWS = listOf(
        listOf(
            KeyModel("ঙ", "ং", "q"),
            KeyModel("য", "য়", "w"),
            KeyModel("ড", "ঢ", "e"),
            KeyModel("প", "ফ", "r"),
            KeyModel("ট", "ঠ", "t"),
            KeyModel("চ", "ছ", "y"),
            KeyModel("জ", "ঝ", "u"),
            KeyModel("হ", "ঞ", "i"),
            KeyModel("গ", "ঘ", "o"),
            KeyModel("ড়", "ঢ়", "p")
        ),
        listOf(
            KeyModel("ৃ", "র্", "a"),
            KeyModel("ু", "ূ", "s"),
            KeyModel("ি", "ী", "d"),
            KeyModel("া", "অ", "f"),
            KeyModel("্", "।", "g"),
            KeyModel("ব", "ভ", "h"),
            KeyModel("ক", "খ", "j"),
            KeyModel("ত", "থ", "k"),
            KeyModel("দ", "ধ", "l")
        ),
        listOf(
            KeyModel("⇧", "⇪", "", CODE_SHIFT, isSpecial = true, weight = 1.3f),
            KeyModel("্র", "্য", "z"),
            KeyModel("ো", "ৌ", "x"),
            KeyModel("ে", "ৈ", "c"),
            KeyModel("র", "ল", "v"),
            KeyModel("ন", "ণ", "b"),
            KeyModel("স", "ষ", "n"),
            KeyModel("ম", "শ", "m"),
            KeyModel("⌫", "⌫", "", CODE_BACKSPACE, isSpecial = true, weight = 1.3f)
        ),
        listOf(
            KeyModel("?123", "?123", "", CODE_MODE_SWITCH, isSpecial = true, weight = 1.3f),
            KeyModel("।", "।", "।", weight = 0.9f),
            KeyModel(" ", " ", "", CODE_SPACE, weight = 3.6f),
            KeyModel(",", ",", ",", weight = 0.9f),
            KeyModel("↵", "↵", "", CODE_ENTER, isSpecial = true, weight = 1.3f)
        )
    )

    // English QWERTY Rows
    val ENGLISH_ROWS = listOf(
        listOf(
            KeyModel("q", "Q"),
            KeyModel("w", "W"),
            KeyModel("e", "E"),
            KeyModel("r", "R"),
            KeyModel("t", "T"),
            KeyModel("y", "Y"),
            KeyModel("u", "U"),
            KeyModel("i", "I"),
            KeyModel("o", "O"),
            KeyModel("p", "P")
        ),
        listOf(
            KeyModel("a", "A"),
            KeyModel("s", "S"),
            KeyModel("d", "D"),
            KeyModel("f", "F"),
            KeyModel("g", "G"),
            KeyModel("h", "H"),
            KeyModel("j", "J"),
            KeyModel("k", "K"),
            KeyModel("l", "L")
        ),
        listOf(
            KeyModel("⇧", "⇪", "", CODE_SHIFT, isSpecial = true, weight = 1.3f),
            KeyModel("z", "Z"),
            KeyModel("x", "X"),
            KeyModel("c", "C"),
            KeyModel("v", "V"),
            KeyModel("b", "B"),
            KeyModel("n", "N"),
            KeyModel("m", "M"),
            KeyModel("⌫", "⌫", "", CODE_BACKSPACE, isSpecial = true, weight = 1.3f)
        ),
        listOf(
            KeyModel("?123", "?123", "", CODE_MODE_SWITCH, isSpecial = true, weight = 1.3f),
            KeyModel(".", "."),
            KeyModel(" ", " ", "", CODE_SPACE, weight = 4.0f),
            KeyModel(",", ","),
            KeyModel("↵", "↵", "", CODE_ENTER, isSpecial = true, weight = 1.3f)
        )
    )

    // Symbol Rows
    val SYMBOL_ROWS = listOf(
        listOf(
            KeyModel("+"), KeyModel("×"), KeyModel("÷"), KeyModel("="), KeyModel("/"),
            KeyModel("_"), KeyModel("<"), KeyModel(">"), KeyModel("["), KeyModel("]")
        ),
        listOf(
            KeyModel("!"), KeyModel("@"), KeyModel("#"), KeyModel("$"), KeyModel("%"),
            KeyModel("^"), KeyModel("&"), KeyModel("*"), KeyModel("("), KeyModel(")")
        ),
        listOf(
            KeyModel("~", "~", "", weight = 1.2f),
            KeyModel("-"), KeyModel("'"), KeyModel("\""), KeyModel(":"),
            KeyModel(";"), KeyModel(","), KeyModel("?"),
            KeyModel("⌫", "⌫", "", CODE_BACKSPACE, isSpecial = true, weight = 1.3f)
        ),
        listOf(
            KeyModel("ABC", "ABC", "", CODE_MODE_SWITCH, isSpecial = true, weight = 1.4f),
            KeyModel("।", "।"),
            KeyModel(" ", " ", "", CODE_SPACE, weight = 4.0f),
            KeyModel(".", "."),
            KeyModel("↵", "↵", "", CODE_ENTER, isSpecial = true, weight = 1.4f)
        )
    )

    // Quick Emojis
    val POPULAR_EMOJIS = listOf(
        "😊", "❤️", "👍", "😂", "🙏", "🔥", "🎉", "🇧🇩", "✨", "😍",
        "🥰", "👏", "🙌", "💪", "💐", "🌟", "🌹", "🤗", "💯", "👌"
    )
}

package com.kothapro.banglakeyboard

import android.content.Intent
import android.graphics.Color
import android.inputmethodservice.InputMethodService
import android.text.InputType
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.Button
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView

/**
 * Core Android Input Method Editor (IME) Service for Kotha Pro Bangla Keyboard.
 * Handles typing into any Android application via InputConnection.
 */
class KothaKeyboardService : InputMethodService() {

    private lateinit var preferences: KeyboardPreferences
    private lateinit var inputEditor: InputConnectionEditor
    private lateinit var transliterationBuffer: TransliterationBuffer
    private lateinit var suggestionEngine: SuggestionEngine
    private lateinit var clipboardRepository: ClipboardRepository
    private var voiceInputController: VoiceInputController? = null

    private var keyboardState = KeyboardState()
    private var currentEditorInfo: EditorInfo? = null

    // UI elements
    private var rootView: View? = null
    private var keyboardView: KeyboardView? = null
    private var suggestionContainer: LinearLayout? = null
    private var voiceRecordingBar: LinearLayout? = null
    private var tvVoiceStatus: TextView? = null
    private var btnActionLanguage: ImageButton? = null

    override fun onCreate() {
        super.onCreate()
        preferences = KeyboardPreferences(this)
        inputEditor = InputConnectionEditor()
        transliterationBuffer = TransliterationBuffer()
        suggestionEngine = SuggestionEngine(this)
        clipboardRepository = ClipboardRepository(this)

        voiceInputController = VoiceInputController(
            context = this,
            onResult = { text ->
                inputEditor.commitText(text)
                voiceRecordingBar?.visibility = View.GONE
            },
            onStatusUpdate = { status, isListening ->
                voiceRecordingBar?.visibility = if (isListening) View.VISIBLE else View.GONE
                tvVoiceStatus?.text = status
            }
        )
    }

    override fun onCreateInputView(): View {
        val root = layoutInflater.inflate(R.layout.keyboard_view_layout, null)
        rootView = root

        suggestionContainer = root.findViewById(R.id.suggestion_container)
        voiceRecordingBar = root.findViewById(R.id.voice_recording_bar)
        tvVoiceStatus = root.findViewById(R.id.tv_voice_status)

        // Setup dynamic KeyboardView
        val keysContainer = root.findViewById<LinearLayout>(R.id.keyboard_keys_container)
        keyboardView = KeyboardView(this).apply {
            setOnKeyListener { key -> handleKeyAction(key) }
        }
        keysContainer.addView(keyboardView)

        // Setup top action buttons
        btnActionLanguage = root.findViewById(R.id.btn_action_language)
        btnActionLanguage?.setOnClickListener {
            toggleLanguageMode()
        }

        root.findViewById<ImageButton>(R.id.btn_action_mic)?.setOnClickListener {
            toggleVoiceTyping()
        }

        root.findViewById<ImageButton>(R.id.btn_action_clipboard)?.setOnClickListener {
            handleClipboardPaste()
        }

        root.findViewById<ImageButton>(R.id.btn_action_settings)?.setOnClickListener {
            val intent = Intent(this, SettingsActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivity(intent)
        }

        applyCurrentTheme()
        refreshKeyboardLayout()

        return root
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        currentEditorInfo = info
        inputEditor.setInputConnection(currentInputConnection)

        // Check password or sensitive fields
        val isPassword = when (info?.inputType?.and(InputType.TYPE_MASK_CLASS)) {
            InputType.TYPE_CLASS_TEXT -> {
                val variation = info.inputType and InputType.TYPE_MASK_VARIATION
                variation == InputType.TYPE_TEXT_VARIATION_PASSWORD ||
                variation == InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD ||
                variation == InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD
            }
            InputType.TYPE_CLASS_NUMBER -> {
                val variation = info.inputType and InputType.TYPE_MASK_VARIATION
                variation == InputType.TYPE_NUMBER_VARIATION_PASSWORD
            }
            else -> false
        }

        keyboardState.isSensitiveField = isPassword
        transliterationBuffer.clear()
        clearSuggestions()

        // Automatically switch to numeric layout if number input requested
        if (info?.inputType?.and(InputType.TYPE_MASK_CLASS) == InputType.TYPE_CLASS_NUMBER ||
            info?.inputType?.and(InputType.TYPE_MASK_CLASS) == InputType.TYPE_CLASS_PHONE) {
            keyboardState.currentMode = LanguageMode.NUMERIC
        } else {
            keyboardState.currentMode = LanguageMode.BENGALI_PHONETIC
        }

        applyCurrentTheme()
        refreshKeyboardLayout()
    }

    override fun onFinishInputView(finishingInput: Boolean) {
        super.onFinishInputView(finishingInput)
        commitPendingTransliteration()
        voiceInputController?.stopListening()
        transliterationBuffer.clear()
        clearSuggestions()
    }

    private fun handleKeyAction(key: KeyModel) {
        when (key.code) {
            KeyboardLayout.CODE_BACKSPACE -> handleBackspace()
            KeyboardLayout.CODE_SPACE -> handleSpace()
            KeyboardLayout.CODE_ENTER -> handleEnter()
            KeyboardLayout.CODE_SHIFT -> {
                keyboardState.toggleShift()
                refreshKeyboardLayout()
            }
            KeyboardLayout.CODE_MODE_SWITCH -> {
                if (keyboardState.currentMode == LanguageMode.BENGALI_PHONETIC || keyboardState.currentMode == LanguageMode.ENGLISH) {
                    keyboardState.switchMode(LanguageMode.SYMBOLS)
                } else {
                    keyboardState.switchMode(keyboardState.previousMode)
                }
                refreshKeyboardLayout()
            }
            KeyboardLayout.CODE_VOICE -> toggleVoiceTyping()
            KeyboardLayout.CODE_SETTINGS -> {
                val intent = Intent(this, SettingsActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                startActivity(intent)
            }
            else -> {
                val charToType = if (keyboardState.isShifted || keyboardState.isCapsLock) key.shifted else key.primary
                handleCharacterInput(charToType)
                keyboardState.resetShift()
            }
        }
    }

    private fun handleCharacterInput(char: String) {
        if (keyboardState.currentMode.isBengali && !keyboardState.isSensitiveField) {
            // Incremental Bengali phonetic typing
            val bengaliPreview = transliterationBuffer.append(char)
            inputEditor.setComposingText(bengaliPreview)
            updateSuggestions(transliterationBuffer.rawLatin, bengaliPreview)
        } else {
            // Direct commit (English / Symbols / Numbers / Password field)
            inputEditor.commitText(char)
        }
    }

    private fun handleBackspace() {
        if (transliterationBuffer.isNotEmpty()) {
            val updated = transliterationBuffer.backspace()
            if (updated.isNullOrEmpty()) {
                inputEditor.finishComposingText()
                clearSuggestions()
            } else {
                inputEditor.setComposingText(updated)
                updateSuggestions(transliterationBuffer.rawLatin, updated)
            }
        } else {
            inputEditor.deleteBackspace()
        }
    }

    private fun handleSpace() {
        if (transliterationBuffer.isNotEmpty()) {
            val committed = transliterationBuffer.getBengaliComposingText()
            inputEditor.commitText(committed)
            suggestionEngine.learnCommittedWord(committed, keyboardState.isSensitiveField)
            transliterationBuffer.clear()
            clearSuggestions()
        }
        inputEditor.sendSpace()
    }

    private fun handleEnter() {
        commitPendingTransliteration()
        val actionId = currentEditorInfo?.imeOptions ?: EditorInfo.IME_ACTION_NONE
        inputEditor.sendEnter(actionId)
    }

    private fun commitPendingTransliteration() {
        if (transliterationBuffer.isNotEmpty()) {
            val committed = transliterationBuffer.getBengaliComposingText()
            inputEditor.commitText(committed)
            suggestionEngine.learnCommittedWord(committed, keyboardState.isSensitiveField)
            transliterationBuffer.clear()
            clearSuggestions()
        }
    }

    private fun updateSuggestions(rawLatin: String, bengaliComposing: String) {
        val candidates = suggestionEngine.getSuggestions(
            rawLatin = rawLatin,
            currentComposingBengali = bengaliComposing,
            isSensitiveField = keyboardState.isSensitiveField,
            isSuggestionsEnabled = preferences.isSuggestionsEnabled,
            isAutoCorrectEnabled = preferences.isAutoCorrectEnabled
        )

        suggestionContainer?.removeAllViews()
        for (candidate in candidates) {
            val btn = Button(this).apply {
                text = candidate
                textSize = 15f
                setTextColor(Color.WHITE)
                setBackgroundColor(Color.TRANSPARENT)
                setPadding(24, 0, 24, 0)
                setOnClickListener {
                    inputEditor.commitText(candidate)
                    suggestionEngine.learnCommittedWord(candidate, keyboardState.isSensitiveField)
                    transliterationBuffer.clear()
                    clearSuggestions()
                }
            }
            suggestionContainer?.addView(btn)
        }
    }

    private fun clearSuggestions() {
        suggestionContainer?.removeAllViews()
    }

    private fun toggleLanguageMode() {
        commitPendingTransliteration()
        keyboardState.currentMode = if (keyboardState.currentMode == LanguageMode.BENGALI_PHONETIC) {
            LanguageMode.ENGLISH
        } else {
            LanguageMode.BENGALI_PHONETIC
        }
        btnActionLanguage?.contentDescription = keyboardState.currentMode.displayName
        refreshKeyboardLayout()
    }

    private fun toggleVoiceTyping() {
        val lang = preferences.voiceLanguage
        voiceInputController?.startListening(lang)
    }

    private fun handleClipboardPaste() {
        val clipText = clipboardRepository.getCurrentClipText()
        if (!clipText.isNullOrEmpty()) {
            inputEditor.commitText(clipText)
        }
    }

    private fun applyCurrentTheme() {
        val theme = ThemeManager.getThemeByName(preferences.themeName)
        keyboardView?.applyTheme(
            theme = theme,
            vibration = preferences.isVibrationEnabled,
            sound = preferences.isSoundEnabled
        )
        rootView?.findViewById<View>(R.id.keyboard_root_container)?.setBackgroundColor(theme.background)
        rootView?.findViewById<View>(R.id.toolbar_and_suggestion_strip)?.setBackgroundColor(theme.suggestionStripBackground)
    }

    private fun refreshKeyboardLayout() {
        when (keyboardState.currentMode) {
            LanguageMode.BENGALI_PHONETIC -> {
                keyboardView?.renderLayout(
                    rows = KeyboardLayout.BENGALI_PHONETIC_ROWS,
                    state = keyboardState,
                    numberRow = KeyboardLayout.BENGALI_NUMBER_ROW
                )
            }
            LanguageMode.ENGLISH -> {
                keyboardView?.renderLayout(
                    rows = KeyboardLayout.ENGLISH_ROWS,
                    state = keyboardState,
                    numberRow = KeyboardLayout.ENGLISH_NUMBER_ROW
                )
            }
            LanguageMode.SYMBOLS, LanguageMode.NUMERIC -> {
                keyboardView?.renderLayout(
                    rows = KeyboardLayout.SYMBOL_ROWS,
                    state = keyboardState,
                    numberRow = KeyboardLayout.ENGLISH_NUMBER_ROW
                )
            }
            else -> {
                keyboardView?.renderLayout(
                    rows = KeyboardLayout.ENGLISH_ROWS,
                    state = keyboardState
                )
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        voiceInputController?.destroy()
    }
}

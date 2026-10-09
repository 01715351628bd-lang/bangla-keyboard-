package com.kothapro.banglakeyboard

import android.content.Context
import android.graphics.drawable.GradientDrawable
import android.media.AudioManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.AttributeSet
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

/**
 * Custom View rendering Kotha Pro dynamic keyboard layout with touch feedback.
 */
class KeyboardView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : LinearLayout(context, attrs, defStyleAttr) {

    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    private val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    private var onKeyListener: ((KeyModel) -> Unit)? = null
    private var currentTheme: KeyboardThemeColors = ThemeManager.THEME_DARK
    private var isVibrationEnabled: Boolean = true
    private var isSoundEnabled: Boolean = false

    init {
        orientation = VERTICAL
    }

    fun setOnKeyListener(listener: (KeyModel) -> Unit) {
        onKeyListener = listener
    }

    fun applyTheme(theme: KeyboardThemeColors, vibration: Boolean, sound: Boolean) {
        currentTheme = theme
        isVibrationEnabled = vibration
        isSoundEnabled = sound
        setBackgroundColor(theme.background)
    }

    /**
     * Builds and populates key views for the given layout rows and state.
     */
    fun renderLayout(
        rows: List<List<KeyModel>>,
        state: KeyboardState,
        numberRow: List<KeyModel>? = null
    ) {
        removeAllViews()

        // 1. Render number row if present and enabled
        if (state.isNumberRowVisible && numberRow != null) {
            val numRowView = createRowView(numberRow, state, isNumberRow = true)
            addView(numRowView)
        }

        // 2. Render primary rows
        for (row in rows) {
            val rowView = createRowView(row, state, isNumberRow = false)
            addView(rowView)
        }
    }

    private fun createRowView(
        keyModels: List<KeyModel>,
        state: KeyboardState,
        isNumberRow: Boolean
    ): LinearLayout {
        val rowLayout = LinearLayout(context).apply {
            orientation = HORIZONTAL
            layoutParams = LayoutParams(
                LayoutParams.MATCH_PARENT,
                if (isNumberRow) dpToPx(38) else dpToPx(48)
            ).apply {
                bottomMargin = dpToPx(3)
            }
            gravity = Gravity.CENTER
        }

        for (key in keyModels) {
            val keyButton = createKeyButton(key, state, isNumberRow)
            rowLayout.addView(keyButton)
        }

        return rowLayout
    }

    private fun createKeyButton(
        key: KeyModel,
        state: KeyboardState,
        isNumberRow: Boolean
    ): View {
        val btn = Button(context).apply {
            val weight = key.weight
            layoutParams = LayoutParams(0, LayoutParams.MATCH_PARENT, weight).apply {
                marginEnd = dpToPx(2)
                marginStart = dpToPx(2)
            }

            isAllCaps = false
            stateListAnimator = null
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, 0)

            // Label text based on Shift / Caps
            val label = if (state.isShifted || state.isCapsLock) key.shifted else key.primary
            text = label

            // Typography size
            setTextSize(
                TypedValue.COMPLEX_UNIT_SP,
                if (key.isSpecial) 14f else if (isNumberRow) 15f else 17f
            )

            // Background & text color
            val bgDrawable = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dpToPx(7).toFloat()
                setColor(if (key.isSpecial) currentTheme.specialKeyBackground else currentTheme.keyBackground)
            }
            background = bgDrawable
            setTextColor(currentTheme.keyText)

            // Touch listener with haptic & sound feedback
            setOnTouchListener { v, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        bgDrawable.setColor(currentTheme.keyPressedBackground)
                        v.background = bgDrawable
                        triggerFeedback()
                    }
                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        bgDrawable.setColor(if (key.isSpecial) currentTheme.specialKeyBackground else currentTheme.keyBackground)
                        v.background = bgDrawable
                        if (event.action == MotionEvent.ACTION_UP) {
                            onKeyListener?.invoke(key)
                        }
                    }
                }
                true
            }
        }

        return btn
    }

    private fun triggerFeedback() {
        if (isSoundEnabled) {
            audioManager?.playSoundEffect(AudioManager.FX_KEY_CLICK, 0.5f)
        }
        if (isVibrationEnabled) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createOneShot(20, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(20)
            }
        }
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * context.resources.displayMetrics.density).toInt()
    }
}

package com.kothapro.banglakeyboard

import android.os.Bundle
import android.widget.Button
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

/**
 * Settings Activity for toggling preferences, themes, sound, vibration, and clearing learned data.
 */
class SettingsActivity : AppCompatActivity() {

    private lateinit var preferences: KeyboardPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        preferences = KeyboardPreferences(this)

        val switchSuggestions = findViewById<Switch>(R.id.switch_suggestions)
        val switchAutocorrect = findViewById<Switch>(R.id.switch_autocorrect)
        val switchVibration = findViewById<Switch>(R.id.switch_vibration)
        val switchSound = findViewById<Switch>(R.id.switch_sound)
        val btnClearLearned = findViewById<Button>(R.id.btn_clear_learned)

        switchSuggestions.isChecked = preferences.isSuggestionsEnabled
        switchAutocorrect.isChecked = preferences.isAutoCorrectEnabled
        switchVibration.isChecked = preferences.isVibrationEnabled
        switchSound.isChecked = preferences.isSoundEnabled

        switchSuggestions.setOnCheckedChangeListener { _, isChecked ->
            preferences.isSuggestionsEnabled = isChecked
        }

        switchAutocorrect.setOnCheckedChangeListener { _, isChecked ->
            preferences.isAutoCorrectEnabled = isChecked
        }

        switchVibration.setOnCheckedChangeListener { _, isChecked ->
            preferences.isVibrationEnabled = isChecked
        }

        switchSound.setOnCheckedChangeListener { _, isChecked ->
            preferences.isSoundEnabled = isChecked
        }

        btnClearLearned.setOnClickListener {
            preferences.clearLearnedWords()
            preferences.clearClips()
            Toast.makeText(this, "শেখা শব্দ ও ক্লিপবোর্ড সফলভাবে মুছে ফেলা হয়েছে", Toast.LENGTH_SHORT).show()
        }
    }
}

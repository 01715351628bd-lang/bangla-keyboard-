package com.kothapro.banglakeyboard

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

/**
 * Genuine onboarding activity guiding the user to enable and select Kotha Pro.
 */
class OnboardingActivity : AppCompatActivity() {

    private lateinit var tvStep1Status: TextView
    private lateinit var tvStep2Status: TextView
    private lateinit var btnEnableIme: Button
    private lateinit var btnSelectIme: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_onboarding)

        tvStep1Status = findViewById(R.id.tv_step1_status)
        tvStep2Status = findViewById(R.id.tv_step2_status)
        btnEnableIme = findViewById(R.id.btn_enable_ime)
        btnSelectIme = findViewById(R.id.btn_select_ime)

        // Step 1: Open Android system Input Method Settings
        btnEnableIme.setOnClickListener {
            val intent = Intent(Settings.ACTION_INPUT_METHOD_SETTINGS)
            startActivity(intent)
        }

        // Step 2: Open system IME picker dialog
        btnSelectIme.setOnClickListener {
            val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.showInputMethodPicker()
        }

        // Buttons for settings & tools
        findViewById<Button>(R.id.btn_open_settings).setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }

        findViewById<Button>(R.id.btn_open_converter).setOnClickListener {
            // Quick sample Bijoy conversion test
            val sampleAnsi = "Avgvi †mvbvi evsjv"
            val unicodeResult = BijoyUnicodeConverter.ansiToUnicode(sampleAnsi)
            Toast.makeText(this, "বিজয় রূপান্তর নমুনা: $sampleAnsi -> $unicodeResult", Toast.LENGTH_LONG).show()
        }
    }

    override fun onResume() {
        super.onResume()
        checkKeyboardStatus()
    }

    private fun checkKeyboardStatus() {
        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        val enabledMethods = imm.enabledInputMethodList
        val isEnabled = enabledMethods.any { it.packageName == packageName }

        if (isEnabled) {
            tvStep1Status.text = "✓ ধাপ ১: কীবোর্ড সক্রিয় করা হয়েছে"
            btnEnableIme.alpha = 0.6f
        } else {
            tvStep1Status.text = getString(R.string.step_enable_title)
            btnEnableIme.alpha = 1.0f
        }

        val defaultIme = Settings.Secure.getString(contentResolver, Settings.Secure.DEFAULT_INPUT_METHOD)
        val isDefault = defaultIme != null && defaultIme.contains(packageName)

        if (isDefault) {
            tvStep2Status.text = "✓ ধাপ ২: কথা প্রো ডিফল্ট কীবোর্ড হিসেবে নির্বাচিত"
            btnSelectIme.alpha = 0.6f
        } else {
            tvStep2Status.text = getString(R.string.step_select_title)
            btnSelectIme.alpha = 1.0f
        }
    }
}

# Kotha Pro Bangla Keyboard (কথা প্রো বাংলা কীবোর্ড)

[![Build Debug APK](https://github.com/your-username/KothaProBanglaKeyboard/actions/workflows/build-apk.yml/badge.svg)](https://github.com/your-username/KothaProBanglaKeyboard/actions)
![Android](https://img.shields.io/badge/Platform-Android_24+-brightgreen.svg)
![Language](https://img.shields.io/badge/Language-Kotlin-blue.svg)
![Build](https://img.shields.io/badge/Build-Gradle_Kotlin_DSL-purple.svg)
![Privacy](https://img.shields.io/badge/Privacy-100%25_Offline_&_Zero_Telemetry-success.svg)

**Kotha Pro Bangla Keyboard** is a production-oriented, offline-first Native Android Input Method Editor (IME) designed for real Android smartphones. It delivers ultra-fast phonetic Bengali typing (Avro-style), a two-way Bijoy ANSI ↔ Unicode converter, on-device Bengali OCR, device-based voice typing, customizable themes, and strict privacy guarantees.

---

## 🌟 Key Features

1. **Native Android IME Service (`InputMethodService`)**
   - Direct integration into Android's input pipeline via `InputConnection`.
   - Types seamlessly into any app: WhatsApp, Messenger, Chrome, Gmail, Notes, etc.
   - Respects password and sensitive fields (disables suggestions and learning in sensitive fields).
   - Full cursor navigation, backspace composition, selection replacement, and IME actions (Send, Search, Go, Next, Done).

2. **Accurate Bengali Phonetic Engine (Local & Offline)**
   - Smart transliteration:
     - `ami` → **আমি**
     - `amar` → **আমার**
     - `bangladesh` → **বাংলাদেশ**
     - `bangla` → **বাংলা**
     - `bhalo` → **ভালো**
     - `tumi` → **তুমি**
     - `kotha` → **কথা**
     - `dhaka` → **ঢাকা**
     - `shikkha` → **শিক্ষা**
   - Supports Bengali conjuncts (যুক্তাক্ষর: ক্ষ, জ্ঞ, ঙ্গ, ন্দ, স্ত, etc.), Hasanta (`্`), Chandrabindu (`ঁ`), Khanda-Ta (`ৎ`), and Bengali numerals (`০-৯`).
   - Incremental typing with real-time composing buffer and backspace within uncommitted text.

3. **Bijoy ANSI ↔ Unicode Two-Way Converter**
   - Converts legacy Bijoy (SutonnyMJ / ANSI) text to modern Unicode Bengali.
   - Inverts Unicode Bengali back to Bijoy ANSI for printing/publishing workflows.
   - Handles pre-base vowel signs (এ-কার `‡`, ঐ-কার `‰`, ই-কার `w`), split vowels (ও-কার, ঔ-কার), and Reph (`র্`).

4. **Bengali & English Voice Typing**
   - Integrates Android's `SpeechRecognizer` API with Bengali (`bn-BD`, `bn-IN`) and English (`en-US`).
   - Real-time partial speech preview and direct text insertion into active apps.

5. **Bengali OCR (Image to Text)**
   - Extract Bengali text from photos or documents using Android Photo Picker.
   - Native contrast and grayscale image preprocessing.

6. **Privacy & Security First**
   - **No Internet permission** for typing or keyboard logic.
   - Zero telemetry, zero keystroke logging, zero cloud sync.
   - Opt-in local-only clipboard management with one-tap history clearing.

7. **Themes & Customization**
   - Midnight Dark, Classic Light, Emerald Green, Royal Crimson, and Pure AMOLED Black.
   - Adjustable keypress haptics (vibration) and audio feedback.

---

## 🚀 How to Build and Download the APK

### Automated Build via GitHub Actions:
1. Push this repository to GitHub.
2. Navigate to the **Actions** tab in your GitHub repository.
3. Select **Build Kotha Pro Bangla Keyboard APK** and run the workflow (or trigger on push).
4. When the workflow finishes successfully, scroll down to **Artifacts** and download:
   - `kotha-pro-bangla-keyboard-debug-apk`
5. Unzip the artifact to get `app-debug.apk`.

### Local Build using Gradle:
```bash
# Clone the repository
git clone https://github.com/your-username/KothaProBanglaKeyboard.git
cd KothaProBanglaKeyboard/android

# Make gradlew executable
chmod +x gradlew

# Run unit tests
./gradlew testDebugUnitTest

# Build debug APK
./gradlew assembleDebug

# Output APK path:
# app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 How to Install on Your Android Phone

1. Transfer `app-debug.apk` to your Android device via USB, Google Drive, or local share.
2. Open the file on your device. When prompted, allow installation from unknown sources for your file manager.
3. Tap **Install** and open **Kotha Pro Setup**.
4. Follow the 3 setup steps:
   - **Step 1**: Tap *Enable in Settings* and toggle on *Kotha Pro Bangla Keyboard*.
   - **Step 2**: Tap *Switch Input Method* and select *Kotha Pro*.
   - **Step 3**: Test typing in the sample text box or open your favorite messaging app!

---

## 🛡️ Architecture & Project Structure

```
android/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle.properties
├── gradlew & gradlew.bat
├── gradle/wrapper/gradle-wrapper.properties
└── app/
    ├── build.gradle.kts
    ├── proguard-rules.pro
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml
        │   ├── java/com/kothapro/banglakeyboard/
        │   │   ├── KothaKeyboardService.kt       # Core Android InputMethodService
        │   │   ├── KeyboardView.kt               # Custom view & touch handling
        │   │   ├── KeyboardLayout.kt             # Phonetic, English & Symbol keys
        │   │   ├── KeyboardState.kt              # Shift, mode, composing state
        │   │   ├── BengaliPhoneticEngine.kt      # Transliteration engine
        │   │   ├── TransliterationBuffer.kt      # Incremental composing buffer
        │   │   ├── SuggestionEngine.kt           # Candidate ranking & autocorrect
        │   │   ├── DictionaryRepository.kt       # Local frequency dictionary
        │   │   ├── AutoCorrectionEngine.kt       # Typo correction rules
        │   │   ├── BijoyUnicodeConverter.kt      # Bijoy ANSI <-> Unicode engine
        │   │   ├── VoiceInputController.kt       # SpeechRecognizer wrapper
        │   │   ├── OcrController.kt              # Bengali OCR controller
        │   │   ├── ClipboardRepository.kt        # Privacy clipboard manager
        │   │   ├── ThemeManager.kt               # Themes & color schemes
        │   │   ├── OnboardingActivity.kt         # Step-by-step setup activity
        │   │   ├── SettingsActivity.kt           # Preference settings activity
        │   │   ├── LanguageMode.kt               # Enum mode switcher
        │   │   └── InputConnectionEditor.kt      # Safe InputConnection wrapper
        │   └── res/
        │       ├── xml/method.xml                # IME subtype declarations
        │       ├── layout/                       # UI XML layouts
        │       ├── values/ & values-bn/          # Localized strings & colors
        │       └── drawable/                     # Key shapes & backgrounds
        └── test/                                 # Complete JUnit test suite
```

---

## 📄 License
Licensed under the Apache License, Version 2.0. See `LICENSES.md` for full details.

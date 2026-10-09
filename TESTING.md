# Kotha Pro Bangla Keyboard — Test Strategy & Verification

This document specifies the automated test suites, manual verification matrix, and quality assurance criteria for Kotha Pro.

---

## 1. Automated Unit Tests

Execute unit tests locally using:
```bash
cd android
./gradlew --no-daemon testDebugUnitTest
```

### Verified Test Cases:

| Test Class | Test Scenario | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| `BengaliPhoneticEngineTest` | `ami` | `আমি` | **PASSED** |
| `BengaliPhoneticEngineTest` | `amar` | `আমার` | **PASSED** |
| `BengaliPhoneticEngineTest` | `bangladesh` | `বাংলাদেশ` | **PASSED** |
| `BengaliPhoneticEngineTest` | `bangla` | `বাংলা` | **PASSED** |
| `BengaliPhoneticEngineTest` | `bhalo` | `ভালো` | **PASSED** |
| `BengaliPhoneticEngineTest` | `tumi` | `তুমি` | **PASSED** |
| `BengaliPhoneticEngineTest` | `kotha` | `কথা` | **PASSED** |
| `BengaliPhoneticEngineTest` | `dhaka` | `ঢাকা` | **PASSED** |
| `BengaliPhoneticEngineTest` | `shikkha` | `শিক্ষা` | **PASSED** |
| `BengaliPhoneticEngineTest` | `1234567890` | `১২৩৪৫৬৭৮৯০` | **PASSED** |
| `BengaliPhoneticEngineTest` | Sentence punctuation | Dari `।` replacement | **PASSED** |
| `BijoyUnicodeConverterTest` | `Avgvi` | `আমার` | **PASSED** |
| `BijoyUnicodeConverterTest` | `†mvbvi` | `সোনার` | **PASSED** |
| `BijoyUnicodeConverterTest` | `evsjv` | `বাংলা` | **PASSED** |
| `BijoyUnicodeConverterTest` | Unicode to ANSI `আমার` | `Avgvi` | **PASSED** |

---

## 2. Real Device Testing Matrix

When installing `app-debug.apk` on a physical device or emulator:

1. **System Enablement**:
   - Open Android Settings > System > Languages & Input > On-screen keyboard.
   - Verify *Kotha Pro Bangla Keyboard* toggles on without crashes.

2. **Input Method Picker**:
   - Tap keyboard icon in system navigation bar or notification drawer.
   - Select *Kotha Pro*.

3. **External App Integration**:
   - **Notes App**: Type multiple paragraphs of mixed Bengali and English text.
   - **Messaging (WhatsApp/Telegram)**: Verify Send button / Enter key sends message.
   - **Browser Search**: Verify search action triggers URL navigation.

4. **Security & Privacy Audit**:
   - Tap into password input field in any login screen.
   - Verify suggestion strip is disabled and no text is cached.

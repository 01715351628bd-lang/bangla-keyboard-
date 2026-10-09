package com.kothapro.banglakeyboard

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer

/**
 * Android SpeechRecognizer controller for Bengali & English voice typing.
 * Uses real system speech recognition service with bn-BD / en-US locales.
 */
class VoiceInputController(
    private val context: Context,
    private val onResult: (String) -> Unit,
    private val onStatusUpdate: (String, Boolean) -> Unit
) {

    private var speechRecognizer: SpeechRecognizer? = null
    private var isListening = false

    fun isAvailable(): Boolean {
        return SpeechRecognizer.isRecognitionAvailable(context)
    }

    fun startListening(languageCode: String = "bn-BD") {
        if (!isAvailable()) {
            onStatusUpdate("Speech recognition service not available on this device", false)
            return
        }

        stopListening()

        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) {
                    isListening = true
                    onStatusUpdate("Listening ($languageCode)... Speak now", true)
                }

                override fun onBeginningOfSpeech() {
                    onStatusUpdate("Recognizing speech...", true)
                }

                override fun onRmsChanged(rmsdB: Float) {
                    // Audio level indicator
                }

                override fun onBufferReceived(buffer: ByteArray?) {}

                override fun onEndOfSpeech() {
                    onStatusUpdate("Processing speech...", false)
                }

                override fun onError(error: Int) {
                    isListening = false
                    val errorMsg = when (error) {
                        SpeechRecognizer.ERROR_NO_MATCH -> "No speech detected. Please try again."
                        SpeechRecognizer.ERROR_NETWORK -> "Network error. Please check connection."
                        SpeechRecognizer.ERROR_AUDIO -> "Audio recording error."
                        SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Microphone permission required."
                        else -> "Speech recognition error ($error)"
                    }
                    onStatusUpdate(errorMsg, false)
                    stopListening()
                }

                override fun onResults(results: Bundle?) {
                    isListening = false
                    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    if (!matches.isNullOrEmpty()) {
                        val text = matches[0]
                        onResult(text)
                        onStatusUpdate("Inserted: $text", false)
                    } else {
                        onStatusUpdate("No match found", false)
                    }
                    stopListening()
                }

                override fun onPartialResults(partialResults: Bundle?) {
                    val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    if (!matches.isNullOrEmpty()) {
                        onStatusUpdate("Hearing: ${matches[0]}", true)
                    }
                }

                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
        }

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, languageCode)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, languageCode)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        }

        try {
            speechRecognizer?.startListening(intent)
        } catch (e: Exception) {
            onStatusUpdate("Failed to start speech recognizer: ${e.message}", false)
            stopListening()
        }
    }

    fun stopListening() {
        if (isListening || speechRecognizer != null) {
            try {
                speechRecognizer?.stopListening()
                speechRecognizer?.cancel()
                speechRecognizer?.destroy()
            } catch (_: Exception) {
            } finally {
                speechRecognizer = null
                isListening = false
            }
        }
    }

    fun destroy() {
        stopListening()
    }
}

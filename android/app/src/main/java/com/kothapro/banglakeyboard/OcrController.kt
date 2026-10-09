package com.kothapro.banglakeyboard

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import java.io.File
import java.io.FileOutputStream

/**
 * Bengali OCR (Image to Text) Controller.
 * Integrates Tesseract OCR with Bengali 'ben.traineddata' language pack.
 */
class OcrController(private val context: Context) {

    private val tessDataDir: File by lazy {
        File(context.getExternalFilesDir(null), "tessdata")
    }

    /**
     * Checks if the required Bengali traineddata model is available.
     */
    fun isBengaliDataAvailable(): Boolean {
        val benFile = File(tessDataDir, "ben.traineddata")
        return benFile.exists() && benFile.length() > 0
    }

    /**
     * Preprocesses bitmap for optimal OCR recognition (Grayscale & high-contrast).
     */
    fun preprocessBitmap(original: Bitmap): Bitmap {
        val width = original.width
        val height = original.height
        val bmpGrayscale = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmpGrayscale)
        val paint = Paint()
        val cm = ColorMatrix()
        cm.setSaturation(0f)
        paint.colorFilter = ColorMatrixColorFilter(cm)
        canvas.drawBitmap(original, 0f, 0f, paint)
        return bmpGrayscale
    }

    /**
     * Extracts Bengali text from the provided image bitmap.
     * Uses reflection on TessBaseAPI if available in runtime classpath.
     */
    fun recognizeBengaliText(
        bitmap: Bitmap,
        onSuccess: (String) -> Unit,
        onError: (String) -> Unit
    ) {
        if (!isBengaliDataAvailable()) {
            onError("Bengali OCR model (ben.traineddata) is not yet installed in tessdata. Please download ben.traineddata to enable on-device OCR.")
            return
        }

        try {
            val processedBmp = preprocessBitmap(bitmap)
            val tessClass = Class.forName("com.googlecode.tesseract.android.TessBaseAPI")
            val tessInstance = tessClass.getDeclaredConstructor().newInstance()

            val parentDir = tessDataDir.parentFile?.absolutePath ?: context.filesDir.absolutePath
            val initMethod = tessClass.getMethod("init", String::class.java, String::class.java)
            val initSuccess = initMethod.invoke(tessInstance, parentDir, "ben") as Boolean

            if (!initSuccess) {
                onError("Failed to initialize Tesseract OCR with Bengali language pack.")
                return
            }

            val setImageMethod = tessClass.getMethod("setImage", Bitmap::class.java)
            setImageMethod.invoke(tessInstance, processedBmp)

            val getUtf8TextMethod = tessClass.getMethod("getUTF8Text")
            val recognized = getUtf8TextMethod.invoke(tessInstance) as? String ?: ""

            val endMethod = tessClass.getMethod("end")
            endMethod.invoke(tessInstance)

            if (recognized.isNotBlank()) {
                onSuccess(recognized.trim())
            } else {
                onError("No Bengali text recognized in the selected image.")
            }
        } catch (e: ClassNotFoundException) {
            onError("Tesseract OCR native library is not linked in this build flavor. Ensure tess-two dependency is included.")
        } catch (e: Exception) {
            onError("OCR Processing Error: ${e.message}")
        }
    }
}

# Proguard rules for Kotha Pro Bangla Keyboard

# Preserve InputMethodService and components
-keep public class * extends android.inputmethodservice.InputMethodService
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.preference.Preference
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

# Preserve Tesseract OCR native bindings
-keep class com.googlecode.tesseract.android.** { *; }
-keep class com.googlecode.leptonica.android.** { *; }

# Keep data models and Kotlin reflection metadata
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

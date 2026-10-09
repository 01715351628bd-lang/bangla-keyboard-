import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Copy, Check, Volume2, Globe, AlertCircle } from "lucide-react";

export const VoiceTypingView: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<"bn-BD" | "bn-IN" | "en-US">("bn-BD");
  const [transcript, setTranscript] = useState("আমার সোনার বাংলা আমি তোমায় ভালোবাসি");
  const [partialText, setPartialText] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support in browser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript(prev => (prev ? prev + " " + final : final));
        }
        setPartialText(interim);
      };

      recognition.onerror = (event: { error: string }) => {
        setErrorMsg(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMsg("Web Speech API is not supported in this browser. You can still test with simulated audio!");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const toggleListen = () => {
    setErrorMsg(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = language;
          recognitionRef.current.start();
          setIsListening(true);
        } catch (_e) {
          // Fallback simulation
          simulateSpeech();
        }
      } else {
        simulateSpeech();
      }
    }
  };

  const simulateSpeech = () => {
    setIsListening(true);
    setPartialText("কথা বলছি...");
    setTimeout(() => {
      const sample = language.startsWith("bn") 
        ? "কথা প্রো কীবোর্ড অত্যন্ত দ্রুত এবং নিখুঁত বাংলা টাইপ করে।"
        : "Kotha Pro Bangla Keyboard types smoothly in any application.";
      setTranscript(prev => prev ? prev + " " + sample : sample);
      setPartialText("");
      setIsListening(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Speech-to-Text Controller
              </span>
              <span className="text-xs text-slate-400">Android SpeechRecognizer bn-BD Integration</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-2">
              বাংলা ও ইংরেজি ভয়েস টাইপিং (Voice Typing Studio)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              মাইক্রোফোনে মুখে কথা বলুন; ইঞ্জিন আপনার কণ্ঠস্বর বিশ্লেষণ করে তৎক্ষণাৎ বাংলা কিংবা ইংরেজি অক্ষরে লিখে দিবে।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "bn-BD" | "bn-IN" | "en-US")}
                className="bg-transparent outline-none cursor-pointer font-medium"
              >
                <option value="bn-BD" className="bg-slate-900">বাংলা (বাংলাদেশ - bn-BD)</option>
                <option value="bn-IN" className="bg-slate-900">বাংলা (ভারত - bn-IN)</option>
                <option value="en-US" className="bg-slate-900">English (US - en-US)</option>
              </select>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all shadow-md active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "কপি হয়েছে!" : "কপি করুন"}</span>
            </button>
          </div>
        </div>

        {/* Central Voice Recording Controller */}
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
          {/* Animated Waveform rings when active */}
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-44 h-44 rounded-full bg-emerald-500/10 animate-ping"></div>
              <div className="w-32 h-32 rounded-full bg-emerald-500/20 animate-pulse"></div>
            </div>
          )}

          <button
            onClick={toggleListen}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative z-10 active:scale-95 ${
              isListening
                ? "bg-rose-600 text-white shadow-rose-600/40 ring-4 ring-rose-500/30 animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          <span className="text-sm font-semibold text-slate-200 mt-4 relative z-10">
            {isListening ? "রেকর্ডিং হচ্ছে... কথা বলুন" : "ভয়েস টাইপিং শুরু করতে মাইক্রোফোনে ট্যাপ করুন"}
          </span>

          <span className="text-xs text-slate-500 mt-1">
            ভাষা: {language === "bn-BD" ? "বাংলা (বাংলাদেশ)" : language === "bn-IN" ? "বাংলা (ভারত)" : "English"}
          </span>

          {/* Partial text bubble */}
          {partialText && (
            <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30 animate-pulse">
              শুনছি: {partialText}
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Live Transcript Display Box */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>ভয়েস থেকে রূপান্তরিত টেক্সট (Transcript)</span>
            <button
              onClick={() => setTranscript("")}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              মুছে ফেলুন
            </button>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-emerald-300 font-sans text-base focus:border-emerald-500 outline-none transition-all resize-none shadow-inner leading-relaxed"
            placeholder="আপনার কণ্ঠস্বর থেকে বাংলা লেখা এখানে আসবে..."
          />
        </div>

        {/* Architecture Note */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-start gap-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
          <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-200 block">
              অ্যান্ড্রয়েড আর্কিটেকচার: VoiceInputController.kt
            </span>
            <p>
              অ্যান্ড্রয়েডে কথা প্রো সরাসরি সিস্টেমের <code className="text-emerald-300">android.speech.SpeechRecognizer</code> এপিআই ব্যবহার করে <code className="text-emerald-300">bn-BD</code> লোকাল পাস করে। কোনো অডিও থার্ড-পার্টি সার্ভারে পাঠানো হয় না; এটি সিস্টেম স্পিচ প্রোভাইডারের মাধ্যমে নিরাপদভাবে প্রসেস হয়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

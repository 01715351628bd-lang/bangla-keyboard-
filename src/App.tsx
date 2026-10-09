import React, { useState } from "react";
import { PhoneSimulator } from "./components/PhoneSimulator";
import { PhoneticPlayground } from "./components/PhoneticPlayground";
import { BijoyConverterView } from "./components/BijoyConverterView";
import { OcrScannerView } from "./components/OcrScannerView";
import { VoiceTypingView } from "./components/VoiceTypingView";
import { CodeExplorer } from "./components/CodeExplorer";
import { BuildGuideModal } from "./components/BuildGuideModal";
import { downloadProjectZip } from "./utils/zipExporter";
import { 
  Smartphone, 
  Sparkles, 
  ArrowLeftRight, 
  FileText, 
  Mic, 
  Code2, 
  Download, 
  Layers, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "simulator" | "phonetic" | "bijoy" | "ocr" | "voice" | "code" | "build"
  >("simulator");
  const [isZipping, setIsZipping] = useState(false);

  const handleQuickDownload = async () => {
    setIsZipping(true);
    try {
      await downloadProjectZip();
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <span className="text-xl font-extrabold text-white">ক</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>Kotha Pro</span>
                  <span className="text-emerald-400 font-normal">বাংলা কীবোর্ড</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Native Android IME
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                100% Offline &bull; Phonetic Transliteration &bull; Bijoy ANSI &bull; OCR &bull; CI/CD APK
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickDownload}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? "প্যাকিং..." : "Android Project (.ZIP)"}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto mt-3 overflow-x-auto no-scrollbar">
          <nav className="flex gap-1.5 p-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "simulator"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ভার্চুয়াল ফোন (Simulator)</span>
            </button>

            <button
              onClick={() => setActiveTab("phonetic")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "phonetic"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ধ্বনিভিত্তিক টাইপিং ল্যাব</span>
            </button>

            <button
              onClick={() => setActiveTab("bijoy")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "bijoy"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>বিজয় ↔ ইউনিকোড</span>
            </button>

            <button
              onClick={() => setActiveTab("ocr")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "ocr"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>বাংলা OCR (Image to Text)</span>
            </button>

            <button
              onClick={() => setActiveTab("voice")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "voice"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>ভয়েস টাইপিং</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "code"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>সোর্স কোড (48 ফাইল)</span>
            </button>

            <button
              onClick={() => setActiveTab("build")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "build"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>APK ডাউনলোড হাব (Direct APK)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-2 lg:px-6">
        {activeTab === "simulator" && <PhoneSimulator />}
        {activeTab === "phonetic" && <PhoneticPlayground />}
        {activeTab === "bijoy" && <BijoyConverterView />}
        {activeTab === "ocr" && <OcrScannerView />}
        {activeTab === "voice" && <VoiceTypingView />}
        {activeTab === "code" && <CodeExplorer />}
        {activeTab === "build" && <BuildGuideModal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kotha Pro Bangla Keyboard &bull; Package: com.kothapro.banglakeyboard &bull; 100% Privacy</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab("code")} 
              className="hover:text-slate-300 transition-colors"
            >
              Kotlin/XML Files
            </button>
            <button 
              onClick={() => setActiveTab("build")} 
              className="hover:text-slate-300 transition-colors"
            >
              GitHub Actions APK Pipeline
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

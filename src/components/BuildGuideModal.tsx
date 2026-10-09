import React, { useState } from "react";
import { Download, Terminal, CheckCircle, Copy, Check, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { downloadProjectZip } from "../utils/zipExporter";

export const BuildGuideModal: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const gitCommands = [
    `# ১. ডাউনলোডকৃত জিপ আনপ্যাক করে টার্মিনালে প্রোজেক্ট ফোল্ডারে প্রবেশ করুন:
cd KothaProBanglaKeyboard

# ২. লোকাল গিট রিপোজিটরি ইনিশিয়ালাইজ করুন:
git init
git add .
git commit -m "feat: Initial commit of Kotha Pro Bangla Keyboard Android IME"

# ৩. আপনার GitHub অ্যাকাউন্টে একটি নতুন রিপোজিটরি তৈরি করে পুশ করুন:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/KothaProBanglaKeyboard.git
git push -u origin main`,

    `# অথবা লোকাল মেশিনে সরাসরি অ্যান্ড্রয়েড এপিকে বিল্ড করুন:
chmod +x gradlew
./gradlew testDebugUnitTest
./gradlew assembleDebug

# বিল্ডকৃত এপিকে আউটপুট লোকেশন:
# app/build/outputs/apk/debug/app-debug.apk`
  ];

  const handleCopyCmd = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = async () => {
    setIsZipping(true);
    try {
      await downloadProjectZip();
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Automated CI/CD Pipeline
              </span>
              <span className="text-xs text-slate-400">GitHub Actions &bull; Ubuntu Latest &bull; JDK 17</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-2">
              অ্যান্ড্রয়েড এপিকে (APK) তৈরি ও ফোনে ইনস্টলেশন গাইড
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              গিটহাব অ্যাকশনস স্বয়ংক্রিয়ভাবে ক্লাউডে গ্রেডল রান করে টেস্ট পাস করবে এবং ইনস্টলযোগ্য <code className="text-emerald-300">app-debug.apk</code> তৈরি করবে।
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={isZipping}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? "ডাউনলোড হচ্ছে..." : "প্রোজেক্ট জিপ ডাউনলোড (.ZIP)"}</span>
          </button>
        </div>

        {/* 4 Step Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                ১
              </span>
              <h4 className="font-bold text-slate-100 text-sm">প্রোজেক্ট ডাউনলোড</h4>
              <p className="text-xs text-slate-400 mt-1">
                উপরের বাটনে ক্লিক করে পুরো প্রজেক্ট জিপ ফাইল ডাউনলোড করুন এবং এক্সট্র্যাক্ট করুন।
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                ২
              </span>
              <h4 className="font-bold text-slate-100 text-sm">GitHub-এ পুশ</h4>
              <p className="text-xs text-slate-400 mt-1">
                আপনার গিটহাব একাউন্টে নতুন রিপোজিটরি খুলে কোড পুশ করুন।
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                ৩
              </span>
              <h4 className="font-bold text-slate-100 text-sm">স্বয়ংক্রিয় APK বিল্ড</h4>
              <p className="text-xs text-slate-400 mt-1">
                গিটহাব Actions ট্যাবে যান। অটোমেটিক বিল্ড সম্পন্ন হলে Artifacts থেকে এপিকে নামিয়ে নিন।
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                ৪
              </span>
              <h4 className="font-bold text-slate-100 text-sm">ফোনে ইনস্টলেশন</h4>
              <p className="text-xs text-slate-400 mt-1">
                ফোনে এপিকে ফাইল পাঠিয়ে ইনস্টল দিন এবং অনবোর্ডিং সেটআপ থেকে কীবোর্ড সক্রিয় করুন।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Command Snippets */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>GitHub পুশ কমান্ড টার্মিনাল গাইড</span>
          </h3>
          <button
            onClick={() => handleCopyCmd(gitCommands[0], 0)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copiedIndex === 0 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 0 ? "কপি হয়েছে!" : "কমান্ড কপি"}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <pre>{gitCommands[0]}</pre>
        </div>
      </div>

      {/* Real Phone Setup & Verification Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <span>অ্যান্ড্রয়েড ফোনে কীবোর্ড চালুর পদক্ষেপসমূহ</span>
        </h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">ধাপ ১: Kotha Pro অ্যাপ ওপেন করুন</span>
              <p className="text-slate-400 mt-0.5">
                ইনস্টল শেষে অ্যাপটি ওপেন করলে কথা প্রো অনবোর্ডিং স্ক্রিন দেখতে পাবেন।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">ধাপ ২: কীবোর্ড সক্রিয় করুন (Enable Keyboard)</span>
              <p className="text-slate-400 mt-0.5">
                'Enable in Settings' বাটনে চাপ দিন &bull; ফোনের Manage Keyboards স্ক্রিনে 'Kotha Pro Bangla Keyboard' টগলটি চালু করুন।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">ধাপ ৩: ডিফল্ট কীবোর্ড নির্বাচন করুন (Select Default)</span>
              <p className="text-slate-400 mt-0.5">
                'Switch Input Method' বাটনে চাপ দিয়ে তালিকা থেকে 'Kotha Pro' বেছে নিন।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">ধাপ ৪: টাইপিং উপভোগ করুন</span>
              <p className="text-slate-400 mt-0.5">
                হোয়াটসঅ্যাপ, মেসেঞ্জার, ফেসবুক বা নোটপ্যাডে টাইপ করা শুরু করুন। 'ami' লিখলেই 'আমি', 'kotha' লিখলে 'কথা' চলে আসবে!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

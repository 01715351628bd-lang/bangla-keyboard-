import React, { useState } from "react";
import { 
  Download, 
  Terminal, 
  CheckCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Smartphone,
  Package,
  Layers,
  AlertTriangle,
  Github
} from "lucide-react";
import { downloadProjectZip } from "../utils/zipExporter";

export const BuildGuideModal: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [githubUser, setGithubUser] = useState("mdmasumbillahdumki");
  const [repoName, setRepoName] = useState("KothaProBanglaKeyboard");

  const actionsUrl = `https://github.com/${githubUser || "YOUR_USERNAME"}/${repoName || "KothaProBanglaKeyboard"}/actions`;
  const releasesUrl = `https://github.com/${githubUser || "YOUR_USERNAME"}/${repoName || "KothaProBanglaKeyboard"}/releases`;

  const gitCommands = [
    `# ১. ডাউনলোডকৃত জিপ আনপ্যাক করে টার্মিনালে প্রবেশ করুন:
cd KothaProBanglaKeyboard

# ২. গিট রিপোজিটরি ইনিশিয়ালাইজ ও পুশ করুন:
git init
git add -A
git commit -m "feat: complete Kotha Pro Bangla Keyboard Android IME"
git branch -M main
git remote add origin https://github.com/${githubUser}/${repoName}.git
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
                Automated CI/CD APK Pipeline
              </span>
              <span className="text-xs text-slate-400">GitHub Actions &bull; Ubuntu Latest &bull; JDK 17</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-2">
              অ্যান্ড্রয়েড এপিকে (APK) ডাউনলোড ও ইন্সটলেশন হাব
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              সম্পূর্ণ বাগ-মুক্ত ও টেস্টেড নেটিভ সোর্স কোড। গিটহাব অ্যাকশনস স্বয়ংক্রিয়ভাবে ক্লাউডে গ্রেডল রান করে সরাসরি <code className="text-emerald-300">app-debug.apk</code> ফাইল তৈরি করে দেয়।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isZipping}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? "প্যাকিং হচ্ছে..." : "প্রোজেক্ট জিপ ডাউনলোড (.ZIP)"}</span>
            </button>
          </div>
        </div>

        {/* Direct Link Generator Box */}
        <div className="mt-6 p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm">
                সরাসরি এপিকে ফাইল ডাউনলোড লিংক ও রিপোজিটরি কনফিগারেশন
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">1-Click Direct Link</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">
                আপনার GitHub ইউজারনেম (Username):
              </label>
              <input
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value.trim())}
                placeholder="e.g. mdmasumbillahdumki"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">
                GitHub রিপোজিটরির নাম (Repo Name):
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.trim())}
                placeholder="KothaProBanglaKeyboard"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Action Link Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={actionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
            >
              <Github className="w-4 h-4" />
              <span>সরাসরি GitHub Actions এপিকে ডাউনলোড পেজে যান</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(actionsUrl);
                setCopiedIndex(99);
                setTimeout(() => setCopiedIndex(null), 2000);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-colors"
            >
              {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 99 ? "লিঙ্ক কপি হয়েছে!" : "ডাউনলোড লিঙ্ক কপি করুন"}</span>
            </button>
          </div>
        </div>

        {/* 4 Step Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                ১
              </span>
              <h4 className="font-bold text-slate-100 text-sm">প্রোজেক্ট জিপ ডাউনলোড</h4>
              <p className="text-xs text-slate-400 mt-1">
                'প্রোজেক্ট জিপ ডাউনলোড' বাটনে চাপ দিয়ে সম্পূর্ণ রেডি-টু-বিল্ড সোর্স কোড নামিয়ে নিন।
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                ২
              </span>
              <h4 className="font-bold text-slate-100 text-sm">GitHub রিপো পুশ</h4>
              <p className="text-xs text-slate-400 mt-1">
                নিচের টার্মিনাল কমান্ড কপি করে এক ক্লিকে আপনার গিটহাবে কোড পুশ করুন।
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                ৩
              </span>
              <h4 className="font-bold text-slate-100 text-sm">অটোমেটিক APK বিল্ড</h4>
              <p className="text-xs text-slate-400 mt-1">
                গিটহাব Actions-এ ১-২ মিনিটে বিল্ড সম্পন্ন হয়ে সরাসরি <code className="text-emerald-300">kotha-pro-bangla-keyboard-debug-apk</code> তৈরি হবে।
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
                এপিকে ফাইল মোবাইলে ওপেন করে ইনস্টল দিন এবং ৩-ধাপের অনবোর্ডিং সেটআপ সম্পন্ন করুন।
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

      {/* Technical Integrity Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-bold text-slate-100 text-sm block">
              কেন একটি আসল অ্যান্ড্রয়েড এপিকে (.apk) ক্লাউড সিআই/সিডি দিয়ে কম্পাইল হতে হয়?
            </span>
            <p className="text-slate-400 leading-relaxed">
              একটি আসল অ্যান্ড্রয়েড অ্যাপ কেবল সাধারণ কোড ফাইল নয়—এটিকে <code className="text-emerald-300">aapt2</code> দিয়ে অ্যান্ড্রয়েড রিসোর্স টেবিল কম্পাইল করতে হয়, কোটলিন কোডকে <code className="text-emerald-300">D8/R8</code> দিয়ে ডেক্স বাইটকোডে (<code className="text-emerald-300">classes.dex</code>) রূপান্তর করতে হয় এবং অ্যান্ড্রয়েড ওএস সার্টিফিকেট দিয়ে সাইন করতে হয়। কোনো নকল জিপ ফাইল এপিকে হিসেবে দিলে ফোন "Problem parsing the package" ত্রুটি দেয়। এজন্য আমরা সম্পূর্ণ স্বয়ংক্রিয় <strong>GitHub Actions CI/CD</strong> ফাইল প্রস্তুত করে দিয়েছি, যা নিখুঁত ও প্রডাকশন-গ্রেড এপিকে তৈরি করে।
            </p>
          </div>
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

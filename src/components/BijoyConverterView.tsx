import React, { useState } from "react";
import { ansiToUnicode, unicodeToAnsi } from "../engine/bijoyConverter";
import { ArrowLeftRight, Copy, Check, Trash2, BookOpen, Layers } from "lucide-react";

export const BijoyConverterView: React.FC = () => {
  const [direction, setDirection] = useState<"ansiToUni" | "uniToAnsi">("ansiToUni");
  const [inputVal, setInputVal] = useState("Avgvi †mvbvi evsjv, Avwg †Zvgvq fvjvevwm|");
  const [copied, setCopied] = useState(false);

  const outputVal = direction === "ansiToUni" ? ansiToUnicode(inputVal) : unicodeToAnsi(inputVal);

  const handleSwap = () => {
    setDirection(prev => prev === "ansiToUni" ? "uniToAnsi" : "ansiToUni");
    setInputVal(outputVal);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleCases = [
    {
      title: "আমার সোনার বাংলা",
      ansi: "Avgvi †mvbvi evsjv, Avwg †Zvgvq fvjvevwm|",
      unicode: "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।"
    },
    {
      title: "শিক্ষা ও যুক্তাক্ষর",
      ansi: "wk¶v I hy³v¶i cÖwZôvb",
      unicode: "শিক্ষা ও যুক্তাক্ষর প্রতিষ্ঠান"
    },
    {
      title: "বাংলাদেশ আমার দেশ",
      ansi: "evsjv‡`k Avgvi †`k",
      unicode: "বাংলাদেশ আমার দেশ"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Bidirectional Legacy Converter
              </span>
              <span className="text-xs text-slate-400">SutonnyMJ ANSI ↔ Bengali Unicode</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-2">
              বিজয় অ্যানসি ↔ ইউনিকোড রূপান্তরকারী (Bijoy Converter)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              পুরোনো সুতন্নিএমজে (SutonnyMJ) অ্যানসি লেখা নিখুঁত ইউনিকোডে রূপান্তর করুন অথবা ইউনিকোড থেকে বিজয়ে ফিরিয়ে নিন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
              <span>দিক পরিবর্তন ({direction === "ansiToUni" ? "ANSI → ইউনিকোড" : "ইউনিকোড → ANSI"})</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "কপি হয়েছে!" : "ফলাফল কপি"}</span>
            </button>
          </div>
        </div>

        {/* Dual Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="uppercase tracking-wider">
                {direction === "ansiToUni" ? "ইনপুট: বিজয় অ্যানসি (SutonnyMJ)" : "ইনপুট: বাংলা ইউনিকোড (Unicode)"}
              </span>
              <button
                onClick={() => setInputVal("")}
                className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ক্লিয়ার</span>
              </button>
            </div>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={direction === "ansiToUni" ? "Bijoy ANSI text e.g. Avgvi †mvbvi evsjv..." : "বাংলা ইউনিকোড টেক্সট লিখুন..."}
              rows={8}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-mono text-sm focus:border-emerald-500 outline-none transition-all resize-none shadow-inner"
            />
          </div>

          {/* Target Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="uppercase tracking-wider">
                {direction === "ansiToUni" ? "রূপান্তরিত ফলাফল: বাংলা ইউনিকোড (Unicode)" : "রূপান্তরিত ফলাফল: বিজয় অ্যানসি (SutonnyMJ)"}
              </span>
              <span className="text-emerald-400 font-mono">{outputVal.length} chars</span>
            </div>
            <div className="w-full p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-emerald-300 font-sans text-base min-h-[200px] whitespace-pre-wrap leading-relaxed shadow-inner overflow-y-auto">
              {outputVal || <span className="text-slate-600 italic">ফলাফল এখানে দৃশ্যমান হবে...</span>}
            </div>
          </div>
        </div>

        {/* Quick Test Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>নমুনা টেক্সট রূপান্তর পরীক্ষা করুন:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleCases.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (direction === "ansiToUni") {
                    setInputVal(s.ansi);
                  } else {
                    setInputVal(s.unicode);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700/80 transition-colors flex items-center gap-1.5 active:scale-95"
              >
                <span className="font-medium text-emerald-400">{s.title}:</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
                  {direction === "ansiToUni" ? s.ansi : s.unicode}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Encoding Rules Explanation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>বিজয় অ্যানসি রূপান্তরের জটিল অ্যালগরিদম ও নিয়মাবলী</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-emerald-400 text-sm mb-1.5">১. প্রি-বেস কারচিহ্ন (Pre-base Kar)</h4>
            <p className="text-slate-400 leading-relaxed">
              সুতন্নি অ্যানসিতে এ-কার (‡), ঐ-কার (‰) এবং ই-কার (w) বর্ণের <strong>আগে</strong> বসে (যেমন ‡K = কে)। রূপান্তরকারী এটিকে স্বয়ংক্রিয়ভাবে বর্ণের পরে নিয়ে আসে।
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-emerald-400 text-sm mb-1.5">২. স্প্লিট ভাওয়েল ও ও-কার (Split Vowels)</h4>
            <p className="text-slate-400 leading-relaxed">
              ও-কার (ো) বিজয়ে এ-কার এবং আকার দিয়ে দুই ভাগে বসে: <code className="text-emerald-300">‡ + বর্ণ + v</code>। আমাদের ইঞ্জিন নিখুঁত রেজেক্সের মাধ্যমে একে একীভূত করে।
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-emerald-400 text-sm mb-1.5">৩. রেফ ও যুক্তাক্ষর (Reph &amp; Conjuncts)</h4>
            <p className="text-slate-400 leading-relaxed">
              বিজয়ে রেফ চিহ্ন (©) বর্ণের পরে বসে (K© = র্ক), অথচ ইউনিকোডে র+্ আগে থাকে। আমাদের কনভার্টার দ্বি-মুখী পজিশন প্রতিস্থাপন নিশ্চিত করে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

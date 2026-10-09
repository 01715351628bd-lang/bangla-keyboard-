import React, { useState } from "react";
import { transliterate, getPhoneticCandidates } from "../engine/bengaliPhonetic";
import { Copy, Check, Sparkles, CheckCircle2 } from "lucide-react";

export const PhoneticPlayground: React.FC = () => {
  const [inputText, setInputText] = useState("ami bangladesh bhalobashi. amar sonar bangla, ami tomay bhalobashi.");
  const [copied, setCopied] = useState(false);

  const bengaliOutput = transliterate(inputText);

  // Mandatory test cases from prompt
  const mandatoryTestCases = [
    { latin: "ami", expected: "আমি" },
    { latin: "amar", expected: "আমার" },
    { latin: "bangladesh", expected: "বাংলাদেশ" },
    { latin: "bangla", expected: "বাংলা" },
    { latin: "bhalo", expected: "ভালো" },
    { latin: "tumi", expected: "তুমি" },
    { latin: "kotha", expected: "কথা" },
    { latin: "dhaka", expected: "ঢাকা" },
    { latin: "shikkha", expected: "শিক্ষা" }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(bengaliOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4">
      {/* Title card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Offline Phonetic Transliteration
              </span>
              <span className="text-xs text-slate-400">1:1 Kotlin Engine Match</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-2">
              বাংলা ধ্বনিভিত্তিক টাইপিং ল্যাব (Avro Style)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              ল্যাটিন অক্ষরে ফোনেটিক লিখুন (যেমন: ami, amar, kotha, shikkha), ইঞ্জিন স্বয়ংক্রিয়ভাবে বিশুদ্ধ বাংলা ইউনিকোডে রূপান্তর করবে।
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "কপি হয়েছে!" : "আউটপুট কপি করুন"}</span>
          </button>
        </div>

        {/* Input & Output Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Left: Latin Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>English / Latin Phonetic Input</span>
              <span className="text-emerald-400 font-mono">{inputText.length} chars</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="type latin phonetic here e.g. ami bangladesh bhalobashi..."
              rows={6}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-mono text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none shadow-inner"
            />
          </div>

          {/* Right: Bengali Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Bengali Unicode Output (বাংলা ইউনিকোড)</span>
              <span className="text-emerald-400 font-mono">{bengaliOutput.length} chars</span>
            </div>
            <div
              className="w-full p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-emerald-300 font-sans text-base min-h-[156px] flex flex-col justify-between shadow-inner"
            >
              <div className="leading-relaxed whitespace-pre-wrap font-medium">
                {bengaliOutput || <span className="text-slate-600 italic">ফলাফল এখানে প্রদর্শিত হবে...</span>}
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>দাঁড়ি (Dari): ডট (.) চাপলে '।' হবে</span>
                <span>যুক্তাক্ষর ও কারচিহ্ন সমন্বিত</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Sample Buttons */}
        <div className="mt-5 pt-5 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>নমুনা শব্দে ক্লিক করে টেস্ট করুন:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "ami", "amar", "bangladesh", "bangla", "bhalo", "tumi", 
              "kotha", "dhaka", "shikkha", "dhonnobad", "poribar", "bondhu"
            ].map((word) => (
              <button
                key={word}
                onClick={() => setInputText(prev => prev ? `${prev} ${word}` : word)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700/80 transition-colors flex items-center gap-1.5 active:scale-95"
              >
                <span>{word}</span>
                <span className="text-emerald-400 font-sans">→ {transliterate(word)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Test Cases Verification Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>আবশ্যক টেস্ট কেস যাচাইকরণ মেট্রিক্স (Verification Matrix)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {mandatoryTestCases.map(({ latin, expected }) => {
            const actual = transliterate(latin);
            const passed = actual === expected;
            const candidates = getPhoneticCandidates(latin);

            return (
              <div
                key={latin}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-300 font-semibold">{latin}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {passed ? "✓ 100% MATCH" : "FAIL"}
                  </span>
                </div>
                <div className="text-lg font-bold text-emerald-300">
                  {actual}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 overflow-hidden truncate">
                  <span className="text-slate-500">পরামর্শ:</span>
                  <span>{candidates.slice(0, 3).join(", ")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

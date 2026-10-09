import React, { useState, useEffect } from "react";
import { 
  transliterateWord, 
  getPhoneticCandidates 
} from "../engine/bengaliPhonetic";
import { playKeyClickSound, triggerKeyHaptic } from "../utils/audioFeedback";
import { 
  Sparkles, 
  Mic, 
  Clipboard, 
  Delete, 
  CornerDownLeft, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Send,
  RotateCcw,
  Keyboard,
  ToggleLeft,
  ToggleRight,
  Info
} from "lucide-react";

export type KeyboardTheme = "dark" | "light" | "emerald" | "crimson" | "amoled";
export type TypingEngineMode = "phonetic" | "bijoy";

// Bijoy Typewriter standard mapping
interface BijoyKeyDef {
  key: string;       // QWERTY key
  primary: string;   // Normal unshifted Bengali char
  shifted: string;   // Shifted Bengali char
}

const BIJOY_ROW_1: BijoyKeyDef[] = [
  { key: "q", primary: "ঙ", shifted: "ং" },
  { key: "w", primary: "য", shifted: "য়" },
  { key: "e", primary: "ড", shifted: "ঢ" },
  { key: "r", primary: "প", shifted: "ফ" },
  { key: "t", primary: "ট", shifted: "ঠ" },
  { key: "y", primary: "চ", shifted: "ছ" },
  { key: "u", primary: "জ", shifted: "ঝ" },
  { key: "i", primary: "হ", shifted: "ঞ" },
  { key: "o", primary: "গ", shifted: "ঘ" },
  { key: "p", primary: "ড়", shifted: "ঢ়" }
];

const BIJOY_ROW_2: BijoyKeyDef[] = [
  { key: "a", primary: "ৃ", shifted: "র্" },
  { key: "s", primary: "ু", shifted: "ূ" },
  { key: "d", primary: "ি", shifted: "ী" },
  { key: "f", primary: "া", shifted: "অ" },
  { key: "g", primary: "্", shifted: "।" },
  { key: "h", primary: "ব", shifted: "ভ" },
  { key: "j", primary: "ক", shifted: "খ" },
  { key: "k", primary: "ত", shifted: "থ" },
  { key: "l", primary: "দ", shifted: "ধ" }
];

const BIJOY_ROW_3: BijoyKeyDef[] = [
  { key: "z", primary: "্র", shifted: "্য" },
  { key: "x", primary: "ো", shifted: "ৌ" },
  { key: "c", primary: "ে", shifted: "ৈ" },
  { key: "v", primary: "র", shifted: "ল" },
  { key: "b", primary: "ন", shifted: "ণ" },
  { key: "n", primary: "স", shifted: "ষ" },
  { key: "m", primary: "ম", shifted: "শ" }
];

const BIJOY_MAP: Record<string, { primary: string; shifted: string }> = {};
[...BIJOY_ROW_1, ...BIJOY_ROW_2, ...BIJOY_ROW_3].forEach(item => {
  BIJOY_MAP[item.key] = { primary: item.primary, shifted: item.shifted };
});

const VOWEL_COMBINATIONS: Record<string, string> = {
  "া": "আ",
  "ি": "ই",
  "ী": "ঈ",
  "ু": "উ",
  "ূ": "ঊ",
  "ৃ": "ঋ",
  "ে": "এ",
  "ৈ": "ঐ",
  "ো": "ও",
  "ৌ": "ঔ"
};

export const PhoneSimulator: React.FC = () => {
  const [theme, setTheme] = useState<KeyboardTheme>("dark");
  const [typingMode, setTypingMode] = useState<TypingEngineMode>("phonetic");
  const [layoutMode, setLayoutMode] = useState<"bengali" | "en" | "num">("bengali");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [isShifted, setIsShifted] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);

  // Buffer state
  const [latinBuffer, setLatinBuffer] = useState("");
  const [committedText, setCommittedText] = useState("কেমন আছেন? Kotha Pro বাংলা কীবোর্ডে স্বাগতম! ");
  const [messageFeed, setMessageFeed] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "স্বাগতম! আপনি এখন কথা প্রো বাংলা কীবোর্ড টেস্ট করছেন।" },
    { 
      sender: "bot", 
      text: "উপরে সুইচ করে 'Phonetic' অথবা 'Direct Bijoy' মোড টেস্ট করে দেখুন!" 
    }
  ]);

  // Derived current composing preview for phonetic mode
  const composingBengali = typingMode === "phonetic" && latinBuffer ? transliterateWord(latinBuffer) : "";
  const suggestions = typingMode === "phonetic" && latinBuffer ? getPhoneticCandidates(latinBuffer) : [];

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is in an outside input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleEnter();
      } else if (e.key === " ") {
        e.preventDefault();
        handleSpace();
      } else if (e.key === "Shift") {
        setIsShifted(true);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (layoutMode === "bengali") {
          if (typingMode === "phonetic") {
            setLatinBuffer(prev => prev + e.key.toLowerCase());
          } else {
            // Direct Bijoy typing
            const lowerKey = e.key.toLowerCase();
            const def = BIJOY_MAP[lowerKey];
            if (def) {
              const isUpper = e.shiftKey || e.key !== lowerKey;
              const char = isUpper ? def.shifted : def.primary;
              handleBijoyCharInput(char);
            } else if ("0123456789".includes(e.key)) {
              const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
              handleBijoyCharInput(digits[parseInt(e.key, 10)]);
            } else {
              handleBijoyCharInput(e.key);
            }
          }
        } else {
          setCommittedText(prev => prev + e.key);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift" && !isCapsLock) {
        setIsShifted(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [typingMode, layoutMode, isShifted, isCapsLock, latinBuffer, committedText]);

  // Key click handler
  const handleKeyClick = (primary: string, shifted?: string, rawKey?: string) => {
    if (soundEnabled) playKeyClickSound();
    if (hapticEnabled) triggerKeyHaptic();

    const isUpper = isShifted || isCapsLock;

    if (layoutMode === "bengali") {
      if (typingMode === "phonetic") {
        // Phonetic uses underlying English character
        const char = rawKey ? (isUpper ? rawKey.toUpperCase() : rawKey) : primary;
        setLatinBuffer(prev => prev + char.toLowerCase());
      } else {
        // Direct Bijoy mode
        const char = isUpper ? (shifted || primary) : primary;
        handleBijoyCharInput(char);
      }
    } else {
      const char = isUpper ? (shifted || primary) : primary;
      setCommittedText(prev => prev + char);
    }

    if (isShifted && !isCapsLock) {
      setIsShifted(false);
    }
  };

  const handleBijoyCharInput = (char: string) => {
    setCommittedText(prev => {
      // Check if previous char was Hasant '্' and current char is a vowel sign
      if (prev.endsWith("্") && VOWEL_COMBINATIONS[char]) {
        return prev.slice(0, -1) + VOWEL_COMBINATIONS[char];
      }
      return prev + char;
    });
  };

  const handleBackspace = () => {
    if (soundEnabled) playKeyClickSound();
    if (hapticEnabled) triggerKeyHaptic();

    if (typingMode === "phonetic" && latinBuffer.length > 0) {
      setLatinBuffer(prev => prev.slice(0, -1));
    } else if (committedText.length > 0) {
      setCommittedText(prev => prev.slice(0, -1));
    }
  };

  const handleSpace = () => {
    if (soundEnabled) playKeyClickSound();
    if (hapticEnabled) triggerKeyHaptic();

    if (typingMode === "phonetic" && latinBuffer) {
      const bengali = transliterateWord(latinBuffer);
      setCommittedText(prev => prev + bengali + " ");
      setLatinBuffer("");
    } else {
      setCommittedText(prev => prev + " ");
    }
  };

  const handleEnter = () => {
    if (soundEnabled) playKeyClickSound();
    if (hapticEnabled) triggerKeyHaptic();

    let fullMsg = committedText;
    if (typingMode === "phonetic" && latinBuffer) {
      fullMsg += transliterateWord(latinBuffer);
      setLatinBuffer("");
    }

    if (fullMsg.trim()) {
      setMessageFeed(prev => [...prev, { sender: "user", text: fullMsg.trim() }]);
      setCommittedText("");
    }
  };

  const handleSelectSuggestion = (candidate: string) => {
    if (soundEnabled) playKeyClickSound();
    setCommittedText(prev => prev + candidate + " ");
    setLatinBuffer("");
  };

  const themeStyles = {
    dark: {
      bg: "bg-slate-900",
      boardBg: "bg-slate-950",
      keyBg: "bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700/60",
      specialKeyBg: "bg-slate-800/80 hover:bg-slate-700 text-slate-300",
      accentKeyBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
      stripBg: "bg-slate-900 border-slate-800 text-slate-300"
    },
    light: {
      bg: "bg-slate-100",
      boardBg: "bg-slate-200",
      keyBg: "bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm",
      specialKeyBg: "bg-slate-300 hover:bg-slate-400 text-slate-800",
      accentKeyBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      stripBg: "bg-slate-100 border-slate-300 text-slate-800"
    },
    emerald: {
      bg: "bg-emerald-950",
      boardBg: "bg-emerald-950",
      keyBg: "bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border-emerald-800",
      specialKeyBg: "bg-emerald-950 hover:bg-emerald-900 text-emerald-300",
      accentKeyBg: "bg-emerald-500 hover:bg-emerald-400 text-slate-950",
      stripBg: "bg-emerald-950 border-emerald-800 text-emerald-200"
    },
    crimson: {
      bg: "bg-rose-950",
      boardBg: "bg-rose-950",
      keyBg: "bg-rose-900 hover:bg-rose-800 text-rose-100 border-rose-800",
      specialKeyBg: "bg-rose-950 hover:bg-rose-900 text-rose-300",
      accentKeyBg: "bg-rose-600 hover:bg-rose-500 text-white",
      stripBg: "bg-rose-950 border-rose-800 text-rose-200"
    },
    amoled: {
      bg: "bg-black",
      boardBg: "bg-black",
      keyBg: "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800",
      specialKeyBg: "bg-neutral-950 hover:bg-neutral-900 text-neutral-300",
      accentKeyBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
      stripBg: "bg-black border-neutral-900 text-neutral-300"
    }
  }[theme];

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:p-6 w-full max-w-4xl mx-auto space-y-4">
      {/* Primary Toggle Switch Control Bar */}
      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        {/* The Toggle Switch: Phonetic vs Direct Bijoy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              টাইপিং মোড সুইচ (Input Mode)
            </span>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {typingMode === "phonetic" ? "English-to-Bengali" : "Typewriter Layout"}
          </span>
        </div>

        {/* Animated Segmented Toggle Buttons */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              if (typingMode !== "phonetic") {
                if (soundEnabled) playKeyClickSound();
                setTypingMode("phonetic");
                setLayoutMode("bengali");
                setLatinBuffer("");
              }
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              typingMode === "phonetic"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phonetic (ধ্বনিভিত্তিক)</span>
          </button>

          <button
            onClick={() => {
              if (typingMode !== "bijoy") {
                if (soundEnabled) playKeyClickSound();
                setTypingMode("bijoy");
                setLayoutMode("bengali");
                setLatinBuffer("");
              }
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              typingMode === "bijoy"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Direct Bijoy (টাইপরাইটার)</span>
          </button>
        </div>

        {/* Dynamic Mode Hint Banner */}
        <div className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          {typingMode === "phonetic" ? (
            <div>
              <span className="font-semibold text-emerald-300">ধ্বনিভিত্তিক মোড: </span>
              ইংরেজি অক্ষরে টাইপ করুন যেমন <code className="text-white bg-slate-800 px-1 rounded">ami</code> &rarr; আমি, <code className="text-white bg-slate-800 px-1 rounded">kotha</code> &rarr; কথা, <code className="text-white bg-slate-800 px-1 rounded">shikkha</code> &rarr; শিক্ষা।
            </div>
          ) : (
            <div>
              <span className="font-semibold text-emerald-300">বিজয় টাইপরাইটার মোড: </span>
              সরাসরি বাংলা কীপ্রেস করুন: <code className="text-white bg-slate-800 px-1 rounded">ক</code> (j), <code className="text-white bg-slate-800 px-1 rounded">ব</code> (h), <code className="text-white bg-slate-800 px-1 rounded">্</code> (g - যুক্তাক্ষর লিংক)। শিফট চাপলে ওপরের অক্ষর টাইপ হবে।
            </div>
          )}
        </div>

        {/* Secondary Theme & Audio Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">থিম:</span>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as KeyboardTheme)}
              className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2 py-1 border border-slate-700 outline-none cursor-pointer"
            >
              <option value="dark">Midnight Dark</option>
              <option value="light">Classic Light</option>
              <option value="emerald">Emerald Green</option>
              <option value="crimson">Royal Crimson</option>
              <option value="amoled">Pure AMOLED</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                soundEnabled 
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" 
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
              title="Toggle Audio Click"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setMessageFeed([
                { sender: "bot", text: "স্বাগতম! আপনি এখন কথা প্রো বাংলা কীবোর্ড টেস্ট করছেন।" },
                { sender: "bot", text: "উপরে সুইচ করে 'Phonetic' অথবা 'Direct Bijoy' মোড টেস্ট করে দেখুন!" }
              ])}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Phone Frame */}
      <div className="w-full max-w-[390px] h-[720px] bg-slate-950 border-[10px] border-slate-800 rounded-[44px] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-700/50">
        {/* Phone Notch / Speaker */}
        <div className="w-full h-7 bg-slate-950 flex items-center justify-between px-6 pt-1 select-none z-20">
          <span className="text-[11px] font-semibold text-slate-400">9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>5G</span>
            <div className="w-4 h-2 border border-slate-400 rounded-sm p-[1px] flex items-center">
              <div className="w-full h-full bg-slate-400"></div>
            </div>
          </div>
        </div>

        {/* Active App Screen Area: Chat / Messaging Mockup */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-end space-y-2 bg-gradient-to-b from-slate-950 to-slate-900/90 text-sm">
          {messageFeed.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                msg.sender === "user" 
                  ? "bg-emerald-600 text-white ml-auto rounded-br-xs" 
                  : "bg-slate-800 text-slate-200 mr-auto rounded-bl-xs border border-slate-700/60"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {/* Active Input Box */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-2.5 flex items-center gap-2 mt-2">
            <div className="flex-1 font-sans text-xs min-h-[22px] flex items-center flex-wrap">
              <span className="text-slate-100 font-medium">
                {committedText}
              </span>
              {typingMode === "phonetic" && composingBengali && (
                <span className="bg-emerald-500/20 text-emerald-300 underline decoration-emerald-400 decoration-2 px-1 rounded font-semibold ml-0.5">
                  {composingBengali}
                </span>
              )}
              {typingMode === "phonetic" && latinBuffer && (
                <span className="text-[10px] text-slate-400 ml-1 font-mono">
                  ({latinBuffer})
                </span>
              )}
              <span className="w-0.5 h-4 bg-emerald-400 animate-pulse ml-0.5 inline-block"></span>
            </div>

            <button
              onClick={handleEnter}
              className="w-7 h-7 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-transform active:scale-90"
              title="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kotha Pro Soft Keyboard Interface */}
        <div className={`${themeStyles.boardBg} border-t border-slate-800/80 flex flex-col select-none`}>
          {/* Top Suggestion & Toolbar Strip */}
          <div className={`${themeStyles.stripBg} border-b px-2 h-10 flex items-center gap-1.5 overflow-hidden text-xs`}>
            {/* Quick Action: Mode Switcher in Keyboard Strip */}
            <button 
              onClick={() => {
                if (soundEnabled) playKeyClickSound();
                if (layoutMode === "en") {
                  setLayoutMode("bengali");
                } else if (typingMode === "phonetic") {
                  setTypingMode("bijoy");
                  setLatinBuffer("");
                } else {
                  setTypingMode("phonetic");
                }
              }}
              className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
              title="Toggle Typing Mode"
            >
              {layoutMode === "en" ? "EN" : typingMode === "phonetic" ? "ফোনেটিক" : "বিজয়"}
            </button>

            <button 
              onClick={() => {
                setCommittedText(prev => prev + "বাংলা ভয়েস ইনপুট টেস্ট ");
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
              title="Voice Typing"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            <button 
              onClick={() => {
                setCommittedText(prev => prev + "আমার সোনার বাংলা ");
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Clipboard Paste"
            >
              <Clipboard className="w-3.5 h-3.5" />
            </button>

            {/* Suggestions / Quick Helpers Strip */}
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar pl-1">
              {typingMode === "phonetic" ? (
                suggestions.length > 0 ? (
                  suggestions.map((cand, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSuggestion(cand)}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 font-medium whitespace-nowrap transition-colors text-xs border border-slate-700/60"
                    >
                      {cand}
                    </button>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-400 italic">
                    Phonetic: ami, amar, kotha, shikkha...
                  </span>
                )
              ) : (
                // Direct Bijoy helper characters
                <>
                  <span className="text-[9px] text-emerald-400/80 uppercase font-semibold">বিজয়:</span>
                  {["অ", "আ", "ই", "ঈ", "উ", "এ", "ও", "ক্ষ", "জ্ঞ", "ঞ্চ", "ত্র"].map((char, i) => (
                    <button
                      key={i}
                      onClick={() => handleBijoyCharInput(char)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600/30 text-slate-200 font-medium whitespace-nowrap transition-colors text-xs border border-slate-700/60"
                    >
                      {char}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Dynamic Key Rows */}
          <div className="p-1.5 pb-5 space-y-1.5">
            {/* Number Row */}
            <div className="flex items-center gap-1 justify-center">
              {(layoutMode === "en" ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] : ["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "০"]).map((num, i) => (
                <button
                  key={i}
                  onClick={() => handleKeyClick(num)}
                  className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Row 1 */}
            <div className="flex items-center gap-1 justify-center">
              {layoutMode === "bengali" && typingMode === "bijoy" ? (
                // Direct Bijoy Row 1
                BIJOY_ROW_1.map((item) => {
                  const displayChar = isShifted || isCapsLock ? item.shifted : item.primary;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleKeyClick(item.primary, item.shifted, item.key)}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                    >
                      <span className="leading-tight">{displayChar}</span>
                      <span className="text-[8px] text-slate-500 font-mono leading-none">
                        {isShifted || isCapsLock ? item.primary : item.shifted}
                      </span>
                    </button>
                  );
                })
              ) : (
                // Phonetic / English Row 1
                ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeyClick(k, k.toUpperCase(), k)}
                    className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                  >
                    <span>{isShifted || isCapsLock ? k.toUpperCase() : k}</span>
                    {layoutMode === "bengali" && (
                      <span className="text-[9px] text-slate-400 font-normal leading-none -mt-0.5">
                        {{ q: "ঙ", w: "ও", e: "এ", r: "র", t: "ত", y: "য়", u: "উ", i: "ই", o: "ও", p: "প" }[k]}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-1 justify-center px-1">
              {layoutMode === "bengali" && typingMode === "bijoy" ? (
                // Direct Bijoy Row 2
                BIJOY_ROW_2.map((item) => {
                  const displayChar = isShifted || isCapsLock ? item.shifted : item.primary;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleKeyClick(item.primary, item.shifted, item.key)}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                    >
                      <span className="leading-tight">{displayChar}</span>
                      <span className="text-[8px] text-slate-500 font-mono leading-none">
                        {isShifted || isCapsLock ? item.primary : item.shifted}
                      </span>
                    </button>
                  );
                })
              ) : (
                // Phonetic / English Row 2
                ["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeyClick(k, k.toUpperCase(), k)}
                    className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                  >
                    <span>{isShifted || isCapsLock ? k.toUpperCase() : k}</span>
                    {layoutMode === "bengali" && (
                      <span className="text-[9px] text-slate-400 font-normal leading-none -mt-0.5">
                        {{ a: "অ", s: "স", d: "দ", f: "ফ", g: "গ", h: "হ", j: "জ", k: "ক", l: "ল" }[k]}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Row 3: Shift, Z to M, Backspace */}
            <div className="flex items-center gap-1 justify-center">
              <button
                onClick={() => {
                  if (soundEnabled) playKeyClickSound();
                  if (isShifted) {
                    setIsCapsLock(!isCapsLock);
                  } else {
                    setIsShifted(true);
                  }
                }}
                className={`w-11 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all active:scale-95 border ${
                  isShifted || isCapsLock 
                    ? "bg-emerald-600 text-white border-emerald-500" 
                    : themeStyles.specialKeyBg
                }`}
              >
                {isCapsLock ? "⇪" : "⇧"}
              </button>

              {layoutMode === "bengali" && typingMode === "bijoy" ? (
                // Direct Bijoy Row 3
                BIJOY_ROW_3.map((item) => {
                  const displayChar = isShifted || isCapsLock ? item.shifted : item.primary;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleKeyClick(item.primary, item.shifted, item.key)}
                      className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                    >
                      <span className="leading-tight">{displayChar}</span>
                      <span className="text-[8px] text-slate-500 font-mono leading-none">
                        {isShifted || isCapsLock ? item.primary : item.shifted}
                      </span>
                    </button>
                  );
                })
              ) : (
                // Phonetic / English Row 3
                ["z", "x", "c", "v", "b", "n", "m"].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeyClick(k, k.toUpperCase(), k)}
                    className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                  >
                    <span>{isShifted || isCapsLock ? k.toUpperCase() : k}</span>
                    {layoutMode === "bengali" && (
                      <span className="text-[9px] text-slate-400 font-normal leading-none -mt-0.5">
                        {{ z: "য", x: "ক্স", c: "চ", v: "ভ", b: "ব", n: "ন", m: "ম" }[k]}
                      </span>
                    )}
                  </button>
                ))
              )}

              <button
                onClick={handleBackspace}
                className={`w-11 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.specialKeyBg}`}
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Row 4: Mode Switch, Dari, Space, Punct, Enter */}
            <div className="flex items-center gap-1 justify-center">
              <button
                onClick={() => {
                  if (layoutMode === "bengali") {
                    setLayoutMode("en");
                  } else {
                    setLayoutMode("bengali");
                  }
                }}
                className={`w-12 h-10 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.specialKeyBg}`}
              >
                {layoutMode === "bengali" ? "EN" : "বাং"}
              </button>

              <button
                onClick={() => handleKeyClick(layoutMode === "bengali" ? "।" : ".")}
                className={`w-9 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
              >
                {layoutMode === "bengali" ? "।" : "."}
              </button>

              {/* Space Bar with Mode Label */}
              <button
                onClick={handleSpace}
                className={`flex-1 h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
              >
                <span className="text-slate-400 text-[11px]">
                  {layoutMode === "en" 
                    ? "English" 
                    : typingMode === "phonetic" 
                    ? "বাংলা (ফোনেটিক)" 
                    : "বিজয় (টাইপরাইটার)"}
                </span>
              </button>

              <button
                onClick={() => handleKeyClick(",")}
                className={`w-9 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
              >
                ,
              </button>

              <button
                onClick={handleEnter}
                className={`w-12 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.accentKeyBg}`}
                title="Enter"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

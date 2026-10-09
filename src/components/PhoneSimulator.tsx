import React, { useState } from "react";
import { 
  transliterateWord, 
  getPhoneticCandidates 
} from "../engine/bengaliPhonetic";
import { playKeyClickSound, triggerKeyHaptic } from "../utils/audioFeedback";
import { 
  Sparkles, 
  Mic, 
  Clipboard, 
  Settings, 
  Delete, 
  CornerDownLeft, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Send,
  RotateCcw
} from "lucide-react";

export type KeyboardTheme = "dark" | "light" | "emerald" | "crimson" | "amoled";

interface PhoneSimulatorProps {
  onInsertExternal?: (text: string) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = () => {
  const [theme, setTheme] = useState<KeyboardTheme>("dark");
  const [mode, setMode] = useState<"bn" | "en" | "num" | "sym">("bn");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [isShifted, setIsShifted] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);

  // Buffer state
  const [latinBuffer, setLatinBuffer] = useState("");
  const [committedText, setCommittedText] = useState("কেমন আছেন? Kotha Pro বাংলা কীবোর্ডে স্বাগতম! ");
  const [messageFeed, setMessageFeed] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "স্বাগতম! আপনি এখন কথা প্রো বাংলা কীবোর্ড টেস্ট করছেন।" },
    { sender: "bot", text: "নিচের ভার্চুয়াল কীবোর্ডে 'ami', 'amar', 'kotha', 'shikkha' টাইপ করে দেখুন!" }
  ]);

  // Derived current composing Bengali preview
  const composingBengali = latinBuffer ? transliterateWord(latinBuffer) : "";
  const suggestions = latinBuffer ? getPhoneticCandidates(latinBuffer) : [];

  const handleKeyClick = (primary: string, shifted?: string) => {
    if (soundEnabled) playKeyClickSound();
    if (hapticEnabled) triggerKeyHaptic();

    const char = isShifted || isCapsLock ? (shifted || primary) : primary;

    if (mode === "bn") {
      setLatinBuffer(prev => prev + char);
    } else {
      setCommittedText(prev => prev + char);
    }

    if (isShifted && !isCapsLock) {
      setIsShifted(false);
    }
  };

  const handleBackspace = () => {
    if (soundEnabled) playKeyClickSound();
    if (hapticEnabled) triggerKeyHaptic();

    if (latinBuffer.length > 0) {
      setLatinBuffer(prev => prev.slice(0, -1));
    } else if (committedText.length > 0) {
      setCommittedText(prev => prev.slice(0, -1));
    }
  };

  const handleSpace = () => {
    if (soundEnabled) playKeyClickSound();
    if (hapticEnabled) triggerKeyHaptic();

    if (latinBuffer) {
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
    if (latinBuffer) {
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
      stripBg: "bg-slate-900 border-slate-800 text-slate-300",
      phoneBody: "bg-slate-900 border-slate-800"
    },
    light: {
      bg: "bg-slate-100",
      boardBg: "bg-slate-200",
      keyBg: "bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm",
      specialKeyBg: "bg-slate-300 hover:bg-slate-400 text-slate-800",
      accentKeyBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      stripBg: "bg-slate-100 border-slate-300 text-slate-800",
      phoneBody: "bg-slate-100 border-slate-300"
    },
    emerald: {
      bg: "bg-emerald-950",
      boardBg: "bg-emerald-950",
      keyBg: "bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border-emerald-800",
      specialKeyBg: "bg-emerald-950 hover:bg-emerald-900 text-emerald-300",
      accentKeyBg: "bg-emerald-500 hover:bg-emerald-400 text-slate-950",
      stripBg: "bg-emerald-950 border-emerald-800 text-emerald-200",
      phoneBody: "bg-emerald-950 border-emerald-800"
    },
    crimson: {
      bg: "bg-rose-950",
      boardBg: "bg-rose-950",
      keyBg: "bg-rose-900 hover:bg-rose-800 text-rose-100 border-rose-800",
      specialKeyBg: "bg-rose-950 hover:bg-rose-900 text-rose-300",
      accentKeyBg: "bg-rose-600 hover:bg-rose-500 text-white",
      stripBg: "bg-rose-950 border-rose-800 text-rose-200",
      phoneBody: "bg-rose-950 border-rose-800"
    },
    amoled: {
      bg: "bg-black",
      boardBg: "bg-black",
      keyBg: "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800",
      specialKeyBg: "bg-neutral-950 hover:bg-neutral-900 text-neutral-300",
      accentKeyBg: "bg-emerald-600 hover:bg-emerald-500 text-white",
      stripBg: "bg-black border-neutral-900 text-neutral-300",
      phoneBody: "bg-black border-neutral-900"
    }
  }[theme];

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:p-6 w-full max-w-4xl mx-auto">
      {/* Controls Bar above Simulator */}
      <div className="w-full max-w-md flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Theme</span>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value as KeyboardTheme)}
            className="bg-slate-800 text-xs font-medium text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="dark">Midnight Dark</option>
            <option value="light">Classic Light</option>
            <option value="emerald">Emerald Green</option>
            <option value="crimson">Royal Crimson</option>
            <option value="amoled">Pure AMOLED</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              soundEnabled 
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" 
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title="Toggle Sound Click"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Click</span>
          </button>

          <button
            onClick={() => setMessageFeed([
              { sender: "bot", text: "স্বাগতম! আপনি এখন কথা প্রো বাংলা কীবোর্ড টেস্ট করছেন।" },
              { sender: "bot", text: "নিচের ভার্চুয়াল কীবোর্ডে 'ami', 'amar', 'kotha', 'shikkha' টাইপ করে দেখুন!" }
            ])}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
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
              {composingBengali && (
                <span className="bg-emerald-500/20 text-emerald-300 underline decoration-emerald-400 decoration-2 px-1 rounded font-semibold ml-0.5">
                  {composingBengali}
                </span>
              )}
              {latinBuffer && (
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
            {/* Quick Action Icons */}
            <button 
              onClick={() => {
                if (mode === "bn") setMode("en");
                else setMode("bn");
              }}
              className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[11px] hover:bg-emerald-500/30 transition-colors"
              title="Toggle Language"
            >
              {mode === "bn" ? "বাং" : "EN"}
            </button>

            <button 
              onClick={() => {
                setCommittedText(prev => prev + "বাংলা ভয়েস ইনপুট টেস্ট ");
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
              title="Voice Typing"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            <button 
              onClick={() => {
                setCommittedText(prev => prev + "আমার সোনার বাংলা ");
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Clipboard Paste"
            >
              <Clipboard className="w-3.5 h-3.5" />
            </button>

            {/* Suggestions Horizontal Candidates */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar pl-1">
              {suggestions.length > 0 ? (
                suggestions.map((cand, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSuggestion(cand)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 font-medium whitespace-nowrap transition-colors text-xs border border-slate-700/60"
                  >
                    {cand}
                  </button>
                ))
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  {mode === "bn" ? "Phonetic: ami, amar, kotha, shikkha..." : "Type text..."}
                </span>
              )}
            </div>

            <button 
              onClick={() => setTheme(theme === "dark" ? "emerald" : theme === "emerald" ? "light" : "dark")}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Switch Theme"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key Rows */}
          <div className="p-1.5 pb-5 space-y-1.5">
            {/* Number Row */}
            <div className="flex items-center gap-1 justify-center">
              {(mode === "bn" ? ["১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "০"] : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]).map((num, i) => (
                <button
                  key={i}
                  onClick={() => handleKeyClick(num)}
                  className={`flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Row 1: Q W E R T Y U I O P */}
            <div className="flex items-center gap-1 justify-center">
              {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyClick(k, k.toUpperCase())}
                  className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                >
                  <span>{isShifted || isCapsLock ? k.toUpperCase() : k}</span>
                  {mode === "bn" && (
                    <span className="text-[9px] text-slate-400 font-normal leading-none -mt-0.5">
                      {{ q: "ঙ", w: "ও", e: "এ", r: "র", t: "ত", y: "য়", u: "উ", i: "ই", o: "ও", p: "প" }[k]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Row 2: A S D F G H J K L */}
            <div className="flex items-center gap-1 justify-center px-2">
              {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyClick(k, k.toUpperCase())}
                  className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                >
                  <span>{isShifted || isCapsLock ? k.toUpperCase() : k}</span>
                  {mode === "bn" && (
                    <span className="text-[9px] text-slate-400 font-normal leading-none -mt-0.5">
                      {{ a: "অ", s: "স", d: "দ", f: "ফ", g: "গ", h: "হ", j: "জ", k: "ক", l: "ল" }[k]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Row 3: Shift, Z X C V B N M, Backspace */}
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

              {["z", "x", "c", "v", "b", "n", "m"].map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyClick(k, k.toUpperCase())}
                  className={`flex-1 h-10 rounded-lg text-sm font-semibold flex flex-col items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
                >
                  <span>{isShifted || isCapsLock ? k.toUpperCase() : k}</span>
                  {mode === "bn" && (
                    <span className="text-[9px] text-slate-400 font-normal leading-none -mt-0.5">
                      {{ z: "য", x: "ক্স", c: "চ", v: "ভ", b: "ব", n: "ন", m: "ম" }[k]}
                    </span>
                  )}
                </button>
              ))}

              <button
                onClick={handleBackspace}
                className={`w-11 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.specialKeyBg}`}
                title="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Row 4: Mode, Dari/Punct, Space, Enter */}
            <div className="flex items-center gap-1 justify-center">
              <button
                onClick={() => {
                  if (mode === "bn") setMode("en");
                  else if (mode === "en") setMode("bn");
                }}
                className={`w-12 h-10 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.specialKeyBg}`}
              >
                {mode === "bn" ? "?123" : "বাং"}
              </button>

              <button
                onClick={() => handleKeyClick(mode === "bn" ? "।" : ".")}
                className={`w-9 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
              >
                {mode === "bn" ? "।" : "."}
              </button>

              {/* Space Bar */}
              <button
                onClick={handleSpace}
                className={`flex-1 h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all active:scale-95 border ${themeStyles.keyBg}`}
              >
                <span className="text-slate-400 text-[11px]">
                  {mode === "bn" ? "বাংলা (Phonetic)" : "English"}
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

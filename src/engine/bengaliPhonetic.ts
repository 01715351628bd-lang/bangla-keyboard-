/**
 * Bengali Phonetic Transliteration Engine (TypeScript port matching BengaliPhoneticEngine.kt)
 * Supports standard phonetic input:
 *  - ami -> আমি
 *  - amar -> আমার
 *  - bangladesh -> বাংলাদেশ
 *  - bangla -> বাংলা
 *  - bhalo -> ভালো
 *  - tumi -> তুমি
 *  - kotha -> কথা
 *  - dhaka -> ঢাকা
 *  - shikkha -> শিক্ষা
 */

const commonWordMap: Record<string, string> = {
  ami: "আমি",
  amii: "আমিই",
  amar: "আমার",
  amader: "আমাদের",
  amake: "আমাকে",
  tumi: "তুমি",
  tomar: "তোমার",
  tomader: "তোমাদের",
  tomake: "তোমাকে",
  apni: "আপনি",
  apnar: "আপনার",
  she: "সে",
  tar: "তার",
  tader: "তাদের",
  bangla: "বাংলা",
  bangladesh: "বাংলাদেশ",
  bhalo: "ভালো",
  bhalobasha: "ভালোবাসা",
  kotha: "কথা",
  dhaka: "ঢাকা",
  shikkha: "শিক্ষা",
  shikkhok: "শিক্ষক",
  desh: "দেশ",
  ekhon: "এখন",
  kemon: "কেমন",
  achen: "আছেন",
  acho: "আছো",
  achhi: "আছি",
  ki: "কী",
  kintu: "কিন্তু",
  shob: "সব",
  shobai: "সবাই",
  khub: "খুব",
  dhonnobad: "ধন্যবাদ",
  bondhu: "বন্ধু",
  poribar: "পরিবার",
  kolkata: "কলকাতা",
  prothom: "প্রথম",
  shurute: "শুরুতে",
  shudhu: "শুধু",
  aro: "আরো",
  onek: "অনেক",
  shundor: "সুন্দর"
};

const independentVowels: Record<string, string> = {
  a: "অ",
  aa: "আ",
  A: "আ",
  i: "ই",
  ee: "ঈ",
  I: "ঈ",
  u: "উ",
  oo: "ঊ",
  U: "ঊ",
  rri: "ঋ",
  e: "এ",
  oi: "ঐ",
  OI: "ঐ",
  o: "ও",
  O: "ও",
  ou: "ঔ",
  OU: "ঔ"
};

const dependentVowels: Record<string, string> = {
  a: "া",
  aa: "া",
  A: "া",
  i: "ি",
  ee: "ী",
  I: "ী",
  u: "ু",
  oo: "ূ",
  U: "ূ",
  rri: "ৃ",
  e: "ে",
  oi: "ৈ",
  OI: "ৈ",
  o: "ো",
  O: "ো",
  ou: "ৌ",
  OU: "ৌ"
};

const conjuncts: [string, string][] = [
  ["kkh", "ক্ষ"],
  ["k-kh", "ক্ষ"],
  ["kkhN", "ক্ষ্ণ"],
  ["kkhm", "ক্ষ্ম"],
  ["jng", "জ্ঞ"],
  ["gy", "জ্ঞ"],
  ["ngk", "ঙ্ক"],
  ["ngkh", "ঙ্খ"],
  ["ngg", "ঙ্গ"],
  ["nggh", "ঙ্ঘ"],
  ["chch", "চ্চ"],
  ["cch", "চ্ছ"],
  ["jj", "জ্জ"],
  ["jjh", "জ্ঝ"],
  ["TT", "ট্ট"],
  ["DD", "ড্ড"],
  ["NT", "ণ্ট"],
  ["NTh", "ণ্ঠ"],
  ["ND", "ণ্ড"],
  ["NDh", "ণ্ঢ"],
  ["NN", "ণ্ণ"],
  ["tt", "ত্ত"],
  ["tth", "ত্থ"],
  ["tn", "ত্ন"],
  ["tm", "ত্ম"],
  ["tr", "ত্র"],
  ["dd", "দ্দ"],
  ["ddh", "দ্ধ"],
  ["db", "দ্ব"],
  ["dm", "দ্ম"],
  ["dhb", "ধ্ব"],
  ["nt", "ন্ত"],
  ["nth", "ন্থ"],
  ["nd", "ন্দ"],
  ["ndh", "ন্ধ"],
  ["nn", "ন্ন"],
  ["pt", "প্ত"],
  ["pn", "প্ন"],
  ["pp", "প্প"],
  ["pl", "প্ল"],
  ["ps", "প্স"],
  ["bd", "ব্দ"],
  ["bdh", "ব্ধ"],
  ["bb", "ব্ব"],
  ["bl", "ব্ল"],
  ["bhr", "ভ্র"],
  ["mn", "ম্ন"],
  ["mp", "ম্প"],
  ["mph", "ম্ফ"],
  ["mb", "ম্ব"],
  ["mbh", "ম্ভ"],
  ["mm", "ম্ম"],
  ["ml", "ম্ল"],
  ["shc", "শ্চ"],
  ["shch", "শ্চ"],
  ["shn", "শ্ন"],
  ["shm", "শ্ম"],
  ["shl", "শ্ল"],
  ["shb", "শ্ব"],
  ["Shk", "ষ্ক"],
  ["ShT", "ষ্ট"],
  ["ShTh", "ষ্ঠ"],
  ["ShN", "ষ্ণ"],
  ["Shp", "ষ্প"],
  ["Shph", "ষ্ফ"],
  ["Shm", "ষ্ম"],
  ["st", "স্ত"],
  ["sth", "স্থ"],
  ["sn", "স্ন"],
  ["sp", "স্প"],
  ["sph", "স্ফ"],
  ["sb", "স্ব"],
  ["sm", "স্ম"],
  ["sl", "স্ল"],
  ["hn", "হ্ন"],
  ["hm", "হ্ম"],
  ["hl", "হ্ল"],
  ["hb", "হ্ব"],
  ["hr", "হ্র"]
];

const consonants: [string, string][] = [
  ["kkh", "ক্ষ"],
  ["kh", "খ"],
  ["gh", "ঘ"],
  ["Ng", "ঙ"],
  ["ch", "চ"],
  ["Ch", "ছ"],
  ["chh", "ছ"],
  ["jh", "ঝ"],
  ["NG", "ঞ"],
  ["Th", "ঠ"],
  ["Dh", "ঢ"],
  ["th", "থ"],
  ["dh", "ধ"],
  ["ph", "ফ"],
  ["bh", "ভ"],
  ["sh", "শ"],
  ["Sh", "ষ"],
  ["Rh", "ঢ়"],
  ["ng", "ং"],
  ["k", "ক"],
  ["g", "গ"],
  ["c", "চ"],
  ["j", "জ"],
  ["T", "ট"],
  ["D", "ড"],
  ["N", "ণ"],
  ["t", "ত"],
  ["d", "দ"],
  ["n", "ন"],
  ["p", "প"],
  ["f", "ফ"],
  ["b", "ব"],
  ["v", "ভ"],
  ["m", "ম"],
  ["z", "য"],
  ["r", "র"],
  ["l", "ল"],
  ["s", "স"],
  ["S", "শ"],
  ["h", "হ"],
  ["R", "ড়"],
  ["y", "য়"],
  ["Y", "য়"],
  ["w", "ও"]
];

const digits: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
};

export function transliterateWord(raw: string): string {
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (commonWordMap[lower]) return commonWordMap[lower];

  let out = "";
  let i = 0;
  const len = raw.length;
  let prevWasConsonant = false;

  while (i < len) {
    if (raw[i] === "`" || raw[i] === ":") {
      out += raw[i] === ":" ? "ঃ" : "\u09CD";
      prevWasConsonant = false;
      i++;
      continue;
    }
    if (raw[i] === "^") {
      out += "ঁ";
      prevWasConsonant = false;
      i++;
      continue;
    }

    // 1. Conjuncts
    let matchedConj = false;
    for (const [k, v] of conjuncts) {
      if (raw.substring(i, i + k.length).toLowerCase() === k.toLowerCase()) {
        out += v;
        i += k.length;
        prevWasConsonant = true;
        matchedConj = true;
        break;
      }
    }
    if (matchedConj) continue;

    // 2. Consonants
    let matchedCons = false;
    for (const [k, v] of consonants) {
      if (raw.substring(i, i + k.length) === k) {
        const nextIdx = i + k.length;
        if (prevWasConsonant && (k === "y" || k === "z")) {
          out += "\u09CDয";
          i = nextIdx;
          prevWasConsonant = true;
          matchedCons = true;
          break;
        }
        if (prevWasConsonant && k === "w") {
          out += "\u09CDব";
          i = nextIdx;
          prevWasConsonant = true;
          matchedCons = true;
          break;
        }
        if (prevWasConsonant && k === "r") {
          out += "\u09CDর";
          i = nextIdx;
          prevWasConsonant = true;
          matchedCons = true;
          break;
        }

        out += v;
        i = nextIdx;
        prevWasConsonant = true;
        matchedCons = true;
        break;
      }
    }
    if (matchedCons) continue;

    // 3. Vowels
    let matchedVowel = false;
    const vowelKeys = ["rri", "aa", "ee", "oo", "oi", "ou", "OI", "OU", "a", "A", "i", "I", "u", "U", "e", "o", "O"];
    for (const vk of vowelKeys) {
      if (raw.substring(i, i + vk.length) === vk) {
        if (prevWasConsonant) {
          if (vk !== "a") {
            out += dependentVowels[vk] || "";
          }
        } else {
          out += independentVowels[vk] || "";
        }
        i += vk.length;
        prevWasConsonant = false;
        matchedVowel = true;
        break;
      }
    }
    if (matchedVowel) continue;

    const ch = raw[i];
    if (digits[ch]) {
      out += digits[ch];
    } else {
      out += ch;
    }
    prevWasConsonant = false;
    i++;
  }

  return out;
}

export function transliterate(text: string): string {
  if (!text) return "";
  let result = "";
  let token = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/\s/.test(ch) || ",.?!;:\n\r\t".includes(ch)) {
      if (token.length > 0) {
        result += transliterateWord(token);
        token = "";
      }
      result += ch === "." ? "।" : ch;
    } else if (/\d/.test(ch)) {
      if (token.length > 0) {
        result += transliterateWord(token);
        token = "";
      }
      result += digits[ch] || ch;
    } else {
      token += ch;
    }
  }

  if (token.length > 0) {
    result += transliterateWord(token);
  }

  return result;
}

export function getPhoneticCandidates(raw: string): string[] {
  if (!raw.trim()) return [];
  const candidates: string[] = [];
  const lower = raw.toLowerCase();

  if (commonWordMap[lower]) {
    candidates.push(commonWordMap[lower]);
  }

  const primary = transliterateWord(raw);
  if (!candidates.includes(primary)) {
    candidates.push(primary);
  }

  if (lower.includes("o")) {
    const alt = transliterateWord(raw.replace(/o/g, "O"));
    if (alt && !candidates.includes(alt)) candidates.push(alt);
  }

  if (lower.includes("i")) {
    const alt = transliterateWord(raw.replace(/i/g, "ee"));
    if (alt && !candidates.includes(alt)) candidates.push(alt);
  }

  if (!candidates.includes(raw)) {
    candidates.push(raw);
  }

  return candidates;
}

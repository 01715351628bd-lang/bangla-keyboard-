/**
 * Bijoy ANSI (SutonnyMJ) <-> Bengali Unicode Converter (TypeScript port)
 */

const ansiToUnicodeMap: Record<string, string> = {
  Av: "আ",
  A: "অ",
  B: "ই",
  C: "ঈ",
  D: "উ",
  E: "ঊ",
  F: "ঋ",
  G: "এ",
  H: "ঐ",
  I: "ও",
  J: "ঔ",

  K: "ক",
  L: "খ",
  M: "গ",
  N: "ঘ",
  O: "ঙ",
  P: "চ",
  Q: "ছ",
  R: "জ",
  S: "ঝ",
  T: "ঞ",
  U: "ট",
  V: "ঠ",
  W: "ড",
  X: "ঢ",
  Y: "ণ",
  Z: "ত",
  _: "থ",
  "`": "দ",
  a: "ধ",
  b: "ন",
  c: "প",
  d: "ফ",
  e: "ব",
  f: "ভ",
  g: "ম",
  h: "য",
  i: "র",
  j: "ল",
  k: "শ",
  l: "ষ",
  m: "স",
  n: "হ",
  o: "ড়",
  p: "ঢ়",
  q: "য়",
  r: "ৎ",
  s: "ং",
  t: "ঃ",
  u: "ঁ",

  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",

  v: "া",
  w: "ি",
  x: "ী",
  y: "ু",
  "~": "ূ",
  "„": "ৃ",
  "‡": "ে",
  "‰": "ৈ",
  "Š": "ৌ",
  "&": "্"
};

const ansiConjuncts: [string, string][] = [
  ["¶", "ক্ষ"],
  ["¼", "ঙ্ক"],
  ["½", "ঙ্গ"],
  ["¾", "জ্ঞ"],
  ["¿", "ঞ্চ"],
  ["À", "ঞ্ছ"],
  ["Á", "ঞ্জ"],
  ["Â", "ট্ট"],
  ["Ã", "ড্ড"],
  ["Ä", "ণ্ট"],
  ["Å", "ণ্ঠ"],
  ["Æ", "ণ্ড"],
  ["Ç", "ত্ত"],
  ["È", "ত্থ"],
  ["É", "ত্ন"],
  ["Ê", "ত্ম"],
  ["Ë", "ত্র"],
  ["Ì", "দ্দ"],
  ["Í", "দ্ধ"],
  ["Î", "দ্ব"],
  ["Ï", "দ্ম"],
  ["Ð", "ন্ত"],
  ["Ñ", "ন্থ"],
  ["Ò", "ন্দ"],
  ["Ó", "ন্ধ"],
  ["Ô", "ন্ন"],
  ["Õ", "প্ত"],
  ["Ö", "প্র"],
  ["×", "ম্প"],
  ["Ø", "ম্ব"],
  ["Ù", "ম্ভ"],
  ["Ú", "ম্ম"],
  ["Û", "ষ্ট"],
  ["Ü", "ষ্ঠ"],
  ["Ý", "ষ্ণ"],
  ["Þ", "স্ত"],
  ["ß", "স্থ"],
  ["à", "স্ন"],
  ["á", "স্প"],
  ["â", "স্ফ"],
  ["ã", "স্ব"],
  ["ä", "স্ম"],
  ["å", "হ্ন"],
  ["æ", "হ্ম"],
  ["ç", "হ্ল"],
  ["è", "হ্ব"],
  ["é", "হ্র"],
  ["ê", "দ্ব"],
  ["ë", "ক্ত"],
  ["ì", "ক্র"],
  ["í", "গ্র"]
];

export function ansiToUnicode(ansiText: string): string {
  if (!ansiText) return "";
  let text = ansiText;

  for (const [ansi, uni] of ansiConjuncts) {
    text = text.replaceAll(ansi, uni);
  }

  // O-kar: ‡ + Consonant + v -> Consonant + ো
  text = text.replace(/‡([^\t\n\r ‡]+)v/g, "$1ো");

  // Ou-kar: ‡ + Consonant + Š -> Consonant + ৌ
  text = text.replace(/‡([^\t\n\r ‡]+)Š/g, "$1ৌ");

  // Pre-base vowels: e-kar (‡), oi-kar (‰), i-kar (w)
  text = text.replace(/([‡‰w])([^\t\n\r ‡‰w&]+)/g, "$2$1");

  // Reph: consonant + © -> র্ + consonant
  text = text.replace(/([^\t\n\r ©]+)©/g, "র্$1");

  let out = "";
  let i = 0;
  while (i < text.length) {
    if (i + 1 < text.length) {
      const pair = text.substring(i, i + 2);
      if (ansiToUnicodeMap[pair]) {
        out += ansiToUnicodeMap[pair];
        i += 2;
        continue;
      }
    }
    const single = text[i];
    if (ansiToUnicodeMap[single]) {
      out += ansiToUnicodeMap[single];
    } else {
      out += single;
    }
    i++;
  }

  return out;
}

export function unicodeToAnsi(unicodeText: string): string {
  if (!unicodeText) return "";
  let text = unicodeText;

  for (const [ansi, uni] of ansiConjuncts) {
    text = text.replaceAll(uni, ansi);
  }

  // Reph
  text = text.replace(/র্([^\t\n\r ]+)/g, "$1©");

  // O-kar
  text = text.replace(/([^\t\n\r ]+)ো/g, "‡$1v");

  // Ou-kar
  text = text.replace(/([^\t\n\r ]+)ৌ/g, "‡$1Š");

  // Pre-base vowels
  text = text.replace(/([^\t\n\r ]+)ে/g, "‡$1");
  text = text.replace(/([^\t\n\r ]+)ৈ/g, "‰$1");
  text = text.replace(/([^\t\n\r ]+)ি/g, "w$1");

  const uniToAnsi: Record<string, string> = {};
  for (const [ansi, uni] of Object.entries(ansiToUnicodeMap)) {
    uniToAnsi[uni] = ansi;
  }

  let out = "";
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (uniToAnsi[ch]) {
      out += uniToAnsi[ch];
    } else {
      out += ch;
    }
    i++;
  }

  return out;
}

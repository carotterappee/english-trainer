export type WordItem = {
  en: string;
  fr: string;
  addedAt: string;
  knownCount: number;
  unknownCount: number;
};
const KEY = "myWords:v1";

export function loadWords(): WordItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveWords(arr: WordItem[]) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}
export function addWord(en: string, fr: string) {
  const words = loadWords();
  const i = words.findIndex(w => w.en.toLowerCase() === en.toLowerCase());
  if (i === -1) {
    words.push({ en, fr, addedAt: new Date().toISOString(), knownCount: 0, unknownCount: 0 });
    saveWords(words);
  }
}
export function markKnown(en: string) {
  const words = loadWords();
  const w = words.find(x => x.en.toLowerCase() === en.toLowerCase());
  if (w) { w.knownCount++; saveWords(words); }
}
export function markUnknown(en: string) {
  const words = loadWords();
  const w = words.find(x => x.en.toLowerCase() === en.toLowerCase());
  if (w) { w.unknownCount++; saveWords(words); }
}

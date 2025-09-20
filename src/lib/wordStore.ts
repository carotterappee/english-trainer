
// SRS minimal pour flashcards
const SRS_STEPS = [0, 1, 3, 7, 14, 30, 60]; // jours
type ReviewItem = WordItem & { due: string; step: number };

export function getDueWords(): ReviewItem[] {
  const words = loadWords();
  const now = new Date();
  return words
    .map(w => {
      // On stocke le step dans knownCount, la date de prochaine révision dans addedAt
      const step = Math.min(w.knownCount, SRS_STEPS.length - 1);
      const last = new Date(w.addedAt);
      const due = new Date(last);
      due.setDate(last.getDate() + SRS_STEPS[step]);
      return { ...w, due: due.toISOString(), step };
    })
    .filter(w => new Date(w.due) <= now)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
}

export function reviewWord(en: string, outcome: "again"|"good"|"easy") {
  const words = loadWords();
  const w = words.find(x => x.en.toLowerCase() === en.toLowerCase());
  if (!w) return;
  if (outcome === "again") {
    w.knownCount = 0;
    w.addedAt = new Date().toISOString();
  } else if (outcome === "good") {
    w.knownCount = Math.min(w.knownCount + 1, SRS_STEPS.length - 1);
    w.addedAt = new Date().toISOString();
  } else if (outcome === "easy") {
    w.knownCount = Math.min(w.knownCount + 2, SRS_STEPS.length - 1);
    w.addedAt = new Date().toISOString();
  }
  saveWords(words);
}
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

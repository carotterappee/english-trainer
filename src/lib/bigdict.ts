// Dictionnaire EN->FR chunké par 1ère lettre. Format de chaque chunk:
// { "word": ["trad1", "trad2", ...], ... }

export type DictEntry = string[];
type Chunk = Record<string, DictEntry>;

const cache = new Map<string, Chunk>(); // "a" -> chunk "a"
const loading = new Map<string, Promise<void>>();

function letterKey(w: string) {
  const c = w[0]?.toLowerCase();
  return c && c >= "a" && c <= "z" ? c : "_";
}

async function loadChunk(letter: string) {
  if (cache.has(letter)) return;
  if (loading.has(letter)) { await loading.get(letter); return; }
  const p = (async () => {
    const res = await fetch(`/dict/enfr-chunks/${letter}.json`);
    if (res.ok) {
      const json = (await res.json()) as Chunk;
      cache.set(letter, json);
    } else {
      cache.set(letter, {}); // éviter de re-fetch si absent
    }
  })();
  loading.set(letter, p);
  await p;
  loading.delete(letter);
}

export function normalizeEn(s: string) {
  return s.toLowerCase().replace(/[^a-z'-]/g, "");
}

// irréguliers courants (tu peux en ajouter)
const IRREGULAR: Record<string, string> = {
  went: "go", gone: "go",
  ate: "eat", eaten: "eat",
  better: "good", best: "good",
  worse: "bad", worst: "bad",
  did: "do", done: "do",
  had: "have", has: "have",
  made: "make", making: "make",
  bought: "buy", brought: "bring",
  took: "take", taken: "take",
  wrote: "write", written: "write",
  said: "say", saw: "see", seen: "see",
};

function lemmaCandidates(word: string): string[] {
  const w = normalizeEn(word);
  const out = new Set<string>([w]);
  if (IRREGULAR[w]) out.add(IRREGULAR[w]);

  // pluriels simples
  if (w.endsWith("ies")) out.add(w.slice(0, -3) + "y");
  if (w.endsWith("es")) out.add(w.slice(0, -2));
  if (w.endsWith("s") && w.length > 3) out.add(w.slice(0, -1));

  // verbes
  if (w.endsWith("ing")) {
    out.add(w.slice(0, -3));
    if (w.endsWith("ing") && w.length > 4) out.add(w.slice(0, -3) + "e"); // make -> making
  }
  if (w.endsWith("ed")) {
    out.add(w.slice(0, -2));
    if (w.length > 3) out.add(w.slice(0, -1)); // planned -> planne? (approx), kept simple
  }
  return Array.from(out);
}

export async function translateWord(word: string): Promise<DictEntry | null> {
  const cands = lemmaCandidates(word);
  // charge les chunks nécessaires
  const letters = Array.from(new Set(cands.map(letterKey)));
  await Promise.all(letters.map(loadChunk));

  // lookup dans l'ordre des candidats
  for (const cand of cands) {
    const ch = cache.get(letterKey(cand));
    const entry = ch?.[cand];
    if (entry && entry.length) return entry;
  }
  return null;
}

// optimisation: précharger les chunks utiles pour une phrase
export async function preloadForSentence(sentence: string) {
  const letters = Array.from(
    new Set(sentence.toLowerCase().match(/[a-z]/g) || [])
  );
  await Promise.all(letters.map(loadChunk));
}

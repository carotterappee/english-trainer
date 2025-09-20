// Traduction générique multilingue (offline EN→FR, sinon fallback+cache)
export async function translateWordGeneric(word: string, src: string, tgt: string): Promise<string[]> {
  // Offline dispo seulement pour en->fr; sinon fallback en ligne + cache par paire src>tgt
  const key = `${src}>${tgt}:${normalizeEn(word)}`;
  const fromCache = (() => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } })();
  if (fromCache) return fromCache;

  if (src === "en" && tgt === "fr") {
    const off = await translateWord(word);
    if (off) { localStorage.setItem(key, JSON.stringify(off)); return off; }
  }

  // fallback online (LibreTranslate → MyMemory)
  try {
    const r = await fetch("https://libretranslate.com/translate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: word, source: src, target: tgt, format: "text" })
    });
    if (r.ok) {
      const j = await r.json();
      const arr = [String(j?.translatedText || "").trim()].filter(Boolean);
      if (arr.length) { localStorage.setItem(key, JSON.stringify(arr)); return arr; }
    }
  } catch {}
  try {
    const r2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${src}|${tgt}`);
    if (r2.ok) {
      const j2 = await r2.json();
      const arr = [String(j2?.responseData?.translatedText || "").trim()].filter(Boolean);
      if (arr.length) { localStorage.setItem(key, JSON.stringify(arr)); return arr; }
    }
  } catch {}
  return ["(pas trouvé)"];
}
// Dictionnaire EN->FR chunké par 1ère lettre (public/dict/enfr-chunks/<letter>.json)
// → essaie OFFLINE (chunks + lemmes + variantes UK/US), sinon FALLBACK en ligne
export type DictEntry = string[];
type Chunk = Record<string, DictEntry>;

const cache = new Map<string, Chunk>(); // "a" -> chunk
const loading = new Map<string, Promise<void>>();
const MISS_CACHE_KEY = "dict:cache:v1"; // cache persistant des traductions trouvées en ligne

function letterKey(w: string) { const c = w[0]?.toLowerCase(); return c && c >= "a" && c <= "z" ? c : "_"; }
export function normalizeEn(s: string) { return s.toLowerCase().replace(/[^a-z'-]/g, ""); }

function getCache(): Record<string, DictEntry> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(MISS_CACHE_KEY) || "{}"); } catch { return {}; }
}
function setCache(db: Record<string, DictEntry>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MISS_CACHE_KEY, JSON.stringify(db));
}
function cacheGet(w: string): DictEntry | null {
  const db = getCache(); return db[normalizeEn(w)] ?? null;
}
function cacheSet(w: string, entry: DictEntry) {
  const db = getCache(); db[normalizeEn(w)] = entry; setCache(db);
}

async function loadChunk(letter: string) {
  if (cache.has(letter)) return;
  if (loading.has(letter)) { await loading.get(letter); return; }
  const p = (async () => {
    try {
      const res = await fetch(`/dict/enfr-chunks/${letter}.json`);
      cache.set(letter, res.ok ? ((await res.json()) as Chunk) : {});
    } catch { cache.set(letter, {}); }
  })();
  loading.set(letter, p); await p; loading.delete(letter);
}

// --- Lemmatisation simple + variantes UK/US ---
const IRREGULAR: Record<string, string> = {
  went: "go", gone: "go", ate: "eat", eaten: "eat", did: "do", done: "do",
  had: "have", has: "have", made: "make", making: "make", wrote: "write", written: "write",
  said: "say", saw: "see", seen: "see", bought: "buy", brought: "bring", took: "take", taken: "take",
};
const UK_US_PAIRS: Array<[RegExp, string]> = [
  [/colour/g, "color"], [/favourite/g, "favorite"], [/neighbour/g, "neighbor"],
  [/organise/g, "organize"], [/analyse/g, "analyze"], [/realise/g, "realize"],
  [/centre/g, "center"], [/theatre/g, "theater"], [/travelling/g, "traveling"], [/programme/g, "program"],
  [/summarise/g, "summarize"], [/defence/g, "defense"], [/licence/g, "license"],
];
function altSpellings(w: string): string[] {
  const out = new Set<string>([w]);
  for (const [re, to] of UK_US_PAIRS) if (re.test(w)) out.add(w.replace(re, to));
  // US→UK courtes
  if (w.endsWith("ize")) out.add(w.replace(/ize$/, "ise"));
  if (w.endsWith("or")) out.add(w.replace(/or$/, "our"));
  if (w.endsWith("er")) out.add(w.replace(/er$/, "re"));
  return Array.from(out);
}
function lemmaCandidates(word: string): string[] {
  const w = normalizeEn(word);
  const seeds = new Set<string>([w]);
  if (IRREGULAR[w]) seeds.add(IRREGULAR[w]);

  // pluriels & formes verbales
  if (w.endsWith("ies")) seeds.add(w.slice(0, -3) + "y");
  if (w.endsWith("es")) seeds.add(w.slice(0, -2));
  if (w.endsWith("s") && w.length > 3) seeds.add(w.slice(0, -1));
  if (w.endsWith("ing")) { seeds.add(w.slice(0, -3)); seeds.add(w.slice(0, -3) + "e"); }
  if (w.endsWith("ed")) { seeds.add(w.slice(0, -2)); seeds.add(w.slice(0, -1)); }

  // variantes UK/US
  const out = new Set<string>();
  for (const s of seeds) for (const a of altSpellings(s)) out.add(a);
  return Array.from(out);
}

// --- OFFLINE ---
async function translateWordOffline(word: string): Promise<DictEntry | null> {
  const cands = lemmaCandidates(word);
  await Promise.all(Array.from(new Set(cands.map(letterKey))).map(loadChunk));
  for (const cand of cands) {
    const ch = cache.get(letterKey(cand));
    const entry = ch?.[cand];
    if (entry && entry.length) return entry;
  }
  return null;
}

// --- FALLBACK ONLINE (cache → LibreTranslate → MyMemory) ---
function allowOnlineFallback(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("dict:fallbackOnline:v1") !== "0";
}

async function translateWordOnline(word: string): Promise<DictEntry | null> {
  if (!allowOnlineFallback()) return null;
  const w = normalizeEn(word);
  const hit = cacheGet(w);
  if (hit) return hit;

  // 1) LibreTranslate
  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: w, source: "en", target: "fr", format: "text" }),
    });
    if (res.ok) {
      const j = await res.json();
      const txt = j?.translatedText?.toString().trim();
      if (txt) { const arr = [txt]; cacheSet(w, arr); return arr; }
    }
  } catch {}

  // 2) MyMemory (secours)
  try {
    const res2 = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(w)}&langpair=en|fr`);
    if (res2.ok) {
      const j2 = await res2.json();
      const txt = j2?.responseData?.translatedText?.toString().trim();
      if (txt) { const arr = [txt]; cacheSet(w, arr); return arr; }
    }
  } catch {}

  return null;
}

// --- API publique ---
export async function translateWord(word: string): Promise<DictEntry | null> {
  const off = await translateWordOffline(word);
  if (off) return off;
  const on = await translateWordOnline(word);
  return on;
}

// optimisation: précharger les chunks utiles pour une phrase
export async function preloadForSentence(sentence: string) {
  const letters = Array.from(new Set(sentence.toLowerCase().match(/[a-z]/g) || []));
  await Promise.all(letters.map(loadChunk));
}

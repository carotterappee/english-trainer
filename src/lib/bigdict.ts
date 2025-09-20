import { isTranslatableToken } from "@/lib/textUtils";
// Traduction générique multilingue (offline EN→FR, sinon fallback+cache)

// Dictionnaire EN↔FR soigné + petites règles (contractions, pluriels, -ing/-ed)
// AUCUN appel API. On retourne 1–3 sens courants, propres.

const EN_FR: Record<string, string[]> = {
  // pronoms / basiques
  "you": ["tu", "vous"],
  "your": ["ton/ta/tes", "votre/vos"],
  "yours": ["le tien/la tienne/les tiens", "le vôtre/la vôtre/les vôtres"],
  "i": ["je"], "me": ["moi"], "my": ["mon/ma/mes"], "we": ["nous"], "our": ["notre/nos"],
  "they": ["ils/elles"], "their": ["leur/leurs"], "he": ["il"], "she": ["elle"], "it": ["il/elle (objet)"],
  "this": ["ce/cet/cette"], "that": ["ce/cet/cette (là)"], "these": ["ces"], "those": ["ces (là-bas)"],

  // contractions
  "it's": ["c’est"],
  "that's": ["c’est", "cela"],
  "there's": ["il y a"],
  "let's": ["on …", "allons …", "faisons …"],
  "i'm": ["je suis"], "you're": ["tu es", "vous êtes"], "we're": ["nous sommes"], "they're": ["ils/elles sont"],
  "i've": ["j’ai"], "you've": ["tu as", "vous avez"], "we've": ["nous avons"],
  "i'd": ["je voudrais", "je ferais"], "you'd": ["tu voudrais", "vous feriez"],
  "i'll": ["je vais", "je ferai"], "you'll": ["tu vas", "vous ferez"],

  // mots polysémiques (sens les + courants en premier)
  "way": ["façon", "manière", "chemin"],
  "break": ["pause", "casser", "rupture"],
  "get": ["obtenir", "recevoir", "devenir"],
  "take": ["prendre"],
  "make": ["faire", "fabriquer"],
  "do": ["faire"],
  "go": ["aller"],
  "come": ["venir"],
  "need": ["avoir besoin de"],
  "want": ["vouloir"],
  "know": ["savoir", "connaître"],
  "work": ["travail", "travailler"],
  "time": ["temps", "heure (horaire)"],
  "thing": ["chose", "truc"],
  "people": ["gens"],
  "home": ["maison", "chez moi"],
  "park": ["parc"],
  "coffee": ["café"],
  "ticket": ["billet", "ticket"],
  "museum": ["musée"],

  // formules usuelles
  "hello": ["bonjour"], "hi": ["salut"],
  "thanks": ["merci"], "thank you": ["merci"],
  "sorry": ["désolé(e)"],
  "please": ["s’il te plaît", "s’il vous plaît"],
  "bye": ["au revoir"],

  // jours / fréquence
  "usually": ["d’habitude"], "often": ["souvent"], "sometimes": ["parfois"], "always": ["toujours"],
};

const FR_EN: Record<string, string[]> = {
  "tu": ["you (informel)"], "vous": ["you (politesse)"],
  "ton": ["your"], "ta": ["your"], "tes": ["your"],
  "votre": ["your"], "vos": ["your"],
  "bonjour": ["hello"], "salut": ["hi"],
  "merci": ["thanks", "thank you"], "désolé": ["sorry"], "désolée": ["sorry"],
  "s’il te plaît": ["please"], "s’il vous plaît": ["please"],
  "pause": ["break"], "casser": ["break"], "façon": ["way"], "manière": ["way"], "chemin": ["way", "path", "route"],
  "maison": ["home"], "parc": ["park"], "musée": ["museum"], "billet": ["ticket"], "ticket": ["ticket"],
  "gens": ["people"], "truc": ["thing"], "chose": ["thing"],
  "temps": ["time"], "heure": ["hour", "time (schedule)"],
  "souvent": ["often"], "parfois": ["sometimes"], "toujours": ["always"], "d’habitude": ["usually"],
  "c’est": ["it’s", "that’s"], "il y a": ["there is", "there are"],
};

// contractions usuelles → on normalise (pour cliquer "It’s" ou "Let’s")
const CONTRA_EQUIV: Record<string, string> = {
  "it’s": "it's", "let’s": "let's", "c’est": "c'est" // (au cas où)
};

// Lemmas très simples (→ base verbale / singulier)
function lemmaEn(word: string) {
  let w = word.toLowerCase();
  if (CONTRA_EQUIV[w]) w = CONTRA_EQUIV[w];
  if (EN_FR[w]) return w;

  // pluriel simple
  if (w.endsWith("s") && EN_FR[w.slice(0, -1)]) return w.slice(0, -1);

  // -ing / -ed
  if (w.endsWith("ing") && EN_FR[w.slice(0, -3)]) return w.slice(0, -3);      // taking -> take
  if (w.endsWith("ed")  && EN_FR[w.slice(0, -2)]) return w.slice(0, -2);      // worked -> work

  // irréguliers courants
  if (w === "broke" || w === "broken") return "break";
  if (w === "went") return "go";
  if (w === "came") return "come";
  if (w === "made") return "make";
  if (w === "did") return "do";
  if (w === "got") return "get";
  if (w === "took") return "take";
  if (w === "knew") return "know";
  return w;
}
function lemmaFr(word: string) {
  let w = word.toLowerCase();
  // normaliser apostrophe typographique
  w = w.replace(/’/g, "'");
  if (FR_EN[w]) return w;

  // élisions
  if (w.startsWith("l'") || w.startsWith("l’")) return w.slice(2);
  if (w.startsWith("c'") || w.startsWith("c’")) return "c’est";

  // singulier approximatif
  if (w.endsWith("es") && FR_EN[w.slice(0, -2)]) return w.slice(0, -2);
  if (w.endsWith("s")  && FR_EN[w.slice(0, -1)]) return w.slice(0, -1);
  return w;
}

function topMeanings(arr?: string[] | null, n = 3): string[] | null {
  if (!arr || arr.length === 0) return null;
  const uniq = Array.from(new Set(arr));
  return uniq.slice(0, n);
}

/** Traduction locale propre, SANS API.
 * src: "en" | "fr" ; tgt: "fr" | "en"
 */
export async function translateWordGeneric(token: string, src: "en" | "fr", tgt: "fr" | "en"): Promise<string[] | null> {
  if (!token) return null;

  if (src === "en" && tgt === "fr") {
    const base = lemmaEn(token);
    // cas spéciaux PRIORITAIRES
    if (base === "you")  return ["tu", "vous"];
    if (base === "your") return ["ton/ta/tes", "votre/vos"];
    if (base === "it's") return ["c’est"];
    if (base === "let's") return ["on …", "allons …", "faisons …"];

    // dico direct
    const hit = EN_FR[base];
    if (hit) return topMeanings(hit);

    // fallback léger: forme sans 's' ni -ing/-ed déjà gérés, sinon rien
    return null;
  }

  if (src === "fr" && tgt === "en") {
    const base = lemmaFr(token);
    const hit = FR_EN[base];
    if (hit) return topMeanings(hit);
    return null;
  }

  return null;
}
// (tout le code fallback en ligne supprimé, tout est offline)
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

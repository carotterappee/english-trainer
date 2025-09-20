// Dictionnaire FR→RU enrichi (définitions + notes)
const FR_RU: Record<string, { defs: string[]; note?: string }> = {
  "on": { defs: ["мы"], note: "pronom indéfini, souvent ‘nous’ en français familier" },
  "se": { defs: ["ся", "себя"], note: "particule/префикс возвратности" },
  "retrouve": { defs: ["встречаемся"], note: "1ᵖˡ : on se retrouve → ‘мы встречаемся’" },
  "au": { defs: ["в", "к"], note: "selon le nom : au supermarché → в супермаркет" },
  "supermarché": { defs: ["супермаркет"] },
  "après": { defs: ["после"] },
  "le": { defs: [], note: "определённый артикль (— в русском не переводится)" },
  "travail": { defs: ["работа"] },
  "n’oublie": { defs: ["не забудь"], note: "императив от oublier" },
  "pas": { defs: [], note: "частица отрицания не (в паре с ne … pas)" },
  "titre": { defs: ["заголовок", "название"] },
  "je": { defs: ["я"] },
  "cherche": { defs: ["ищу"] },
  "une": { defs: [], note: "неопределённый артикль (— в русском не переводится)" },
  "auberge": { defs: ["хостел", "недорогая гостиница"] },
  "pas chère": { defs: ["недорогая"], note: "букв. ‘не дорогая’" },
  "travaille": { defs: ["работаю"] },
  "à": { defs: ["в", "у", "к"], note: "préposition à → в / у / к (⚠ accent grave distingue à (préposition) de a (= ‘a’ du verbe avoir))" },
  "la": { defs: [], note: "определённый артикль ж.р. (—)" },
  "maison": { defs: ["дом", "дома"], note: "в выражении à la maison → дома" },
  "vendredi": { defs: ["пятница"], note: "в пятницу → в пятницу" },
  "écrit": { defs: ["напиши"], note: "(mieux Écris impératif) → напиши (от écrire)" },
  "un": { defs: [], note: "неопределённый артикль (—)" },
  "court": { defs: ["короткий"] },
  "email": { defs: ["электронное письмо", "имейл"] },
  "à (dans à ton professeur)": { defs: ["к"] },
  "ton": { defs: ["твой", "твоя", "твоё", "твоему"], note: "зависит от падежа; ici: к твоему" },
  "professeur": { defs: ["преподаватель", "учитель"] },
};
// Traduction générique multilingue (offline EN→FR, sinon fallback+cache)

// Dictionnaire EN↔FR soigné + expressions + notes (aucun fetch externe).
export type DictResult = {
  defs: string[];                // sens principaux (max ~3)
  note?: string;                 // explication grammaticale / usage
  variants?: string[];           // variantes UK/US utiles
  phrase?: { text: string; defs: string[]; note?: string }; // si une expression est détectée dans la phrase
};

const EN_FR: Record<string, string[]> = {
  // basiques / déterminants / gram.
  "a": ["un/une"], "the": ["le/la/les"], "of": ["de"], "for": ["pour"], "and": ["et"],
  "on": ["sur", "(jour/date) —"], "in": ["dans", "en"], "to": ["à"], "with": ["avec"],

  // pronoms
  "you": ["tu", "vous"], "your": ["ton/ta/tes", "votre/vos"],
  "it": ["ça", "il/elle (chose)"], "that's": ["c’est"], "it's": ["c’est"],

  // modaux / auxiliaires
  "can": ["pouvoir"], "have": ["avoir"], "is": ["est"],

  // fréquence / adjectifs fréquents
  "quick": ["rapide"], "short": ["court"], "nearby": ["à proximité", "près d’ici"], "any": ["des", "le moindre"],

  // nom/verbes que tu as cités
  "summary": ["résumé", "synthèse"], "risks": ["risques"], "risk": ["risque"],
  "turnaround": ["délai de traitement", "temps d’exécution"],
  "scope": ["périmètre"], "sprint": ["sprint (Agile)"],
  "some": ["du/de la/des"], "bread": ["pain"],
  "worry": ["s’inquiéter"], "happens": ["ça arrive"], "happen": ["se produire", "arriver"],
  "recommendations": ["recommandations", "suggestions"], "recommendation": ["recommandation", "suggestion"],
  "how": ["comment"], "long": ["long", "longue durée"],
  "taxi": ["taxi"], "airport": ["aéroport"],
  "seat": ["siège", "place"], "taken": ["pris/pris(e)"], // note contextuelle plus bas
  "like": ["aimer", "plaire à"], "check": ["vérifier"], "please": ["s’il te plaît", "s’il vous plaît"],
  "spelling": ["orthographe"], "before": ["avant"], "submitting": ["envoyer", "soumettre"],
  "state": ["énoncer", "indiquer"], "opinion": ["opinion", "avis"], "justify": ["justifier"],
  "write": ["écrire"], "email": ["e-mail", "courriel"], "teacher": ["professeur", "enseignant"],

  // voyages / quotidiens déjà dans tes packs (on complète quelques clés simples)
  "taxiway": ["voie de circulation (aéroport)"], // pour éviter collision sur 'taxi' + 'way'
};

const FR_EN: Record<string, string[]> = {
  // (utile si tu fais FR→EN)
  "bonjour": ["hello"], "salut": ["hi"],
  "pause": ["break"], "façon": ["way"], "manière": ["way"], "chemin": ["way", "path"],
  "ticket": ["ticket"], "billet": ["ticket"], "musée": ["museum"], "parc": ["park"], "maison": ["home"],
  "orthographe": ["spelling"], "avis": ["opinion"], "opinion": ["opinion"],
};

// Expressions multi-mots fréquentes qu’on veut reconnaître dans la phrase complète
const PHRASES_EN_FR: Array<{ rx: RegExp; text: string; defs: string[]; note?: string }> = [
  { rx: /\bcheck[- ]?in\b/i, text: "check in", defs: ["s’enregistrer (hôtel/aéroport)"], note: "verbe à particule : ‘check in’ ≠ ‘check’ + ‘in’ séparés" },
  { rx: /\bout of scope\b/i, text: "out of scope", defs: ["hors périmètre (du sprint/projet)"] },
  { rx: /\bturnaround (time)?\b/i, text: "turnaround (time)", defs: ["délai de traitement", "temps d’exécution"] },
  { rx: /\bhow long\b/i, text: "how long", defs: ["combien de temps"] },
  { rx: /\bdon'?t worry\b/i, text: "don’t worry", defs: ["ne t’inquiète pas", "t’inquiète"], note: "forme négative : don’t = do not" },
  { rx: /\bis this (seat|place) taken\b/i, text: "is this seat taken?", defs: ["cette place est-elle prise ?"], note: "voix passive : ‘is + taken’ = ‘est prise’" },
];

const VARIANTS: Record<string, string[]> = {
  "fries": ["(US) fries = frites", "(UK) chips = frites"],
  "chips": ["(UK) chips = frites", "(US) chips = ‘crisps’ (UK) = chips (de pomme de terre)"],
  "crisps": ["(UK) crisps = chips (US) = ‘chips’ en français"],
  "elevator": ["(US) elevator / (UK) lift"], "lift": ["(UK) lift / (US) elevator"],
  "apartment": ["(US) apartment / (UK) flat"], "flat": ["(UK) flat / (US) apartment"],
};

const CONTRA_EQUIV: Record<string, string> = { "it’s": "it's", "that’s": "that's", "let’s": "let's" };

function lemmaEn(word: string) {
  let w = word.toLowerCase();
  if (CONTRA_EQUIV[w]) w = CONTRA_EQUIV[w];
  if (EN_FR[w]) return w;
  if (w.endsWith("s") && EN_FR[w.slice(0, -1)]) return w.slice(0, -1);
  if (w.endsWith("ing") && EN_FR[w.slice(0, -3)]) return w.slice(0, -3);
  if (w.endsWith("ed") && EN_FR[w.slice(0, -2)]) return w.slice(0, -2);
  // irréguliers fréquents
  const irr: Record<string, string> = { broke: "break", broken: "break", went: "go", came: "come", made: "make", did: "do", got: "get", took: "take", knew: "know" };
  return irr[w] || w;
}

function lemmaFr(word: string) {
  let w = word.toLowerCase().replace(/’/g, "'");
  if (FR_EN[w]) return w;
  if (w.startsWith("l'")) return w.slice(2);
  if (w.startsWith("c'")) return "c’est";
  if (w.endsWith("es") && FR_EN[w.slice(0, -2)]) return w.slice(0, -2);
  if (w.endsWith("s") && FR_EN[w.slice(0, -1)]) return w.slice(0, -1);
  return w;
}

function uniqTop(arr?: string[], n = 3) { return arr ? Array.from(new Set(arr)).slice(0, n) : undefined; }

/** Traduction locale propre, avec détection d’expression et note grammaticale. 
 *  Passe la phrase source dans `ctxSentence` quand tu peux pour meilleures notes.
 */
export async function translateWordGeneric(
  token: string,
  src: "en" | "fr",
  tgt: "fr" | "en" | "ru",
  opts?: { ctxSentence?: string }
): Promise<DictResult | null> {
  if (!token) return null;

  // ——— EN -> FR ———
  if (src === "en" && tgt === "fr") {
    const base = lemmaEn(token);
    const res: DictResult = { defs: [] };

    // expressions repérées dans la phrase complète
    if (opts?.ctxSentence) {
      const s = opts.ctxSentence.toLowerCase();
      const hit = PHRASES_EN_FR.find(p => p.rx.test(s));
      if (hit) res.phrase = { text: hit.text, defs: hit.defs, note: hit.note };
    }

    // cas pédagogiques
    if (base === "i'd") {
      // si “i’d like …” → “je voudrais …”
      if (opts?.ctxSentence?.toLowerCase().includes("i'd like")) {
        res.defs = ["je voudrais"];
        res.note = "I’d = I would (souhait poli). ‘I’d like’ = ‘je voudrais’.";
        return res;
      }
      res.defs = ["je voudrais", "j’aurais / j’avais"];
      res.note = "I’d = I would / I had (selon le contexte).";
      return res;
    }
    if (base === "i'll") { res.defs = ["je vais", "je ferai"]; res.note = "I’ll = I will."; return res; }
    if (base === "don't") { res.defs = ["ne … pas"]; res.note = "don’t = do not (négation)."; return res; }

    if (base === "taken") {
      res.defs = ["pris(e)"];
      res.note = "‘taken’ = participe passé de ‘take’. Ex: ‘Is this seat taken?’ → ‘Cette place est-elle prise ?’ (voix passive).";
      return res;
    }

    // dico simple
    const main = EN_FR[base];
    if (main) res.defs = uniqTop(main) ?? [];

    // variantes UK/US
    const v = VARIANTS[base];
    if (v) res.variants = v;

    // petites préférences de sens
    if (base === "break") res.defs = ["pause", "casser", "rupture"];
    if (base === "way") res.defs = ["façon", "manière", "chemin"];

    // contractions triviales
    if (base === "that's") res.note = "That’s = that is → ‘c’est’.";
    if (base === "it's")  res.note = "It’s = it is → ‘c’est’.";

    return res.defs.length || res.phrase ? res : null;
  }

  // ——— FR -> EN ———
  if (src === "fr" && tgt === "en") {
    const base = lemmaFr(token);
    const defs = FR_EN[base];
    return defs ? { defs: uniqTop(defs) ?? [] } : null;
  }

  // ——— FR -> RU ———
  if (src === "fr" && tgt === "ru") {
    const base = token.toLowerCase();
    const entry = FR_RU[base];
    if (entry) return { defs: entry.defs, note: entry.note };
    return null;
  }

  // fallback explicite
  return null;
}
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

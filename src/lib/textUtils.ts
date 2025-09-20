// --- normalisation unicode générique (pour le russe, etc.) ---
export function normalizeAny(s: string) {
  return s.toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{Letter}\p{Number}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateAnswerGeneric(expected: string, user: string, tolerance = 0.2) {
  const e = normalizeAny(expected);
  const u = normalizeAny(user);
  if (!e || !u) return { ok: false, score: 0, notes: [] as string[] };
  const d = levenshtein(e, u);
  const thr = Math.max(1, Math.floor(e.length * tolerance));
  const ok = d <= thr;
  return { ok, score: ok ? 1 : Math.max(0, 1 - d / Math.max(1, e.length)), notes: [] as string[] };
}
// --- normalisation & tokenisation ---
export function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export function normalizeFr(s: string) {
  return stripAccents(s.toLowerCase())
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function splitWordsFr(s: string) {
  return normalizeFr(s).split(" ").filter(Boolean);
}

// --- Levenshtein pour "petites fautes" ---
export function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     // suppr
        dp[i][j - 1] + 1,     // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

// --- appariement "souple" mot à mot ---
type Issue = "missing_final_s" | "accent" | "minor_typo";

export function nearMatch(exp: string, got: string): { ok: boolean; issue?: Issue } {
  const e = normalizeFr(exp);
  const g = normalizeFr(got);
  if (e === g) return { ok: true };

  // cas: accent différent mais même sans accents
  if (stripAccents(exp.toLowerCase()) === stripAccents(got.toLowerCase()) && exp !== got) {
    return { ok: true, issue: "accent" };
  }
  // cas: oubli d'un -s final (ex: "prends" vs "prend")
  if (e.endsWith("s") && e.slice(0, -1) === g) {
    return { ok: true, issue: "missing_final_s" };
  }
  // petite faute (distance faible)
  const d = levenshtein(e, g);
  const threshold = Math.max(1, Math.floor(e.length * 0.2)); // tolérance ~20%
  if (d <= threshold) return { ok: true, issue: "minor_typo" };

  return { ok: false };
}

// --- évalue toute la phrase (tolère adjectifs en plus) ---
export function evaluateFrenchAnswer(expected: string, user: string) {
  const exp = splitWordsFr(expected);
  const ans = splitWordsFr(user);
  let matched = 0;
  const used = new Set<number>();
  const notes: string[] = [];

  for (const ew of exp) {
    // trouve le 1er mot de la réponse qui "matche presque"
    let found = false;
    for (let j = 0; j < ans.length; j++) {
      if (used.has(j)) continue;
      const test = nearMatch(ew, ans[j]);
      if (test.ok) {
        used.add(j);
        matched++;
        if (test.issue === "missing_final_s") notes.push(`Attention : “${ans[j]}” → il manque un “s”.`);
        if (test.issue === "accent") notes.push(`Accent : “${ans[j]}” (accents à vérifier).`);
        if (test.issue === "minor_typo") notes.push(`Petite faute sur “${ans[j]}”.`);
        found = true;
        break;
      }
    }
    // si non trouvé, on laisse passer certains mots-outils (le, la, les, de, du, des, un, une)
    if (!found && ["le","la","les","de","du","des","un","une","au","aux","à","et"].includes(ew)) {
      matched++; // on ne pénalise pas
    }
  }

  const score = matched / Math.max(1, exp.length);
  const ok = score >= 0.85; // valide si ≥85% des mots attendus retrouvés
  return { ok, score, notes };
}
export function softEquals(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}
// Normalise un texte (minuscules, sans accents, espaces propres)
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")     // enlève les accents (compatible Node/Vercel)
    .replace(/[^a-z0-9\s']/g, " ")       // garde lettres/chiffres/espaces/apostrophes
    .replace(/\s+/g, " ")
    .trim();
}

// Retourne true si au moins un mot-clé est présent (après normalisation)
export function includesAny(haystack: string, needles: string[]): boolean {
  const h = normalize(haystack);
  return needles.some((n) => h.includes(normalize(n)));
}

// Score 0..1 basé sur la présence de mots-clés
export function keywordScore(answer: string, keywords: string[]): number {
  const h = normalize(answer);
  const hits = keywords.filter((k) => h.includes(normalize(k))).length;
  return hits / Math.max(1, keywords.length);
}

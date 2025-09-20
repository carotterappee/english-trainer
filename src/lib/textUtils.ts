// ...existing code...
// doublon supprimé

// doublon supprimé

/** Suggestions FR simples (pluriel -s, accord -e, élision) */
export function frenchHints(expected: string, user: string): string[] {
  const e = expected.toLowerCase();
  const u = user.toLowerCase();
  const hints: string[] = [];

  if (e.includes("les ") || e.includes("des ") || e.match(/\b(nous|vous|ils|elles)\b/)) {
    // manque possible du 's' pluriel
    if (normalizeAnswer(e) !== normalizeAnswer(u) && /[a-z]s\b/.test(e) && !/[a-z]s\b/.test(u)) {
      hints.push("Pluriel : il manque peut-être un « s ».");
    }
  }
  if (e.match(/\b(la|une)\b/) && !u.match(/\b(la|une)\b/) && u.match(/\b(l'|l’)/)) {
    hints.push("Élision : “l’ ” au bon endroit.");
  }
  if (e.match(/\b(je suis|elle est)\b/) && u.match(/\b(je suis|elle est)\b/)) {
    if (e.includes("e ") && !u.includes("e ")) hints.push("Accord : ajoute “-e” si nécessaire (féminin).");
  }
  return hints;
}

// Outils de texte : comparaison tolérante & filtrage pour la traduction

/** Types d’erreurs de nearMatch */
export type Issue = "accent" | "missing_final_s" | "minor_typo";

/** Normalise une réponse pour comparaison : 
 * - minuscules, accents retirés
 * - transforme les tirets cadratins/en-dash en tirets simples
 * - remplace tirets/virgules/points/;:!? par espace
 * - espace unique
 */
export function normalizeAnswer(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}+/gu, "")
    .replace(/[—–]/g, "-")
    .replace(/[-.,;:!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function answersEqual(a: string, b: string) {
  return normalizeAnswer(a) === normalizeAnswer(b);
}

/** Vrai si c’est un “mot” traduisible (contient au moins une lettre) */
export function isTranslatableToken(tok: string) {
  return /[\p{Letter}]/u.test(tok || "");
}

/** Pour l’affichage, on remplace les vrais cadratins par une virgule douce */
export function displayFriendly(s: string) {
  return (s || "").replace(/[—–]/g, ", ");
}


// Normalisation pour le français (minuscules, accents retirés, espaces propres)
function normalizeFr(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[-.,;:!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripAccents(s: string): string {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Distance de Levenshtein simple
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function splitWordsFr(s: string): string[] {
  return (s || "").toLowerCase().split(/[^\p{Letter}’']+/u).filter(Boolean);
}

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

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

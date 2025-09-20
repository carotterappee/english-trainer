import enEveryday from "./packs/en_everyday";
import enTravel   from "./packs/en_travel";
import enWork     from "./packs/en_work";
import enExams    from "./packs/en_exams";

export type Pair = { en: string; fr: string };

export function getSentences(goal: "everyday"|"travel"|"work"|"exams"): Pair[] {
  // ton ancien stock de base…
  const base: Pair[] = [
    // ... (garde ce que tu avais)
  ];
  const extra: Record<string, Pair[]> = {
    everyday: enEveryday,
    travel: enTravel,
    work: enWork,
    exams: enExams,
  };
  // merge + dédoublonnage (par texte EN)
  const all = [...base, ...(extra[goal] || [])];
  const seen = new Set<string>();
  return all.filter(p => {
    const k = p.en.trim().toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
}

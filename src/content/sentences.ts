import type { Goal } from "@/lib/profile";

// EN → FR
import enEveryday from "./packs/en_everyday";
import enTravel   from "./packs/en_travel";
import enWork     from "./packs/en_work";
import enExams    from "./packs/en_exams";
export type EnPair = { en: string; fr: string };

const EN_BY_CAT: Record<Goal, EnPair[]> = {
  everyday: enEveryday,
  travel:   enTravel,
  work:     enWork,
  exams:    enExams,
  boost: [],
};

export function getSentencesEN(cats: Goal[]): EnPair[] {
  const seen = new Set<string>();
  const out: EnPair[] = [];
  for (const c of cats) {
    for (const p of (EN_BY_CAT[c] || [])) {
      const k = p.en.trim().toLowerCase();
      if (!seen.has(k)) { seen.add(k); out.push(p); }
    }
  }
  return out;
}

// FR → RU
import frEveryday from "./packs/fr_daily";
import frExams    from "./packs/fr_exams";
export type FrItem = { fr: string; ru?: string; alts?: string[] };

const FR_BY_CAT: Partial<Record<Goal, FrItem[]>> = {
  everyday: frEveryday,
  exams:    frExams,
  // (travel/work FR si tu les ajoutes plus tard)
};

export function getSentencesFR(cats: Goal[]): FrItem[] {
  const seen = new Set<string>();
  const out: FrItem[] = [];
  for (const c of cats) {
    for (const p of (FR_BY_CAT[c] || [])) {
      const k = p.fr.trim().toLowerCase();
      if (!seen.has(k)) { seen.add(k); out.push(p); }
    }
  }
  return out;
}

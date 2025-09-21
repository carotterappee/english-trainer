import { setRating } from "@/lib/level";

export type Placement = {
  date: string;              // ISO
  course: "en" | "fr";
  key: string;               // catsKey, ex: "boost" ou "boost+everyday"
  score: number;             // 0..100
  correctFirst: number;
  correctTotal: number;
  medianSec: number;
  cefr: "A1"|"A2"|"B1"|"B2"|"C1"|"C2";
  level: number;             // 1..10 recommandé
};

const K = (course: string, key: string) => `boost:placement:v1:${course}:${key}`;

export function getPlacement(course: "en"|"fr", key: string): Placement | null {
  try { return JSON.parse(localStorage.getItem(K(course,key)) || "null"); } catch { return null; }
}
export function savePlacement(p: Placement) {
  localStorage.setItem(K(p.course, p.key), JSON.stringify(p));
  // seed niveau moteur sur cette clé
  setRating(p.course, p.key, p.score);
}

export function needsPlacement(course: "en"|"fr", key: string) {
  const p = getPlacement(course, key);
  if (!p) return true;
  // re-test optionnel après 60 jours
  const days = (Date.now() - new Date(p.date).getTime()) / 86400000;
  return days > 60;
}

// calcule le placement à partir des stats brutes du test
export function computePlacement(course: "en"|"fr", key: string, stats: {
  firstTry: number; // nb bons du 1er coup
  totalGood: number;
  totalItems: number;
  times: number[]; // en secondes par item
}) : Placement {
  const median = [...stats.times].sort((a,b)=>a-b)[Math.floor(stats.times.length/2)] || 0;
  // scoring: poids fort au 1er coup, petit bonus vitesse
  const base = stats.firstTry * 8 + (stats.totalGood - stats.firstTry) * 4; // max ~ (12*8)=96
  const speedBonus = median <= 10 ? 4 : median <= 14 ? 2 : 0;
  const score = Math.min(100, Math.max(0, Math.round(base + speedBonus)));

  const cefr =
    score >= 91 ? "C2" :
    score >= 76 ? "C1" :
    score >= 60 ? "B2" :
    score >= 40 ? "B1" :
    score >= 20 ? "A2" : "A1";

  const level = Math.min(10, Math.max(1, Math.round(score / 10)));

  return {
    date: new Date().toISOString(),
    course, key,
    score, correctFirst: stats.firstTry, correctTotal: stats.totalGood,
    medianSec: Math.round(median),
    cefr, level
  };
}

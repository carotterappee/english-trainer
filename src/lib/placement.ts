export type Placement = {
  course: "en"|"fr";
  score: number;                           // 0..100
  cefr: "A1"|"A2"|"B1"|"B2"|"C1"|"C2";
  date: string;                            // ISO
};

const K = (course: string) => `placement:v1:${course}`;

export function getPlacement(course: "en"|"fr"): Placement | null {
  try { return JSON.parse(localStorage.getItem(K(course)) || "null"); }
  catch { return null; }
}

export function savePlacement(p: Placement) {
  localStorage.setItem(K(p.course), JSON.stringify(p));
}

export function needsPlacement(course: "en"|"fr") {
  return !getPlacement(course);
}

// map score → CEFR
export function scoreToCEFR(score: number): Placement["cefr"] {
  return score >= 91 ? "C2" :
         score >= 76 ? "C1" :
         score >= 60 ? "B2" :
         score >= 40 ? "B1" :
         score >= 20 ? "A2" : "A1";
}

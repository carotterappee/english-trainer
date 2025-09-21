// Niveau adaptatif naturel (1..10) par couple (course, goal)

import type { UserProfile } from "@/lib/profile";

export type LevelState = {
  rating: number;     // 0..100 interne (lissé)
  level: number;      // 1..10 affiché
  streak: number;     // série de "1er coup"
  recent: number[];   // derniers 12 résultats (1 bon / 0 faux)
  lastActive: string; // ISO
};

const KEY = (course: string, goal: string) => `lvl:v2:${course}:${goal}`;

function clamp(n: number, a: number, b: number) { return Math.min(b, Math.max(a, n)); }
function toLevel(r: number) { return clamp(Math.round(r / 10), 1, 10); }

export function loadLevel(course: string, goal: string): LevelState {
  if (typeof window === "undefined") return { rating: 15, level: 2, streak: 0, recent: [], lastActive: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(KEY(course, goal));
    if (!raw) return { rating: 15, level: 2, streak: 0, recent: [], lastActive: new Date().toISOString() };
    const s = JSON.parse(raw) as LevelState;
    // petit “decay” si inactif (naturel)
    const days = Math.floor((Date.now() - new Date(s.lastActive).getTime()) / 86400000);
    if (days >= 2) {
      s.rating = clamp(s.rating - Math.min(10, days * 2), 0, 100);
      s.level = toLevel(s.rating);
    }
    return s;
  } catch {
    return { rating: 15, level: 2, streak: 0, recent: [], lastActive: new Date().toISOString() };
  }
}
export function saveLevel(course: string, goal: string, st: LevelState) {
  localStorage.setItem(KEY(course, goal), JSON.stringify(st));
}

/** Appelle après chaque vérification */
export function recordAnswer(
  profile: UserProfile,
  opt: { ok: boolean; tries: number }
): LevelState {
  const course = profile.course ?? "en";
  const goal = profile.goal ?? "everyday";
  const st = loadLevel(course, goal);

  // met à jour la fenêtre glissante
  st.recent = [...st.recent, opt.ok ? 1 : 0].slice(-12);

  // série "1er coup"
  if (opt.ok && opt.tries === 1) st.streak += 1;
  if (!opt.ok) st.streak = 0;

  // score récent (moyenne glissante)
  const ratio = st.recent.length ? st.recent.reduce((a, b) => a + b, 0) / st.recent.length : 0;

  // delta principal (pondère les 1ers coups et les erreurs répétées)
  let delta = 0;
  if (opt.ok) {
    delta = opt.tries === 1 ? +10 : opt.tries === 2 ? +6 : +3;
    if (st.streak >= 3) delta += 4; // petit boost après 3 premiers coups d'affilée
  } else {
    delta = -8;
    const last4 = st.recent.slice(-4).filter(x => x === 0).length;
    if (last4 >= 3) delta -= 4; // on rame : baisse douce
  }

  // lissage EMA pour éviter l’effet “yo-yo”
  const target = ratio * 100;
  const ema = st.rating * 0.85 + target * 0.15;
  st.rating = clamp(ema + delta, 0, 100);
  st.level  = toLevel(st.rating);
  st.lastActive = new Date().toISOString();

  saveLevel(course, goal, st);
  return st;
}

/** plage de mots cible selon le niveau (proxy de difficulté) */
export function targetWordRange(level: number) {
  const t = [
    [3, 6],[5, 8],[6, 9],[7,10],[8,12],
    [9,13],[10,14],[11,16],[12,18],[13,20],
  ] as const;
  const [min, max] = t[clamp(Math.round(level),1,10)-1];
  return { min, max };
}
/** compte approximatif des mots (EN/FR) */
export function wordCount(s: string) {
  const m = (s || "").match(/[p{Letter}’']+/gu);
  return m ? m.length : 0;
}
export function setRating(course: string, goal: string, rating: number) {
  const st = loadLevel(course, goal);
  st.rating = Math.max(0, Math.min(100, Math.round(rating)));
  st.level = Math.min(10, Math.max(1, Math.round(st.rating / 10)));
  st.lastActive = new Date().toISOString();
  saveLevel(course, goal, st);
  return st;
}

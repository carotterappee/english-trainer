import type { Goal } from "@/lib/profile";

export type ProgressEntry = {
  date: string;            // "YYYY-MM-DD" (jour)
  startedAt: string;       // ISO
  durationSec: number;
  attempts: number;
  correct: number;
  coins: number;
  course: "en" | "fr";
  goal: Goal;
  levelStart?: number;
  levelEnd?: number;
};

const KEY = "progress:log:v1";

export function loadProgress(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function addProgress(e: ProgressEntry) {
  const arr = loadProgress();
  arr.push(e);
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function progressByDay() {
  // agrège par date
  const map = new Map<string, { date: string; attempts: number; correct: number; coins: number; durationSec: number }>();
  for (const e of loadProgress()) {
    const k = e.date;
    const m = map.get(k) ?? { date: k, attempts: 0, correct: 0, coins: 0, durationSec: 0 };
    m.attempts += e.attempts;
    m.correct  += e.correct;
    m.coins    += e.coins;
    m.durationSec += e.durationSec;
    map.set(k, m);
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

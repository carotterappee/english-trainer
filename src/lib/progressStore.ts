export type DayStat = { score: number; minutes: number };
export type ProgressMap = Record<string, DayStat>;

const KEY = "progress:v1";

const toKey = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD en local

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export function saveProgress(p: ProgressMap) {
  localStorage.setItem(KEY, JSON.stringify(p));
}
export function upsertToday(stat: Partial<DayStat>) {
  const p = loadProgress();
  const k = toKey(new Date());
  const prev = p[k] || { score: 0, minutes: 0 };
  p[k] = { score: stat.score ?? prev.score, minutes: stat.minutes ?? prev.minutes };
  saveProgress(p);
  return p;
}
export function toSeries(p: ProgressMap) {
  return Object.entries(p)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([date, {score, minutes}]) => ({ date, score, minutes }));
}
export function computeStreak(p: ProgressMap) {
  let streak = 0;
  const today = new Date();
  const hasDay = (d: Date) => !!p[toKey(d)];
  for (let i = 0; ; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    if (hasDay(d)) streak++; else break;
  }
  return streak;
}

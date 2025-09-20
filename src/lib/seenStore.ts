import type { Goal } from "@/lib/profile";

export type SeenEntry = { firstSeen: string; correct?: boolean };
export type SeenMap = Record<Goal, Record<string, SeenEntry>>;
const KEY = "seen:v1";

function load(): SeenMap {
  if (typeof window === "undefined") return {} as SeenMap;
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {} as SeenMap; }
}
function save(db: SeenMap) { localStorage.setItem(KEY, JSON.stringify(db)); }

export function sentenceId(en: string): string {
  // id stable et insensible à la casse/punctuation
  return en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function isSeen(goal: Goal, id: string) {
  const db = load();
  return !!db[goal]?.[id];
}
export function isPassed(goal: Goal, id: string) {
  const db = load();
  return !!db[goal]?.[id]?.correct;
}

export function markSeen(goal: Goal, id: string, correct: boolean) {
  const db = load();
  if (!db[goal]) db[goal] = {};
  if (!db[goal][id]) db[goal][id] = { firstSeen: new Date().toISOString() };
  if (correct) db[goal][id].correct = true; // on n’écarte définitivement que si elle a réussi
  save(db);
}

export function clearSeen(goal?: Goal) {
  if (typeof window === "undefined") return;
  if (!goal) { localStorage.removeItem(KEY); return; }
  const db = load();
  delete db[goal];
  save(db);
}

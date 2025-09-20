import type { UserProfile } from "@/lib/profile";

export type Session = {
  startedAt: string;        // ISO
  durationSec: number;      // 300 / 600 / 900 / 1200
  course: NonNullable<UserProfile["course"]>;
  answerLang: NonNullable<UserProfile["answerLang"]>;
  variant: UserProfile["variant"];
  goal: UserProfile["goal"];
  coins: number;
  attempts: number;
  correct: number;
  ended?: boolean;
};

const KEY = "session:v1";
const PREF_KEY = "session:prefDuration";

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
}
export function saveSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
export function clearSession() {
  localStorage.removeItem(KEY);
}
export function startSession(profile: UserProfile, durationMin: number) {
  const s: Session = {
    startedAt: new Date().toISOString(),
    durationSec: Math.max(300, durationMin * 60),
    course: profile.course ?? "en",
    answerLang: profile.answerLang ?? "fr",
    variant: profile.variant,
    goal: profile.goal,
    coins: 0,
    attempts: 0,
    correct: 0,
  };
  saveSession(s);
  // mémorise la préférence
  try { localStorage.setItem(PREF_KEY, String(durationMin)); } catch {}
  return s;
}
export function preferredDurationMin(): number {
  try { return Number(localStorage.getItem(PREF_KEY) || "15"); } catch { return 15; }
}
export function secondsLeft(s: Session, now = new Date()): number {
  const start = new Date(s.startedAt).getTime();
  const elapsed = Math.floor((now.getTime() - start) / 1000);
  return Math.max(0, s.durationSec - elapsed);
}
export function hasActiveSession(): boolean {
  const s = loadSession();
  if (!s || s.ended) return false;
  return secondsLeft(s) > 0;
}


export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p) return null;
    const migrated = migrateProfile(p);
    localStorage.setItem(KEY, JSON.stringify(migrated));
    return migrated as UserProfile;
  } catch {
    return null;
  }
}

export type Course = "en" | "fr";
export type AnswerLang = "fr" | "ru";
export type Goal = "everyday" | "travel" | "work" | "exams" | "boost";

export type UserProfile = {
  course?: Course;
  answerLang?: AnswerLang;
  variant?: "us" | "uk";
  categories?: Goal[];
  cefr?: "A1"|"A2"|"B1"|"B2"|"C1"|"C2";
};

export const GOAL_LABEL: Record<Goal, string> = {
  everyday: "Vie quotidienne",
  travel: "Voyage",
  work: "Travail",
  exams: "Examens",
  boost: "Boost",
};

export function selectedCats(p: UserProfile): Goal[] {
  if (p.categories && p.categories.length) return Array.from(new Set(p.categories));
  return ["everyday"];
}

export function catsKey(p: UserProfile): string {
  const cats = selectedCats(p).slice().sort();
  return cats.join("+");
}

const KEY = "userProfile:v1";

export function migrateProfile(p: Record<string, unknown>): UserProfile {
  const copy = { ...p };
  if (copy && "variant" in copy) delete copy.variant;
  if (!copy.categories && copy.goal) copy.categories = [copy.goal];
  return copy as UserProfile;
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function hasProfile(): boolean {
  return !!loadProfile();
}

export function ensureProfileDefaults(): void {
  const p = loadProfile();
  if (!p) return;
  let changed = false;
  if (!p.course) { p.course = "en"; changed = true; }
  if (!p.answerLang) { p.answerLang = "fr"; changed = true; }
  if (changed) saveProfile(p);
}

export function updateProfile(patch: Partial<Omit<UserProfile, "variant">>): UserProfile | null {
  const cur = loadProfile();
  if (!cur) return null;
  // On retire explicitement variant si présent dans le patch
  const clean = Object.fromEntries(Object.entries(patch).filter(([k]) => k !== "variant")) as Partial<Omit<UserProfile, "variant">>;
  const next = { ...cur, ...clean };
  saveProfile(next);
  return next;
}






// migration douce (à appeler au démarrage)


export const VARIANT_FLAG: Record<EnglishVariant, string> = {
  british: "🇬🇧",
  american: "🇺🇸",
};
export const GOAL_LABEL: Record<Goal, string> = {
  everyday: "Vie quotidienne",
  travel: "Voyage",
  work: "Travail",
  exams: "Examens",
};

export function updateProfile(patch: Partial<Pick<UserProfile, "variant" | "goal">>) {
  const cur = loadProfile();
  if (!cur) return null;
  const next = { ...cur, ...patch };
  saveProfile(next);
  return next;
}
export type EnglishVariant = "british" | "american";
export type Goal =
  | "everyday"   // vie de tous les jours
  | "travel"
  | "work"
  | "exams";

export type UserProfile = {
  deviceId: string;
  variant: EnglishVariant;
  goal: Goal;
  createdAt: string; // ISO
};

const KEY = "userProfile:v1";

function makeDeviceId() {
  // id anonyme par appareil
  return "dev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function hasProfile() {
  return !!loadProfile();
}

export function createProfile(variant: EnglishVariant, goal: Goal) {
  const profile: UserProfile = {
    deviceId: makeDeviceId(),
    variant,
    goal,
    createdAt: new Date().toISOString(),
  };
  saveProfile(profile);
  return profile;
}

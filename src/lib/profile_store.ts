import type { UserProfile } from "@/lib/profile";

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    // SSR/SSG: retourne un profil par défaut
    return { categories: ["everyday"] } as UserProfile;
  }
  const raw = JSON.parse(localStorage.getItem("profile") || "{}") as Partial<UserProfile>;
  if ("variant" in raw) delete raw.variant;
  if (!raw.categories && raw.goal) raw.categories = [raw.goal];
  localStorage.setItem("profile", JSON.stringify(raw));
  return raw as UserProfile;
}

export function updateProfile(next: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("profile", JSON.stringify(next));
  }
  return next;
}

import type { UserProfile } from "@/lib/profile";

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    // SSR/SSG: retourne un profil par défaut
    return { categories: ["everyday"] } as UserProfile;
  }
  const raw = JSON.parse(localStorage.getItem("profile") || "{}") as Partial<UserProfile>;
  const p: Partial<UserProfile> = raw || {};
  // MIGRATION : enlever l’ancien 'variant' et normaliser les catégories
  if ("variant" in p) delete p.variant;
  if (!p.categories && p.goal) p.categories = [p.goal];
  localStorage.setItem("profile", JSON.stringify(p));
  return p as UserProfile;
}

export function updateProfile(next: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("profile", JSON.stringify(next));
  }
  return next;
}

const DYN_TZ  = "themes:dynamic:tz:v1"; // ex: "Europe/Paris" ou "auto"
// ---- Dynamic (jour/nuit) ----
export function getDynamicTZ(): string {
  if (typeof window === "undefined") return "Europe/Paris";
  return localStorage.getItem(DYN_TZ) || "Europe/Paris";
}
export function setDynamicTZ(tz: string) {
  localStorage.setItem(DYN_TZ, tz);
}
import type { ThemeId } from "./themes";
const OWNED = "themes:owned:v1";
const SELECTED = "themes:selected:v1";

export function getOwned(): ThemeId[] {
  if (typeof window === "undefined") return ["clouds"];
  try { return JSON.parse(localStorage.getItem(OWNED) || '["clouds"]'); } catch { return ["clouds"]; }
}
export function setOwned(list: ThemeId[]) {
  localStorage.setItem(OWNED, JSON.stringify(Array.from(new Set(list))));
}
export function isOwned(id: ThemeId) { return getOwned().includes(id); }

export function getSelected(): ThemeId {
  if (typeof window === "undefined") return "clouds";
  return (localStorage.getItem(SELECTED) as ThemeId) || "clouds";
}
export function setSelected(id: ThemeId) { localStorage.setItem(SELECTED, id); }

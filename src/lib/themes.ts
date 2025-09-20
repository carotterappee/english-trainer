export type ThemeId = "clouds" | "night" | "sunset" | "winter" | "dynamic";

export const THEMES: Array<{ id: ThemeId; name: string; emoji: string; price: number }> = [
  { id: "clouds",  name: "Clouds",        emoji: "☁️", price: 0 },
  { id: "night",   name: "Night Sky",     emoji: "🌌", price: 80 },
  { id: "sunset",  name: "Sunset",        emoji: "🌅", price: 100 },
  { id: "winter",  name: "Winter",        emoji: "❄️", price: 90 },
  { id: "dynamic", name: "Auto Jour/Nuit",emoji: "⏱️", price: 120 },
];

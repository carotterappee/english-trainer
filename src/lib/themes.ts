export type ThemeId = "clouds" | "night" | "sunset" | "paper";

export const THEMES: { id: ThemeId; name: string; price: number; emoji: string }[] = [
  { id: "clouds", name: "Clouds (par défaut)", price: 0, emoji: "☁️" },
  { id: "night",  name: "Night Sky",          price: 30, emoji: "🌌" },
  { id: "sunset", name: "Sunset Waves",       price: 30, emoji: "🌅" },
  { id: "paper",  name: "Paper Texture",      price: 20, emoji: "📜" },
];

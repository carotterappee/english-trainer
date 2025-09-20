"use client";
import { useMemo, useState } from "react";
import Avatar from "@/components/avatar/Avatar";
import PixelAvatar, { type PixelCfg } from "@/components/avatar/PixelAvatar";
import { loadProfile, updateAvatar, defaultAvatar, type AvatarConfig } from "@/lib/profile";

const SKINS: AvatarConfig["skin"][] = ["peach", "tan", "brown", "dark"];
const HAIRSTYLES: AvatarConfig["hairStyle"][] = ["bald", "short", "bun", "curly", "mohawk"];
const HAIRCOLORS: AvatarConfig["hairColor"][] = ["black", "brown", "blonde", "red"];
const OUTFITS: AvatarConfig["outfit"][] = ["tshirt", "hoodie", "sweater"];
const OUTFITCOLORS: AvatarConfig["outfitColor"][] = ["blue", "green", "purple", "pink"];
const ACCESSORIES: AvatarConfig["accessory"][] = ["none", "glasses", "earrings", "cap"];
const BOTTOMS: PixelCfg["bottom"][] = ["shorts", "skirt", "pants"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomAvatar(): AvatarConfig {
  return {
    skin: rand(SKINS),
    hairStyle: rand(HAIRSTYLES),
    hairColor: rand(HAIRCOLORS),
    outfit: rand(OUTFITS),
    outfitColor: rand(OUTFITCOLORS),
    accessory: rand(ACCESSORIES),
  };
}

export default function ProfilePage() {
  const p = loadProfile();
  const [cfg, setCfg] = useState<AvatarConfig>(p?.avatar ?? defaultAvatar());
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof AvatarConfig>(k: K, v: AvatarConfig[K]) => {
    setCfg((c) => ({ ...c, [k]: v }));
    setSaved(false);
  };

  const save = () => {
    updateAvatar(cfg);
    setSaved(true);
  };

  const reset = () => { const d = defaultAvatar(); setCfg(d); setSaved(false); };
  const randomize = () => { setCfg(randomAvatar()); setSaved(false); };

  // Mapping pour PixelAvatar
  const pixelCfg = {
    size: 160,
    skin: cfg.skin === "peach" ? "light" : cfg.skin as PixelCfg["skin"],
    hairStyle: cfg.hairStyle === "bun" ? "bun" : cfg.hairStyle === "short" ? "short" : "long",
    hairColor: cfg.hairColor as PixelCfg["hairColor"],
    top: cfg.outfit === "hoodie" ? "hoodie" : cfg.outfit === "tshirt" ? "tshirt" : "sweater",
    topColor: cfg.outfitColor as PixelCfg["topColor"],
    bottom: cfg.bottom ?? "shorts",
    glasses: cfg.accessory === "glasses",
    scarf: !!cfg.scarf,
  } satisfies PixelCfg;

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Mon profil</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Aperçu */}
        <div className="p-6 rounded-3xl border bg-white flex flex-col items-center gap-4">
          {(cfg.mode ?? "pixel") === "pixel"
            ? <PixelAvatar {...pixelCfg} />
            : <Avatar size={160} cfg={cfg} />}
          <div className="flex gap-3">
            <button onClick={randomize} className="rounded-2xl border px-3 py-2 hover:bg-indigo-50">🎲 Aléatoire</button>
            <button onClick={reset} className="rounded-2xl border px-3 py-2 hover:bg-indigo-50">↩️ Réinitialiser</button>
            <button onClick={save} className="rounded-2xl bg-indigo-600 text-white px-4 py-2">💾 Enregistrer</button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => set("mode", "pixel")}
              className={`px-3 py-2 rounded-2xl border ${cfg.mode !== "vector" ? "bg-indigo-50 border-indigo-600" : ""}`}
            >
              🟪 Pixel
            </button>
            <button
              onClick={() => set("mode", "vector")}
              className={`px-3 py-2 rounded-2xl border ${cfg.mode === "vector" ? "bg-indigo-50 border-indigo-600" : ""}`}
            >
              🟦 Vector
            </button>
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!cfg.scarf} onChange={(e)=>set("scarf", Boolean(e.target.checked))} />
              <span>🧣 Écharpe</span>
            </label>
          </div>
          {saved && <p className="text-emerald-700 text-sm">✅ Profil enregistré sur cet appareil.</p>}
        </div>

        {/* Panneaux d’options */}
        <div className="space-y-4">
          <Section title="Peau">
            <Swatches options={SKINS} value={cfg.skin} onChange={(v) => set("skin", v)} type="skin" />
          </Section>

          <Section title="Coiffure">
            <GridButtons
              options={HAIRSTYLES}
              value={cfg.hairStyle}
              onChange={(v) => set("hairStyle", v)}
              renderLabel={(v) => v}
            />
          </Section>

          <Section title="Couleur des cheveux">
            <Swatches options={HAIRCOLORS} value={cfg.hairColor} onChange={(v) => set("hairColor", v)} type="hair" />
          </Section>

          <Section title="Tenue">
            <GridButtons
              options={OUTFITS}
              value={cfg.outfit}
              onChange={(v) => set("outfit", v)}
              renderLabel={(v) => v}
            />
            <Swatches options={OUTFITCOLORS} value={cfg.outfitColor} onChange={(v) => set("outfitColor", v)} type="outfit" />
          </Section>

          <Section title="Bas (short/jupe/pantalon)">
            <GridButtons
              options={BOTTOMS}
              value={cfg.bottom ?? "shorts"}
              onChange={(v) => set("bottom", v)}
              renderLabel={(v) => v}
            />
          </Section>

          <Section title="Accessoire">
            <GridButtons
              options={ACCESSORIES}
              value={cfg.accessory}
              onChange={(v) => set("accessory", v)}
              renderLabel={(v) => (v === "none" ? "aucun" : v)}
            />
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl border bg-white">
      <h2 className="font-medium mb-3">{title}</h2>
      {children}
    </div>
  );
}

function GridButtons<T extends string>({
  options, value, onChange, renderLabel,
}: { options: T[]; value: T; onChange: (v: T) => void; renderLabel: (v: T) => React.ReactNode; }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-2 rounded-2xl border hover:bg-indigo-50 ${opt === value ? "border-indigo-600 bg-indigo-50" : ""}`}
        >
          {renderLabel(opt)}
        </button>
      ))}
    </div>
  );
}

function Swatches<T extends string>({
  options, value, onChange, type,
}: { options: T[]; value: T; onChange: (v: T) => void; type: "skin" | "hair" | "outfit"; }) {
  const colorFor = (v: string) => {
    if (type === "skin") return { peach: "#FFDFC4", tan: "#F1C27D", brown: "#D1A074", dark: "#916A4A" }[v] || "#ccc";
    if (type === "hair") return { black: "#2B2B2B", brown: "#5B3A29", blonde: "#D6A64B", red: "#B5462D" }[v] || "#999";
    return { blue: "#4C6EF5", green: "#2FB36A", purple: "#7C4DFF", pink: "#FF66C4" }[v] || "#888";
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-9 h-9 rounded-full border ${opt === value ? "ring-2 ring-indigo-600" : ""}`}
          style={{ background: colorFor(opt) }}
          title={opt}
        />
      ))}
    </div>
  );
}

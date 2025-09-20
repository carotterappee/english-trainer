import type { AvatarConfig } from "@/lib/profile";

const SKIN: Record<NonNullable<AvatarConfig["skin"]>, string> = {
  peach: "#FFDFC4",
  tan:   "#F1C27D",
  brown: "#D1A074",
  dark:  "#916A4A",
};
const HAIR: Record<NonNullable<AvatarConfig["hairColor"]>, string> = {
  black:  "#2B2B2B",
  brown:  "#5B3A29",
  blonde: "#D6A64B",
  red:    "#B5462D",
};
const OUTFIT: Record<NonNullable<AvatarConfig["outfitColor"]>, string> = {
  blue:   "#4C6EF5",
  green:  "#2FB36A",
  purple: "#7C4DFF",
  pink:   "#FF66C4",
};

export default function Avatar({
  size = 120,
  cfg,
  bg = true,
}: { size?: number; cfg: AvatarConfig; bg?: boolean }) {
  const s = size;
  const skin = SKIN[cfg.skin];
  const hair = HAIR[cfg.hairColor];
  const cloth = OUTFIT[cfg.outfitColor];

  return (
    <svg width={s} height={s} viewBox="0 0 120 120" role="img" aria-label="Avatar">
      {/* fond doux */}
      {bg && (
        <defs>
          <radialGradient id="g" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#F4F8FF" />
            <stop offset="100%" stopColor="#EDE7F6" />
          </radialGradient>
        </defs>
      )}
      {bg && <rect x="0" y="0" width="120" height="120" rx="24" fill="url(#g)" />}

      {/* cou + buste (tenue) */}
      <path d="M35 92 Q60 104 85 92 L85 120 L35 120 Z" fill={cloth} />
      {cfg.outfit === "hoodie" && (
        <path d="M35 92 Q60 75 85 92" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="3" />
      )}

      {/* cou */}
      <rect x="52" y="70" width="16" height="12" rx="4" fill={skin} />

      {/* tête */}
      <circle cx="60" cy="52" r="26" fill={skin} />

      {/* oreilles */}
      <circle cx="33.5" cy="52" r="4" fill={skin} />
      <circle cx="86.5" cy="52" r="4" fill={skin} />

      {/* cheveux (selon style) */}
      {cfg.hairStyle !== "bald" && (
        <>
          {cfg.hairStyle === "short" && (
            <path d="M34 52 Q36 26 60 26 Q84 26 86 52 Q74 40 60 40 Q46 40 34 52 Z" fill={hair} />
          )}
          {cfg.hairStyle === "bun" && (
            <>
              <circle cx="60" cy="22" r="10" fill={hair} />
              <path d="M34 52 Q36 26 60 28 Q84 26 86 52 Q74 40 60 40 Q46 40 34 52 Z" fill={hair} />
            </>
          )}
          {cfg.hairStyle === "curly" && (
            <path
              d="M36 40 q4-14 14-16 q6 6 12 0 q6 6 12 0 q10 2 14 16 q-8-6-14-4 q-6 4-12 4 q-6 0-12-4 q-6-2-14 4 Z"
              fill={hair}
            />
          )}
          {cfg.hairStyle === "mohawk" && (
            <path d="M56 14 L64 14 L68 40 L52 40 Z" fill={hair} />
          )}
        </>
      )}

      {/* yeux + bouche */}
      <circle cx="50" cy="52" r="2.6" fill="#2B2B2B" />
      <circle cx="70" cy="52" r="2.6" fill="#2B2B2B" />
      <path d="M50 65 Q60 70 70 65" stroke="#CC5A71" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* accessoires */}
      {cfg.accessory === "glasses" && (
        <>
          <circle cx="50" cy="52" r="7.5" fill="none" stroke="#2B2B2B" strokeWidth="2" />
          <circle cx="70" cy="52" r="7.5" fill="none" stroke="#2B2B2B" strokeWidth="2" />
          <line x1="57.5" y1="52" x2="62.5" y2="52" stroke="#2B2B2B" strokeWidth="2" />
        </>
      )}
      {cfg.accessory === "earrings" && (
        <>
          <circle cx="33.5" cy="57" r="2" fill="#FFD54F" />
          <circle cx="86.5" cy="57" r="2" fill="#FFD54F" />
        </>
      )}
      {cfg.accessory === "cap" && (
        <>
          <path d="M34 46 Q60 26 86 46 L86 40 Q60 20 34 40 Z" fill="#333" />
          <path d="M86 44 Q98 48 104 54 Q90 54 86 50 Z" fill="#333" />
        </>
      )}
    </svg>
  );
}

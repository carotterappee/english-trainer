export default function Coin({ size = 28 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" role="img" aria-label="Pink coin">
      <defs>
        <radialGradient id="gFill" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffe3f7" />
          <stop offset="60%" stopColor="#ff6ac7" />
          <stop offset="100%" stopColor="#b01d8b" />
        </radialGradient>
        <linearGradient id="gRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd0ef" />
          <stop offset="100%" stopColor="#ff8dd6" />
        </linearGradient>
        <linearGradient id="gShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="50" cy="86" rx="26" ry="8" fill="rgba(0,0,0,.15)"/>

      {/* rim */}
      <circle cx="50" cy="50" r="40" fill="url(#gRim)" />
      <circle cx="50" cy="50" r="34" fill="url(#gFill)" />

      {/* inner emboss (star) */}
      <g opacity=".9">
        <polygon points="50,28 56,44 73,44 60,54 65,70 50,60 35,70 40,54 27,44 44,44"
                 fill="rgba(255,255,255,.85)"/>
        <polygon points="50,32 55,46 69,46 58,54 62,67 50,59 38,67 42,54 31,46 45,46"
                 fill="rgba(255,99,195,.45)"/>
      </g>

      {/* shine */}
      <path d="M20 38 C35 20, 65 18, 80 35" stroke="url(#gShine)" strokeWidth="6" fill="none" opacity=".8"/>
    </svg>
  );
}

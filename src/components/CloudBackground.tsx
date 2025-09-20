"use client";
import React, { useEffect, useState } from "react";
import { getSelected } from "@/lib/themeStore";

// Types pour les variables CSS custom
export type CSSVars = React.CSSProperties & {
  ["--dur"]?: string;
  ["--delay"]?: string;
  ["--scale"]?: string;
  ["--o"]?: string;
};

function Cloud({ style }: { style?: CSSVars }) {
  return (
    <div className="cloud" style={style} aria-hidden>
      <svg viewBox="0 0 200 60" width="200" height="60">
        {/* Un nuage “fluffy” en ellipses */}
        <g fill="white">
          <ellipse cx="55" cy="34" rx="35" ry="20" />
          <ellipse cx="95" cy="30" rx="30" ry="18" />
          <ellipse cx="135" cy="36" rx="26" ry="16" />
          <rect x="30" y="35" width="110" height="20" rx="10" />
        </g>
      </svg>
    </div>
  );
}

export default function CloudBackground() {
  const [ok, setOk] = useState(false);
  useEffect(() => { setOk(getSelected() === "clouds"); }, []);
  if (!ok) return null;
  return (
    <div className="clouds pointer-events-none" aria-hidden>
      {/* ciel dégradé */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-indigo-50 to-white" />
      {/* couches de nuages */}
      <Cloud style={{ top: "15%", "--dur": "85s", "--delay": "-10s", "--scale": "1.1", "--o": ".9" }} />
      <Cloud style={{ top: "30%", "--dur": "120s", "--delay": "-30s", "--scale": "1.4", "--o": ".75" }} />
      <Cloud style={{ top: "48%", "--dur": "95s", "--delay": "-50s", "--scale": "1.2", "--o": ".85" }} />
      <Cloud style={{ top: "66%", "--dur": "140s", "--delay": "-15s", "--scale": "1.6", "--o": ".7" }} />
      <Cloud style={{ top: "78%", "--dur": "110s", "--delay": "-80s", "--scale": "1.3", "--o": ".8" }} />
    </div>
  );
}

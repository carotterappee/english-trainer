"use client";
import { useEffect, useState } from "react";

/**
 * SunsetFX (cinematic) — rendu proche de la photo :
 * - Gros soleil posé sur l’horizon (halo doux), légère “respiration”
 * - Océan très calme (dégradé + bandes floutées horizontales = effet de filé)
 * - Colonne de reflet sous le soleil avec léger shimmer
 * - Oiseaux silhouettes qui traversent
 * - CSS-in-JS (styled-jsx), pas besoin de toucher globals.css
 */
export default function SunsetFX() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () =>
      setShow(document.documentElement.getAttribute("data-theme") === "sunset");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  if (!show) return null;

  // Génère les bandes horizontales du masque stripes côté JS (hors JSX SVG)
  const stripes = Array.from({ length: 80 }).map((_, i) => (
    <rect key={i} x="0" y={550 + i * 6} width="1000" height="2" />
  ));

  return (
    <div className="sunset-wrap" aria-hidden>
      <svg className="sv" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          {/* Ciel rouge -> rose */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d93400" />
            <stop offset="45%"  stopColor="#ff5b2d" />
            <stop offset="80%"  stopColor="#ff8a6a" />
            <stop offset="100%" stopColor="#ffb68e" />
          </linearGradient>

          {/* Soleil */}
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff6c8" />
            <stop offset="50%"  stopColor="#ffd27e" />
            <stop offset="100%" stopColor="#ffb04f" />
          </radialGradient>

          {/* Océan */}
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ffb08a" stopOpacity="0.45" />
            <stop offset="55%"  stopColor="#f29a6e" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d66c42" stopOpacity="0.55" />
          </linearGradient>

          {/* flou doux */}
          <filter id="blur40"><feGaussianBlur stdDeviation="40" /></filter>
          <filter id="blur8"><feGaussianBlur stdDeviation="8" /></filter>

          {/* masque “bandes horizontales” pour le reflet/filé */}
          <mask id="stripeMask">
            <rect x="0" y="0" width="1000" height="1000" fill="black" />
            <g className="stripes" fill="white">
              {stripes}
            </g>
          </mask>

          {/* oiseau (double arc) */}
          <g id="bird">
            <path d="M0 0 q 12 -9 24 0" fill="none" stroke="#2b1d33" strokeWidth="3" strokeLinecap="round"/>
            <path d="M24 0 q 12 -9 24 0" fill="none" stroke="#2b1d33" strokeWidth="3" strokeLinecap="round"/>
          </g>
        </defs>

        {/* CIEL */}
        <rect x="0" y="0" width="1000" height="1000" fill="url(#sky)" />

        {/* SOLEIL (statique près de l’horizon) + halo */}
        <g className="sunGroup">
          <circle cx="500" cy="600" r="180" fill="url(#sunGrad)" />
          <circle cx="500" cy="600" r="260" fill="#ffd8a6" filter="url(#blur40)" opacity="0.35" />
        </g>

        {/* HORIZON net */}
        <rect x="0" y="600" width="1000" height="2" fill="rgba(140,30,0,.25)" />

        {/* OCÉAN (calme) */}
        <rect x="0" y="600" width="1000" height="400" fill="url(#seaGrad)" />

        {/* FILÉ HORIZONTAL (motion blur simulé) */}
        <g className="seaMotion" mask="url(#stripeMask)">
          <rect x="-200" y="600" width="1400" height="400" fill="url(#seaGrad)" filter="url(#blur8)" />
        </g>

        {/* COLONNE DE REFLET sous le soleil */}
        <g className="reflection" style={{ mixBlendMode: "screen" }}>
          <rect x="450" y="600" width="100" height="360" fill="#ffdcae" opacity="0.7" />
          <rect x="430" y="600" width="140" height="360" fill="#ffc48b" opacity="0.35" filter="url(#blur8)"/>
          {/* petit scintillement sur la colonne */}
          <rect className="reflectShimmer" x="430" y="600" width="140" height="360" fill="#ffe3b3" opacity="0.25" mask="url(#stripeMask)" />
        </g>

        {/* OISEAUX (2 vols) */}
        <g className="flock f1" transform="translate(-150,230) scale(1.1)">
          <use href="#bird" />
          <use href="#bird" x="40" y="10" />
          <use href="#bird" x="85" y="-2" />
        </g>
        <g className="flock f2" transform="translate(-150,270) scale(0.9)">
          <use href="#bird" />
          <use href="#bird" x="36" y="8" />
          <use href="#bird" x="75" y="-3" />
          <use href="#bird" x="115" y="6" />
        </g>
      </svg>

      <style jsx>{`
        .sunset-wrap{position:absolute;inset:0;pointer-events:none;z-index:0}
        .sv{width:100%;height:100%;display:block}

        /* respiration très subtile du halo */
        .sunGroup circle:nth-child(2){animation:glow 6s ease-in-out infinite}
        @keyframes glow{0%,100%{opacity:.30}50%{opacity:.42}}

        /* filé horizontal de la mer (glissement léger) */
        .seaMotion{animation:seaDrift 18s linear infinite}
        @keyframes seaDrift{from{transform:translateX(0)}to{transform:translateX(-180px)}}

        /* scintillement doux du reflet */
        .reflectShimmer{animation:shimmer 5.2s ease-in-out infinite}
        @keyframes shimmer{0%,100%{opacity:.18;transform:translateX(-6px)}50%{opacity:.34;transform:translateX(6px)}}

        /* oiseaux: battement d’ailes + traversée */
        .flock use{transform-origin:center;animation:flap .9s ease-in-out infinite}
        .flock use:nth-child(2){animation-delay:.1s}
        .flock use:nth-child(3){animation-delay:.2s}
        .flock use:nth-child(4){animation-delay:.3s}
        @keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.78)}}
        .flock{opacity:0}
        .flock.f1{animation:fly1 26s linear 2s infinite}
        .flock.f2{animation:fly2 30s linear 10s infinite}
        @keyframes fly1{
          0%{transform:translate(-150px,230px) scale(1.1);opacity:0}
          6%{opacity:.95}
          50%{transform:translate(1150px,210px) scale(1.1);opacity:.95}
          100%{transform:translate(1300px,200px) scale(1.1);opacity:0}
        }
        @keyframes fly2{
          0%{transform:translate(-150px,270px) scale(.9);opacity:0}
          8%{opacity:.9}
          50%{transform:translate(1150px,300px) scale(.9);opacity:.9}
          100%{transform:translate(1300px,320px) scale(.9);opacity:0}
        }

        @media (prefers-reduced-motion:reduce){
          .seaMotion,.reflectShimmer,.flock,.sunGroup circle:nth-child(2){animation:none}
          .flock{opacity:.85;transform:translate(520px,240px) scale(.95)}
        }
      `}</style>
    </div>
  );
}

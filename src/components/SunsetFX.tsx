"use client";
import { useEffect, useState } from "react";

/**
 * SunsetFX – overlay SVG full-screen (qualité)
 * - Soleil descend (boucle douce) + glow + reflet sur l’eau
 * - Océan en 3 couches de vagues (parallax), plus mousse au rivage
 * - Deux vols d’oiseaux avec léger flap
 * - pointer-events: none => ne bloque aucun clic
 */
export default function SunsetFX() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () =>
      setShow(document.documentElement.getAttribute("data-theme") === "sunset");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="sunset-wrap" aria-hidden>
      <svg className="sunset-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          {/* Ciel dégradé */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9a9e" />
            <stop offset="45%" stopColor="#fecfef" />
            <stop offset="100%" stopColor="#f6d365" />
          </linearGradient>

          {/* Glow du soleil */}
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8d6" />
            <stop offset="45%" stopColor="#ffd27e" />
            <stop offset="80%" stopColor="#ffae6f" />
            <stop offset="100%" stopColor="#ff8aa3" />
          </radialGradient>

          {/* Reflet vertical sous le soleil (masqué par vagues) */}
          <linearGradient id="reflectGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,214,160,0.75)" />
            <stop offset="50%" stopColor="rgba(255,180,140,0.45)" />
            <stop offset="100%" stopColor="rgba(255,160,160,0.15)" />
          </linearGradient>

          {/* Chemin d’une vague (une période) */}
          <path
        id="wavePath"
        d="M 0 0 
          C 50 -8, 100 8, 150 0
          S 250 -8, 300 0
          S 400 8, 450 0
          S 550 -8, 600 0"
          />

          {/* Oiseau (deux arcs) */}
          <g id="bird">
            <path d="M0 0 q 10 -8 20 0" fill="none" stroke="#3a2d55" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 0 q 10 -8 20 0" fill="none" stroke="#3a2d55" strokeWidth="3" strokeLinecap="round" />
          </g>
        </defs>

        {/* Ciel */}
        <rect x="0" y="0" width="1000" height="1000" fill="url(#sky)" />

        {/* Soleil + glow + REFLET */}
        <g className="sun-group">
          <circle className="sun" cx="500" cy="300" r="110" fill="url(#sunGrad)" />
          {/* halo */}
          <circle cx="500" cy="300" r="170" fill="#ffdca6" opacity="0.25" />
          {/* reflet (colonne) */}
          <g className="reflection" transform="translate(0,520)">
            <rect x="460" y="0" width="80" height="320" fill="url(#reflectGrad)" opacity="0.6" />
            {/* scintillement du reflet */}
            <rect className="reflect-ripples" x="430" y="0" width="140" height="320" fill="url(#reflectGrad)" opacity="0.35" />
          </g>
        </g>

        {/* Océan (fond) */}
        <rect x="0" y="520" width="1000" height="480" fill="url(#oceanFill)" />
        <defs>
          <linearGradient id="oceanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbc2c4" stopOpacity="0.28" />
            <stop offset="40%" stopColor="#8bb0ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2a4aa3" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Vagues lointaines */}
        <g className="waves far" transform="translate(0,560)">
          {Array.from({ length: 6 }).map((_, i) => (
            <use key={i} href="#wavePath" x={i * 180 - 100} y={0} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          ))}
        </g>

        {/* Vagues médianes */}
        <g className="waves mid" transform="translate(0,620)">
          {Array.from({ length: 7 }).map((_, i) => (
            <use key={i} href="#wavePath" x={i * 180 - 120} y={0} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" />
          ))}
        </g>

        {/* Vagues proches */}
        <g className="waves near" transform="translate(0,690)">
          {Array.from({ length: 8 }).map((_, i) => (
            <use key={i} href="#wavePath" x={i * 180 - 140} y={0} fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="4" />
          ))}
        </g>

        {/* Mousse au rivage */}
        <g className="foam" transform="translate(0,820)">
          {Array.from({ length: 10 }).map((_, i) => (
            <use key={i} href="#wavePath" x={i * 180 - 160} y={0} fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          ))}
        </g>

        {/* Sable */}
        <rect x="0" y="900" width="1000" height="100" fill="url(#sand)" />
        <defs>
          <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4e3b6" />
            <stop offset="100%" stopColor="#e4cf96" />
          </linearGradient>
        </defs>

        {/* Oiseaux (deux vols) */}
        <g className="flock f1" transform="translate(-150,190) scale(1.1)">
          <use href="#bird" />
          <use href="#bird" x="40" y="10" />
          <use href="#bird" x="85" y="-2" />
        </g>
        <g className="flock f2" transform="translate(-150,240) scale(0.9)">
          <use href="#bird" />
          <use href="#bird" x="36" y="8" />
          <use href="#bird" x="75" y="-3" />
          <use href="#bird" x="115" y="6" />
        </g>
      </svg>

      <style jsx>{`
        .sunset-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .sunset-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Soleil qui descend (reboucle très lentement) + halo qui respire */
        .sun-group .sun {
          animation: sunDrop 60s linear infinite;
        }
        .sun-group circle:nth-child(2) {
          animation: sunGlow 6s ease-in-out infinite;
          transform-origin: 500px 300px;
        }
        @keyframes sunDrop {
          0%   { transform: translateY(-10px); }
          45%  { transform: translateY(140px); } /* proche de l’horizon */
          55%  { transform: translateY(150px); } /* très léger “aplatissement” */
          100% { transform: translateY(-10px); } /* boucle douce */
        }
        @keyframes sunGlow {
          0%,100% { opacity: 0.22; transform: scale(1.00); }
          50%     { opacity: 0.30; transform: scale(1.04); }
        }

        /* Reflet qui ondule légèrement (shimmer) */
        .reflection {
          mix-blend-mode: screen;
        }
        .reflect-ripples {
          mask-image: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0.0) 0px,
            rgba(0,0,0,0.0) 6px,
            rgba(0,0,0,1.0) 6px,
            rgba(0,0,0,1.0) 12px
          );
          animation: shimmer 4.8s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,100% { transform: translateX(-10px) skewY(0deg); opacity: 0.35; }
          50%     { transform: translateX(10px)  skewY(1deg); opacity: 0.55; }
        }


        /* Parallax des vagues – déplacement uniquement en X (pas d’oscillation verticale) */
        .waves.far  { animation: waveFar  26s linear infinite; opacity: .85; }
        .waves.mid  { animation: waveMid  18s linear infinite; }
        .waves.near { animation: waveNear 12s linear infinite; }

        /* On conserve la position Y constante de chaque couche */
        @keyframes waveFar  { from { transform: translate3d(0,     560px, 0); } to { transform: translate3d(-240px, 560px, 0); } }
        @keyframes waveMid  { from { transform: translate3d(0,     620px, 0); } to { transform: translate3d(-220px, 620px, 0); } }
        @keyframes waveNear { from { transform: translate3d(0,     690px, 0); } to { transform: translate3d(-200px, 690px, 0); } }

        /* Mousse au rivage : glisse doucement en X, Y fixe */
        .foam { filter: drop-shadow(0 2px 3px rgba(255,255,255,0.35)); animation: foamDrift 16s linear infinite; opacity: .95; }
        @keyframes foamDrift { from { transform: translate3d(0,     820px, 0); } to { transform: translate3d(-220px, 820px, 0); } }

        /* Oiseaux – traversent l’écran, petit flap par scaleY */
        .flock { opacity: 0; }
        .flock.f1 { animation: fly1 28s linear 2s infinite; }
        .flock.f2 { animation: fly2 32s linear 10s infinite; }

        .flock use {
          transform-origin: center;
          animation: flap 0.9s ease-in-out infinite;
        }
        .flock use:nth-child(2) { animation-delay: 0.1s; }
        .flock use:nth-child(3) { animation-delay: 0.2s; }
        .flock use:nth-child(4) { animation-delay: 0.3s; }

        @keyframes flap {
          0%,100% { transform: scaleY(1.00); }
          50%     { transform: scaleY(0.78); }
        }

        @keyframes fly1 {
          0%   { transform: translate(-150px, 190px); opacity: 0; }
          6%   { opacity: 0.95; }
          50%  { transform: translate(1150px, 160px); opacity: 0.95; }
          94%  { opacity: 0.95; }
          100% { transform: translate(1300px, 150px); opacity: 0; }
        }
        @keyframes fly2 {
          0%   { transform: translate(-150px, 240px) scale(0.9); opacity: 0; }
          8%   { opacity: 0.9; }
          50%  { transform: translate(1150px, 280px) scale(0.9); opacity: 0.9; }
          96%  { opacity: 0.9; }
          100% { transform: translate(1300px, 300px) scale(0.9); opacity: 0; }
        }

        /* Accessibilité */
        @media (prefers-reduced-motion: reduce) {
          .sun-group .sun,
          .sun-group circle:nth-child(2),
          .reflect-ripples,
          .waves.far, .waves.mid, .waves.near,
          .foam,
          .flock { animation: none !important; }
          .flock { opacity: 0.85; transform: translate(500px,220px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}

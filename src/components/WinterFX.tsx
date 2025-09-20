"use client";
import { useEffect, useState } from "react";

/**
 * WinterFX – neige qui tombe (3 profondeurs) + congères + 2 bonshommes de neige.
 * 100% CSS/SVG, pointer-events none, perf-friendly.
 */
export default function WinterFX() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(document.documentElement.getAttribute("data-theme") === "winter");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="winterfx" aria-hidden>
      <div className="sky" />
      {/* 3 couches de flocons */}
      <div className="snow l1" />
      <div className="snow l2" />
      <div className="snow l3" />

      {/* Sol neigeux + bonshommes (SVG) */}
      <svg className="ground" viewBox="0 0 1000 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ecf3ff" />
          </linearGradient>
        </defs>
        {/* congères douces */}
        <path d="M0,120 C120,100 200,150 320,130 C460,105 580,160 720,135 C820,115 880,145 1000,130 L1000,180 L0,180 Z"
              fill="url(#snowGrad)" />
        {/* ombre douce */}
        <path d="M0,140 C120,120 200,160 320,140 C460,115 580,170 720,145 C820,125 880,155 1000,140 L1000,180 L0,180 Z"
              fill="rgba(0,0,30,.06)" />

        {/* Snowman left */}
        <g transform="translate(120,40)">
          <circle cx="0" cy="90" r="32" fill="#fff" />
          <circle cx="0" cy="56" r="22" fill="#fff" />
          <circle cx="0" cy="30" r="14" fill="#fff" />
          <circle cx="-5" cy="28" r="2.8" fill="#2b2d42"/><circle cx="5" cy="28" r="2.8" fill="#2b2d42"/>
          <polygon points="0,34 18,30 0,26" fill="#ff7b00"/>
          <path d="M-24 60 q24 -18 48 0" fill="none" stroke="#2b2d42" strokeWidth="3" strokeLinecap="round"/>
          {/* bras */}
          <path d="M-18 56 l-18 -14" stroke="#6d4c41" strokeWidth="3" strokeLinecap="round"/>
          <path d="M18 56 l18 -14"   stroke="#6d4c41" strokeWidth="3" strokeLinecap="round"/>
          {/* bonnet */}
          <rect x="-12" y="12" width="24" height="6" rx="2" fill="#2b2d42"/>
          <rect x="-8"  y="0"  width="16" height="14" rx="3" fill="#3a86ff"/>
        </g>

        {/* Snowman right */}
        <g transform="translate(860,46) scale(0.9)">
          <circle cx="0" cy="90" r="32" fill="#fff" />
          <circle cx="0" cy="56" r="22" fill="#fff" />
          <circle cx="0" cy="30" r="14" fill="#fff" />
          <circle cx="-5" cy="28" r="2.8" fill="#2b2d42"/><circle cx="5" cy="28" r="2.8" fill="#2b2d42"/>
          <polygon points="0,34 18,30 0,26" fill="#ff7b00"/>
          <path d="M-22 60 q22 -16 44 0" fill="none" stroke="#2b2d42" strokeWidth="3" strokeLinecap="round"/>
          <path d="M-18 56 l-18 -14" stroke="#6d4c41" strokeWidth="3" strokeLinecap="round"/>
          <path d="M18 56 l18 -14"   stroke="#6d4c41" strokeWidth="3" strokeLinecap="round"/>
          <rect x="-12" y="12" width="24" height="6" rx="2" fill="#2b2d42"/>
          <rect x="-8"  y="0"  width="16" height="14" rx="3" fill="#ff006e"/>
        </g>
      </svg>

      <style jsx>{`
        .winterfx{position:absolute; inset:0; pointer-events:none; z-index:0;}
        .sky{
          position:absolute; inset:0 0 160px 0;
          background: linear-gradient(180deg,#b8d9ff 0%, #e7f1ff 60%, #ffffff 100%);
        }
        /* Flocons : 3 profondeurs (gros lents / moyens / micro rapides) */
        .snow{position:absolute; inset:0 0 160px 0; background-repeat:repeat; background-size:contain;}
        /* patterns générés en CSS (radial-gradients multiples) */
        .snow.l1{
          background-image:
            radial-gradient(3px 3px at 10% 5%, #fff, transparent 60%),
            radial-gradient(3px 3px at 30% 20%, #fff, transparent 60%),
            radial-gradient(3px 3px at 55% 10%, #fff, transparent 60%),
            radial-gradient(3px 3px at 80% 25%, #fff, transparent 60%),
            radial-gradient(3px 3px at 20% 55%, #fff, transparent 60%),
            radial-gradient(3px 3px at 70% 45%, #fff, transparent 60%);
          animation: fall1 14s linear infinite, sway1 6s ease-in-out infinite;
          opacity:.9;
        }
        .snow.l2{
          background-image:
            radial-gradient(2px 2px at 15% 15%, #fff, transparent 60%),
            radial-gradient(2px 2px at 40% 35%, #fff, transparent 60%),
            radial-gradient(2px 2px at 65% 15%, #fff, transparent 60%),
            radial-gradient(2px 2px at 75% 40%, #fff, transparent 60%),
            radial-gradient(2px 2px at 35% 60%, #fff, transparent 60%),
            radial-gradient(2px 2px at 85% 55%, #fff, transparent 60%);
          animation: fall2 18s linear infinite, sway2 7s ease-in-out infinite;
          opacity:.8;
        }
        .snow.l3{
          background-image:
            radial-gradient(1.4px 1.4px at 8% 8%, #fff, transparent 60%),
            radial-gradient(1.4px 1.4px at 22% 28%, #fff, transparent 60%),
            radial-gradient(1.4px 1.4px at 48% 14%, #fff, transparent 60%),
            radial-gradient(1.4px 1.4px at 70% 32%, #fff, transparent 60%),
            radial-gradient(1.4px 1.4px at 86% 18%, #fff, transparent 60%),
            radial-gradient(1.4px 1.4px at 60% 50%, #fff, transparent 60%),
            radial-gradient(1.4px 1.4px at 28% 48%, #fff, transparent 60%);
          animation: fall3 26s linear infinite, sway3 9s ease-in-out infinite;
          opacity:.75;
          filter: blur(.2px);
        }

        @keyframes fall1{ from{ background-position:0 -20vh, 0 -40vh, 0 -10vh, 0 -30vh, 0 -60vh, 0 -80vh }
                          to  { background-position:0  60vh, 0  40vh, 0  70vh, 0  50vh, 0  20vh, 0   0vh } }
        @keyframes fall2{ from{ background-position:0 -10vh, 0 -30vh, 0 -50vh, 0 -70vh, 0 -20vh, 0 -60vh }
                          to  { background-position:0  70vh, 0  50vh, 0  30vh, 0  10vh, 0  60vh, 0  20vh } }
        @keyframes fall3{ from{ background-position:0 -40vh, 0 -60vh, 0 -20vh, 0 -80vh, 0 -10vh, 0 -30vh, 0 -50vh }
                          to  { background-position:0  40vh, 0  20vh, 0  60vh, 0   0vh, 0  70vh, 0  50vh, 0  30vh } }

        @keyframes sway1{ 0%,100%{ transform:translateX(-1.5%) } 50%{ transform:translateX(1.5%) } }
        @keyframes sway2{ 0%,100%{ transform:translateX(1%) }    50%{ transform:translateX(-1%) } }
        @keyframes sway3{ 0%,100%{ transform:translateX(-.5%) }  50%{ transform:translateX(.5%) } }

        .ground{ position:absolute; left:0; right:0; bottom:0; height:160px; }
        @media (prefers-reduced-motion:reduce){
          .snow{ animation:none }
        }
      `}</style>
    </div>
  );
}

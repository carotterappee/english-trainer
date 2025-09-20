"use client";
import { useEffect, useState } from "react";

/**
 * WinterFX — neige qui tombe (3 couches) + sol enneigé + deux bonshommes.
 * Technique robuste : chaque couche a un ::before 200% de hauteur qui "défile"
 * en Y (transform) → aucune dépendance à background-position exotique.
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
      {/* chutes de neige (3 profondeurs) */}
      <div className="layer l1" />
      <div className="layer l2" />
      <div className="layer l3" />

      {/* Sol + bonshommes */}
      <svg className="ground" viewBox="0 0 1000 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ecf3ff" />
          </linearGradient>
        </defs>
        <path d="M0,120 C120,100 200,150 320,130 C460,105 580,160 720,135 C820,115 880,145 1000,130 L1000,180 L0,180 Z"
              fill="url(#snowGrad)" />
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
          <path d="M-18 56 l-18 -14" stroke="#6d4c41" strokeWidth="3" strokeLinecap="round"/>
          <path d="M18 56 l18 -14"   stroke="#6d4c41" strokeWidth="3" strokeLinecap="round"/>
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

        /* —— Neige robuste : chaque .layer a un ::before 200% de hauteur qui défile en Y —— */
        .layer{position:absolute; inset:0 0 160px 0; overflow:hidden;}
        .layer::before{
          content:""; position:absolute; left:-2%; top:-100%;
          width:104%; height:200%; will-change: transform;
          background-repeat:repeat; background-size:240px 240px;
        }

        /* Tuiles en SVG (points) — trois densités / tailles / opacités */
        .l1::before{
          background-image:url("data:image/svg+xml;utf8,\
            <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>\
              <g fill='white' opacity='0.95'>\
                <circle cx='12' cy='18' r='2.6'/> <circle cx='70' cy='8' r='2.6'/>\
                <circle cx='120' cy='30' r='2.8'/> <circle cx='180' cy='14' r='2.6'/>\
                <circle cx='30' cy='90' r='2.6'/> <circle cx='92' cy='70' r='2.6'/>\
                <circle cx='152' cy='92' r='2.6'/> <circle cx='210' cy='80' r='2.6'/>\
                <circle cx='20' cy='160' r='2.6'/> <circle cx='80' cy='140' r='2.6'/>\
                <circle cx='140' cy='170' r='2.6'/> <circle cx='200' cy='150' r='2.6'/>\
                <circle cx='50' cy='210' r='2.6'/> <circle cx='110' cy='200' r='2.6'/>\
                <circle cx='170' cy='220' r='2.6'/>\
              </g></svg>");
          animation: fall1 12s linear infinite, sway1 6s ease-in-out infinite;
        }
        .l2::before{
          background-image:url("data:image/svg+xml;utf8,\
            <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>\
              <g fill='white' opacity='0.85'>\
                <circle cx='18' cy='22' r='2'/> <circle cx='60' cy='40' r='2'/>\
                <circle cx='96' cy='18' r='2'/> <circle cx='140' cy='36' r='2'/>\
                <circle cx='200' cy='26' r='2'/> <circle cx='30' cy='110' r='2'/>\
                <circle cx='72' cy='90' r='2'/> <circle cx='118' cy='108' r='2'/>\
                <circle cx='165' cy='95' r='2'/> <circle cx='210' cy='120' r='2'/>\
                <circle cx='26' cy='188' r='2'/> <circle cx='88' cy='170' r='2'/>\
                <circle cx='140' cy='190' r='2'/> <circle cx='196' cy='176' r='2'/>\
              </g></svg>");
          animation: fall2 16s linear infinite, sway2 7s ease-in-out infinite;
        }
        .l3::before{
          background-image:url("data:image/svg+xml;utf8,\
            <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>\
              <g fill='white' opacity='0.75'>\
                <circle cx='12' cy='12' r='1.4'/> <circle cx='42' cy='30' r='1.4'/>\
                <circle cx='82' cy='16' r='1.4'/> <circle cx='120' cy='28' r='1.4'/>\
                <circle cx='160' cy='14' r='1.4'/> <circle cx='205' cy='22' r='1.4'/>\
                <circle cx='18' cy='86' r='1.4'/> <circle cx='64' cy='72' r='1.4'/>\
                <circle cx='104' cy='90' r='1.4'/> <circle cx='150' cy='76' r='1.4'/>\
                <circle cx='198' cy='92' r='1.4'/> <circle cx='36' cy='148' r='1.4'/>\
                <circle cx='86' cy='132' r='1.4'/> <circle cx='126' cy='150' r='1.4'/>\
                <circle cx='168' cy='136' r='1.4'/> <circle cx='206' cy='152' r='1.4'/>\
                <circle cx='56' cy='204' r='1.4'/> <circle cx='116' cy='196' r='1.4'/>\
                <circle cx='172' cy='210' r='1.4'/>\
              </g></svg>");
          animation: fall3 22s linear infinite, sway3 9s ease-in-out infinite;
          filter: blur(.2px);
        }

        /* chute : on fait défiler la tuile de -100% à 0%  */
        @keyframes fall1 { from { transform: translate3d(0,-100%,0); } to { transform: translate3d(0,0,0); } }
        @keyframes fall2 { from { transform: translate3d(0,-100%,0); } to { transform: translate3d(0,0,0); } }
        @keyframes fall3 { from { transform: translate3d(0,-100%,0); } to { transform: translate3d(0,0,0); } }

        /* léger balancement horizontal (sur left) pour la vie */
        @keyframes sway1 { 0%,100% { left:-2% } 50% { left:2% } }
        @keyframes sway2 { 0%,100% { left:1% }  50% { left:-1% } }
        @keyframes sway3 { 0%,100% { left:-.5% } 50% { left:.5% } }

        .ground{ position:absolute; left:0; right:0; bottom:0; height:160px; }

        @media (prefers-reduced-motion: reduce){
          .layer::before{ animation: none; }
        }
      `}</style>
    </div>
  );
}

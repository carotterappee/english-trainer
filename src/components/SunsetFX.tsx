"use client";
import { useEffect, useState } from "react";

export default function SunsetFX() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(document.documentElement.getAttribute("data-theme") === "sunset");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="sunsetfx pointer-events-none" aria-hidden>
      <div className="sun" />
      <div className="ocean">
        <div className="wave w1" />
        <div className="wave w2" />
        <div className="wave w3" />
        <div className="foam" />
      </div>
      <div className="shore" />
      <svg className="birds b1" viewBox="0 0 100 20" preserveAspectRatio="xMidYMid meet">
        <g className="flock">
          <path d="M5 10 q6 -6 12 0 M17 10 q6 -6 12 0 M29 10 q6 -6 12 0"
                fill="none" stroke="#3a2d55" strokeWidth="1.6" strokeLinecap="round"/>
        </g>
      </svg>
      <svg className="birds b2" viewBox="0 0 100 20" preserveAspectRatio="xMidYMid meet">
        <g className="flock">
          <path d="M5 12 q5 -5 10 0 M15 12 q5 -5 10 0 M25 12 q5 -5 10 0"
                fill="none" stroke="#3a2d55" strokeWidth="1.4" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
}

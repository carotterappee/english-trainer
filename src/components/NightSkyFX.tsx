"use client";
import { useEffect, useState, CSSProperties } from "react";

export default function NightSkyFX() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(document.documentElement.getAttribute("data-theme") === "night");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  if (!show) return null;

  // Utilitaire pour typer les variables CSS custom
  const shootingStyle = (vars: Record<string, string>): CSSProperties => vars as CSSProperties;

  return (
    <div className="nightfx pointer-events-none" aria-hidden>
      <div className="moon" />
      <div className="starfield l1" />
      <div className="starfield l2" />
      <div className="starfield l3" />
      {/* étoiles filantes, chacune avec des var CSS pour position/délais */}
      <div className="shooting" style={shootingStyle({"--delay":"4s",  "--top":"12%", "--left":"-15%", "--dur":"2.6s", "--rot":"18deg"})} />
      <div className="shooting" style={shootingStyle({"--delay":"17s", "--top":"28%", "--left":"-20%", "--dur":"2.2s", "--rot":"25deg"})} />
      <div className="shooting" style={shootingStyle({"--delay":"31s", "--top":"8%",  "--left":"-12%", "--dur":"2.4s", "--rot":"15deg"})} />
      <div className="shooting" style={shootingStyle({"--delay":"46s", "--top":"35%", "--left":"-18%", "--dur":"2.8s", "--rot":"20deg"})} />
    </div>
  );
}

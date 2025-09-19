"use client";
import { useState } from "react";
import { upsertToday } from "@/lib/progressStore";

export default function DoneToday() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // remplace par tes vrais calculs de session
    const score = (window as any).__sessionScore ?? 80;   // 0–100
    const minutes = (window as any).__sessionMinutes ?? 15;
    upsertToday({ score, minutes });
    setSaved(true);
  };

  return (
    <button
      onClick={handleSave}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl shadow-lg transition"
    >
      {saved ? "✅ Session sauvegardée" : "Enregistrer la session d’aujourd’hui"}
    </button>
  );
}

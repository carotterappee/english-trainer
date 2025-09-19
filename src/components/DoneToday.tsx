"use client";
import { useState } from "react";
import { upsertToday } from "@/lib/progressStore";

// Déclare proprement les variables attachées à window (optionnelles)
type WinWithSession = typeof window & {
  __sessionScore?: number;
  __sessionMinutes?: number;
};

export default function DoneToday() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const w = (typeof window !== "undefined" ? window : undefined) as
      | WinWithSession
      | undefined;

    // Valeurs par défaut si tu n'as pas encore de vrai calcul
    const score: number = w?.__sessionScore ?? 80;   // 0–100
    const minutes: number = w?.__sessionMinutes ?? 15;

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

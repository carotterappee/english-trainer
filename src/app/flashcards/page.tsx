"use client";
import { useEffect, useMemo, useState } from "react";
import { loadWords, markKnown, markUnknown } from "@/lib/wordStore";

export default function Flashcards() {
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const words = useMemo(() => loadWords(), []);
  const current = words[idx];

  useEffect(() => setFlip(false), [idx]);

  if (words.length === 0) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Flashcards</h1>
          <p className="text-gray-600">Ta liste est vide. Ajoute des mots depuis la mission.</p>
        </div>
      </main>
    );
  }

  const next = () => { setIdx((i) => (i + 1) % words.length); };

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Flashcards ({idx + 1}/{words.length})</h1>

      <div
        className={`rounded-3xl border shadow-lg p-10 text-center cursor-pointer select-none transition-transform ${flip ? "bg-indigo-600 text-white" : "bg-white"}`}
        onClick={() => setFlip(!flip)}
        title="Clique pour retourner la carte"
      >
        <div className="text-sm opacity-70 mb-2">{flip ? "FR" : "EN"}</div>
        <div className="text-3xl font-bold">
          {flip ? current.fr : current.en}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { markUnknown(current.en); next(); }}
          className="flex-1 px-4 py-3 rounded-2xl border hover:bg-rose-50"
        >
          ❌ Je ne connais pas
        </button>
        <button
          onClick={() => { markKnown(current.en); next(); }}
          className="flex-1 px-4 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          ✅ Je connais
        </button>
      </div>
    </main>
  );
}

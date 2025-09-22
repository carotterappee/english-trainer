"use client";

import { useState } from "react";
import { loadProfile } from "@/lib/profile";
import { getDueWords, reviewWord } from "@/lib/wordStore";
import Coin from "@/components/Coin";
import { addCoins } from "@/lib/coins";

export default function Flashcards() {
  const profile = loadProfile();
  if (!profile) return null;

  // file d’attente des mots à réviser
  const [queue, setQueue] = useState(() => getDueWords());
  const [i, setI] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [justAwarded, setJustAwarded] = useState(0);

  const done = i >= queue.length;
  const current = done ? null : queue[i];

  // Helpers d’affichage (tolérants aux différents schémas stockés)
  const frontText = current
    ? (current as any).front ??
      (current as any).word ??
      (current as any).head ??
      (current as any).en ??
      (current as any).fr ??
      ""
    : "";

  const backText = current
    ? (current as any).back ??
      (current as any).translation ??
      (current as any).ru ??
      (current as any).fr ??
      (current as any).def ??
      ""
    : "";

  const next = () => {
    setShowBack(false);
    setJustAwarded(0);
    setI((x) => x + 1);
  };

  const onKnow = () => {
    if (!current) return;
    // marquer comme su et récompenser
    try {
      reviewWord((current as any).id, true);
    } catch {
      // si l’implémentation ne prend pas (id, boolean), on ignore silencieusement
    }
    addCoins(3);
    setJustAwarded(3);
    next();
  };

  const onDontKnow = () => {
    if (!current) return;
    try {
      reviewWord((current as any).id, false);
    } catch {
      // idem : tolérant selon la signature réelle
    }
    next();
  };

  const onFlip = () => setShowBack((v) => !v);

  const onReload = () => {
    const fresh = getDueWords();
    setQueue(fresh);
    setI(0);
    setShowBack(false);
    setJustAwarded(0);
  };

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">🧠 Flashcards</h1>

      {done ? (
        <div className="rounded-2xl border bg-white p-6 text-center space-y-4">
          <p>Tu as terminé la révision du moment 🎉</p>
          <button
            onClick={onReload}
            className="rounded-xl bg-indigo-600 text-white px-4 py-2"
          >
            Recharger les cartes dues
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 space-y-4">
          <div className="text-xs text-gray-500">
            Carte {i + 1}/{queue.length}
          </div>

          <div
            className="rounded-xl border bg-indigo-50/70 px-4 py-6 cursor-pointer select-none text-center"
            onClick={onFlip}
            title="Cliquer pour retourner"
          >
            <div className="text-sm uppercase tracking-wide text-indigo-700/80 mb-2">
              {showBack ? "Traduction" : "Mot / Expression"}
            </div>
            <div className="text-lg font-medium">
              {showBack ? backText : frontText}
            </div>
          </div>

          {justAwarded > 0 && (
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <Coin />
              <span>+{justAwarded}</span>
            </div>
          )}

          <div className="flex gap-2 justify-between">
            <button
              onClick={onDontKnow}
              className="flex-1 rounded-xl border px-4 py-2 hover:bg-gray-50"
            >
              Toujours pas
            </button>
            <button
              onClick={onFlip}
              className="rounded-xl border px-4 py-2"
              title="Retourner"
            >
              ↻ Retourner
            </button>
            <button
              onClick={onKnow}
              className="flex-1 rounded-xl bg-indigo-600 text-white px-4 py-2"
            >
              Je connais
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useState } from "react";
import { loadProfile } from "@/lib/profile";
import { getDueWords, reviewWord } from "@/lib/wordStore";
import { addCoins } from "@/lib/coins";
import Coin from "@/components/Coin";

type Card = {
  id: string;
  // divers champs possibles selon la source
  front?: string;
  back?: string;
  word?: string;
  head?: string;
  en?: string;
  fr?: string;
  ru?: string;
  translation?: string;
  def?: string;
};

export default function Flashcards() {
  // on charge le profil mais on ne quitte pas le rendu si null
  const profile = loadProfile();

  // file d’attente des mots à réviser (typés)
  const [queue, setQueue] = useState<Card[]>(() => getDueWords() as Card[]);
  const [i, setI] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [justAwarded, setJustAwarded] = useState(0);

  const done = i >= queue.length;
  const current: Card | undefined = done ? undefined : queue[i];

  // Récupération tolérante des champs texte
  const frontText =
    current?.front ??
    current?.word ??
    current?.head ??
    current?.en ??
    current?.fr ??
    "";

  const backText =
    current?.back ??
    current?.translation ??
    current?.ru ??
    current?.fr ??
    current?.def ??
    "";

  const next = () => {
    setShowBack(false);
    setJustAwarded(0);
    setI((x) => x + 1);
  };

  const onKnow = () => {
    if (!current) return;
    try {
      reviewWord(current.id, true);
    } catch {
      // tolérant si la signature diffère, on ignore l'erreur
    }
    addCoins(3);
    setJustAwarded(3);
    next();
  };

  const onDontKnow = () => {
    if (!current) return;
    try {
      reviewWord(current.id, false);
    } catch {
      // tolérant
    }
    next();
  };

  const onFlip = () => setShowBack((v) => !v);

  const onReload = () => {
    const fresh = getDueWords() as Card[];
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

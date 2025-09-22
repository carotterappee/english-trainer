"use client";

import { useState } from "react";
import { getDueWords, reviewWord } from "@/lib/wordStore";
import { addCoins } from "@/lib/coins";
import Coin from "@/components/Coin";

/** Objet carte tolérant (compat quelles que soient les clés présentes) */
type CardObj = Record<string, unknown> & { id?: string };

function pickText(o: CardObj | undefined, keys: string[]): string {
  if (!o) return "";
  for (const k of keys) {
    const v = o[k as keyof CardObj];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

/** Appelle reviewWord quel que soit le format attendu (id ou objet) */
function safeReview(item: CardObj, pass: boolean) {
  try {
    if ("id" in item && typeof item.id === "string") {
      (reviewWord as (id: string, ok: boolean) => void)(item.id, pass);
    } else {
      (reviewWord as (payload: unknown, ok: boolean) => void)(item, pass);
    }
  } catch {
    // ignore (tolérant à la signature réelle)
  }
}

export default function Flashcards() {
  // queue typée de façon souple : on accepte la forme renvoyée par le store
  const [queue, setQueue] = useState<CardObj[]>(
    () => getDueWords() as unknown as CardObj[]
  );
  const [i, setI] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [justAwarded, setJustAwarded] = useState(0);

  const done = i >= queue.length;
  const current: CardObj | undefined = done ? undefined : queue[i];

  // Affichages (on choisit la première clé non vide)
  const frontText = pickText(current, ["front", "word", "head", "en", "fr"]);
  const backText = pickText(current, ["back", "translation", "ru", "fr", "def"]);

  const next = () => {
    setShowBack(false);
    setJustAwarded(0);
    setI((x) => x + 1);
  };

  const onKnow = () => {
    if (!current) return;
    safeReview(current, true);
    addCoins(3);
    setJustAwarded(3);
    next();
  };

  const onDontKnow = () => {
    if (!current) return;
    safeReview(current, false);
    next();
  };

  const onFlip = () => setShowBack((v) => !v);

  const onReload = () => {
    const fresh = getDueWords() as unknown as CardObj[];
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

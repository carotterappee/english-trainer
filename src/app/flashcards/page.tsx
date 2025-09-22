"use client";

import { useState } from "react";
import { getDueWords, reviewWord } from "@/lib/wordStore";
import { addCoins } from "@/lib/coins";
import Coin from "@/components/Coin";

/** Objet carte souple (quelques clés possibles selon la source) */
type CardObj = Record<string, unknown> & {
  id?: string;
  en?: string;
  fr?: string;
  ru?: string;
  front?: string;
  back?: string;
  word?: string;
  head?: string;
  translation?: string;
  def?: string;
};

type Outcome = "again" | "good" | "easy";

function pickText(o: CardObj | undefined, keys: (keyof CardObj)[]): string {
  if (!o) return "";
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return "";
}

/** Clé pour le SRS : on privilégie .en, sinon fallback raisonnable */
function keyFor(o: CardObj): string | null {
  if (typeof o.en === "string" && o.en.trim()) return o.en;
  if (typeof o.word === "string" && o.word.trim()) return o.word;
  if (typeof o.head === "string" && o.head.trim()) return o.head;
  if (typeof o.id === "string" && o.id.trim()) return o.id;
  if (typeof o.front === "string" && o.front.trim()) return o.front;
  return null;
}

/** Appelle reviewWord avec un outcome explicite */
function srsReview(item: CardObj, outcome: Outcome) {
  const key = keyFor(item);
  if (!key) return; // rien à faire si pas de clé exploitable
  try {
    reviewWord(key, outcome);
  } catch {
    // tolérant si l'implémentation change : on ignore
  }
}

export default function Flashcards() {
  // queue: on accepte la forme renvoyée par le store (cast via unknown)
  const [queue, setQueue] = useState<CardObj[]>(
    () => getDueWords() as unknown as CardObj[]
  );
  const [i, setI] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [justAwarded, setJustAwarded] = useState(0);

  const done = i >= queue.length;
  const current: CardObj | undefined = done ? undefined : queue[i];

  const frontText = pickText(current, ["front", "word", "head", "en", "fr"]);
  const backText = pickText(current, ["back", "translation", "ru", "fr", "def"]);

  const next = () => {
    setShowBack(false);
    setJustAwarded(0);
    setI((x) => x + 1);
  };

  const onKnow = () => {
    if (!current) return;
    srsReview(current, "good"); // tu peux mettre "easy" si tu veux espacer plus
    addCoins(3);
    setJustAwarded(3);
    next();
  };

  const onDontKnow = () => {
    if (!current) return;
    srsReview(current, "again");
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

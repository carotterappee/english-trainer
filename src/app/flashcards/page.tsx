import { selectedCats, catsKey } from "@/lib/profile";
"use client";
import { useEffect, useMemo, useState } from "react";
import { getDueWords, reviewWord, loadWords } from "@/lib/wordStore";
import Coin from "@/components/Coin";
import { addCoins, loadWallet } from "@/lib/coins";
import { loadProfile } from "@/lib/profile";

type Outcome = "again" | "good" | "easy";

export default function Flashcards() {
  const profile = loadProfile();
  const goalForCoins = catsKey(profile); // ex: "everyday" ou "everyday+work"

  const [modeAll, setModeAll] = useState(false);
  const due = useMemo(() => getDueWords(), []);
  const all = useMemo(() => loadWords(), []);
  const list = modeAll ? all : due;

  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [balance, setBalance] = useState(loadWallet().balance);

  const current = list[idx];
  useEffect(() => setFlip(false), [idx, modeAll]);

  if (!current) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold">Flashcards</h1>
          <p className="text-gray-600">
            {modeAll ? "Aucun mot dans la liste." : "Rien à revoir aujourd’hui ✅"}
          </p>
          {(!modeAll && all.length > 0) && (
            <button onClick={() => setModeAll(true)} className="rounded-2xl border px-3 py-2 hover:bg-indigo-50">
              Parcourir tous les mots
            </button>
          )}
        </div>
      </main>
    );
  }

  const next = () => setIdx((i) => (i + 1) % list.length);

  const awardFor = (kind: Outcome) => (kind === "good" ? 1 : kind === "easy" ? 2 : 0);

  const mark = (kind: Outcome) => {
    const award = awardFor(kind);
    if (award > 0) {
      addCoins(award, goalForCoins);             // ajoute au coffre + historique
      setSessionCoins((c) => c + award);         // compteur session
      setBalance(loadWallet().balance);          // rafraîchir le solde affiché
    }
    reviewWord(current.en, kind);                // met à jour la planif SRS
    next();
  };

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Flashcards</h1>
        <div className="text-sm text-gray-500">
          {modeAll ? `${idx + 1}/${list.length}` : `À revoir: ${due.length}`}
        </div>
      </div>

      {/* Solde & pièces gagnées cette session */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Coin size={18} />
          <span className="font-medium">{balance}</span>
          <span className="text-gray-500">pièces</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Coin size={18} />
          <span className="text-gray-700">session +{sessionCoins}</span>
        </div>
      </div>

      <div
        className={`rounded-3xl border shadow-lg p-10 text-center cursor-pointer select-none transition-transform ${
          flip ? "bg-indigo-600 text-white" : "bg-white"
        }`}
        onClick={() => setFlip(!flip)}
        title="Clique pour retourner la carte"
      >
        <div className="text-sm opacity-70 mb-2">{flip ? "FR" : "EN"}</div>
        <div className="text-3xl font-bold">{flip ? current.fr : current.en}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => mark("again")} className="rounded-2xl border py-2 hover:bg-rose-50">↩️ Again</button>
        <button onClick={() => mark("good")}  className="rounded-2xl bg-emerald-600 text-white py-2">✅ Good (+1)</button>
        <button onClick={() => mark("easy")}  className="rounded-2xl border py-2 hover:bg-indigo-50">🌟 Easy (+2)</button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>“Good/Easy” te donne des pièces et espace les révisions (1→3→7→14→30→60j).</span>
      </div>

      <div className="text-center">
        <button
          onClick={() => setModeAll((m) => !m)}
          className="rounded-2xl border px-3 py-2 hover:bg-indigo-50"
        >
          {modeAll ? "Revenir aux mots à revoir" : "Voir tous les mots"}
        </button>
      </div>
    </main>
  );
}

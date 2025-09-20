"use client";
import { loadProfile } from "@/lib/profile";
import { clearSeen } from "@/lib/seenStore";

export default function Settings() {
  const p = loadProfile();

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Réglages</h1>

      {p && (
        <div className="space-y-2 p-4 rounded-2xl border">
          <p>Variante : <b>{p.variant}</b></p>
          <p>Objectif : <b>{p.goal}</b></p>
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => { localStorage.removeItem("userProfile:v1"); location.reload(); }}
              className="px-4 py-2 rounded-2xl border hover:bg-rose-50"
            >
              ❌ Oublier ce profil
            </button>
            <button
              onClick={() => { clearSeen(p.goal); location.reload(); }}
              className="px-4 py-2 rounded-2xl border hover:bg-indigo-50"
            >
              ♻️ Réinitialiser les phrases de ce thème
            </button>
            <button
              onClick={() => { clearSeen(); location.reload(); }}
              className="px-4 py-2 rounded-2xl border hover:bg-indigo-50"
            >
              🧼 Réinitialiser tout l’historique
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

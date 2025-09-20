"use client";
// Sauvegarde/Restaurer
function exportData() {
  const keys = [
    "userProfile:v1","wallet:v1","wallet:v2",
    "myWords:v1","seen:v1",
    "themes:owned:v1","themes:selected:v1","dict:cache:v1"
  ];
  const data: Record<string,string|null> = {};
  keys.forEach(k => data[k] = localStorage.getItem(k));
  const blob = new Blob([JSON.stringify(data,null,2)], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "english-trainer-backup.json"; a.click();
  URL.revokeObjectURL(url);
}

async function importData(file: File) {
  const text = await file.text();
  const data = JSON.parse(text) as Record<string,string|null>;
  Object.entries(data).forEach(([k,v]) => { if (typeof v === "string") localStorage.setItem(k, v); });
  location.reload();
}
const ONLINE_KEY = "dict:fallbackOnline:v1";
function getOnlineFlag(){ if (typeof window==="undefined") return true; return localStorage.getItem(ONLINE_KEY)!=="0"; }
function setOnlineFlag(v:boolean){ localStorage.setItem(ONLINE_KEY, v ? "1" : "0"); }
import { useState } from "react";
import { loadProfile } from "@/lib/profile";
import { clearSeen } from "@/lib/seenStore";

export default function Settings() {
  const p = loadProfile();
  const [online, setOnline] = useState(getOnlineFlag());

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Réglages</h1>

      <div className="space-y-4 p-4 rounded-2xl border">
        <div className="flex gap-3 mb-2">
          <button
            className="px-4 py-2 rounded-2xl border hover:bg-indigo-50"
            onClick={exportData}
          >
            💾 Sauvegarder
          </button>
          <label className="px-4 py-2 rounded-2xl border hover:bg-rose-50 cursor-pointer">
            📂 Restaurer
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) importData(f);
              }}
            />
          </label>
        </div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={online}
            onChange={(e)=>{ setOnline(e.target.checked); setOnlineFlag(e.target.checked); }}
          />
          Utiliser le fallback en ligne si le mot n’est pas dans le dico
        </label>
      </div>

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

"use client";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/profile_store";
import type { Goal } from "@/lib/profile";

const ALL_CATS: Goal[] = ["everyday", "travel", "work", "exams", "boost"];


export default function SelectProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = getProfile();
  const [cats, setCats] = useState<Goal[]>(
    profile.categories?.length ? profile.categories : (profile.goal ? [profile.goal] : ["everyday"])
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  const toggle = (g: Goal) =>
    setCats(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const save = () => {
    const unique = Array.from(new Set(cats)).sort();
    updateProfile({ ...profile, categories: unique });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-center mb-4">Catégories</h2>
        <div className="grid grid-cols-2 gap-2">
          {ALL_CATS.map(g => (
            <label key={g}
              className={`cursor-pointer rounded-xl border px-3 py-2 flex items-center gap-2
                ${cats.includes(g) ? "bg-indigo-50 border-indigo-300" : "bg-white"}`}>
              <input type="checkbox" className="accent-indigo-600"
                     checked={cats.includes(g)} onChange={() => toggle(g)} />
              <span className="capitalize">
                {g === "everyday" ? "Vie Quotidienne" :
                 g === "travel"   ? "Voyage" :
                 g === "work"     ? "Travail" :
                 g === "exams"    ? "Examens" : "Boost"}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 rounded-xl border">Annuler</button>
          <button onClick={save} className="px-3 py-2 rounded-xl bg-indigo-600 text-white">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

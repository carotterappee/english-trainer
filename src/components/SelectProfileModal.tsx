"use client";
import { useState } from "react";
import { getProfile, updateProfile } from "@/lib/profile_store";
import type { Goal } from "@/lib/profile";

const ALL_CATS: Goal[] = ["everyday", "travel", "work", "exams", "boost"];

export default function SelectProfileModal({ onClose }: { onClose: () => void }) {
  const profile = getProfile();
  const [cats, setCats] = useState<Goal[]>(
    profile.categories?.length ? profile.categories : (profile.goal ? [profile.goal] : ["everyday"])
  );

  const toggle = (g: Goal) =>
    setCats(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const save = () => {
    const unique = Array.from(new Set(cats)).sort();
    updateProfile({ ...profile, categories: unique });
    onClose();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Catégories</h2>
      <div className="grid grid-cols-2 gap-2">
        {ALL_CATS.map((g) => (
          <label key={g} className={`cursor-pointer rounded-xl border px-3 py-2 flex items-center gap-2
            ${cats.includes(g) ? "bg-indigo-50 border-indigo-300" : "bg-white"}`}>
            <input type="checkbox" className="accent-indigo-600"
              checked={cats.includes(g)} onChange={() => toggle(g)} />
            <span className="capitalize">
              {g === "everyday" ? "Vie quotidienne" :
               g === "travel"   ? "Voyage" :
               g === "work"     ? "Travail" :
               g === "exams"    ? "Examens" : "Boost"}
            </span>
          </label>
        ))}
      </div>

      {/* Ancien bloc US/UK retiré */}

      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="px-3 py-2 rounded-xl border">Annuler</button>
        <button onClick={save} className="px-3 py-2 rounded-xl bg-indigo-600 text-white">Enregistrer</button>
      </div>

    </div>
  );
}

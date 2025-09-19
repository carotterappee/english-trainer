"use client";
import { useState } from "react";
import { createProfile, EnglishVariant, Goal } from "@/lib/profile";

export default function SelectProfileModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void; // appelé après avoir créé le profil
}) {
  const [variant, setVariant] = useState<EnglishVariant>("british");
  const [goal, setGoal] = useState<Goal>("everyday");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-5">
        <h2 className="text-xl font-semibold text-indigo-700">Choisis ton anglais</h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Variante :</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setVariant("british")}
              className={`px-4 py-3 rounded-2xl border ${variant==="british" ? "border-indigo-600 bg-indigo-50" : "hover:bg-gray-50"}`}
            >🇬🇧 Britannique</button>
            <button
              onClick={() => setVariant("american")}
              className={`px-4 py-3 rounded-2xl border ${variant==="american" ? "border-indigo-600 bg-indigo-50" : "hover:bg-gray-50"}`}
            >🇺🇸 Américain</button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Pour quoi faire :</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["everyday","Vie quotidienne"],
              ["travel","Voyage"],
              ["work","Travail / réunions"],
              ["exams","Examens (A2/B1)"],
            ].map(([val,label])=>(
              <button key={val}
                onClick={()=>setGoal(val as Goal)}
                className={`px-4 py-3 rounded-2xl border ${goal===val ? "border-indigo-600 bg-indigo-50" : "hover:bg-gray-50"}`}
              >{label}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              createProfile(variant, goal);
              onDone();
            }}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl"
          >
            ✅ Valider et continuer
          </button>
          <button onClick={onClose} className="px-4 py-3 rounded-2xl border">
            Annuler
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Ton choix est mémorisé sur cet appareil (localStorage). Tu pourras le changer dans ⚙️ Réglages.
        </p>
      </div>
    </div>
  );
}

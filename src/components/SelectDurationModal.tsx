"use client";
import { useEffect, useState } from "react";
import { preferredDurationMin } from "@/lib/session";

export default function SelectDurationModal({
  open, onClose, onStart,
}: { open: boolean; onClose: () => void; onStart: (minutes: number) => void }) {
  const [m, setM] = useState(15);
  useEffect(() => { if (open) setM(preferredDurationMin()); }, [open]);

  if (!open) return null;

  const Opt = ({ v, label }: { v: number; label: string }) => (
    <button
      onClick={() => setM(v)}
      className={`px-4 py-2 rounded-2xl border ${m===v ? "border-indigo-600 bg-indigo-50" : "hover:bg-gray-50"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border bg-white shadow-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Durée de la mission</h2>
        <div className="flex flex-wrap gap-2">
          <Opt v={5}  label="5 min" />
          <Opt v={10} label="10 min" />
          <Opt v={15} label="15 min" />
          <Opt v={20} label="20 min" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={() => onStart(m)} className="flex-1 rounded-2xl bg-indigo-600 text-white py-2">Démarrer</button>
          <button onClick={onClose} className="rounded-2xl border py-2 px-3 hover:bg-gray-50">Annuler</button>
        </div>
        <p className="text-xs text-gray-500">Plus longue → plus d’exercices proposés pendant le temps imparti.</p>
      </div>
    </div>
  );
}

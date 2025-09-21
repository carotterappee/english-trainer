"use client";
import { useEffect, useState } from "react";
import PrettySelect from "@/components/PrettySelect";
import { saveProfile, loadProfile, hasProfile,
         type EnglishVariant, type Goal, type UserProfile } from "@/lib/profile";

export default function SelectProfileModal({
  open, onClose, onDone,
}: { open: boolean; onClose: () => void; onDone: () => void }) {
  // valeurs par défaut (si profil existe déjà)
  const existing = (typeof window !== "undefined" ? loadProfile() : null);
  const [course, setCourse] = useState<"en"|"fr">(existing?.course ?? "en");
  const [answerLang, setAnswerLang] = useState<"fr"|"ru">(existing?.answerLang ?? "fr");
  const [variant, setVariant] = useState<EnglishVariant>(existing?.variant ?? "british");
  // Sélection multiple de catégories (checkboxes)
  const ALL_CATS: Goal[] = ["everyday", "travel", "work", "exams"];
  const [cats, setCats] = useState<Goal[]>(
    () => existing?.categories?.length ? existing.categories : (existing?.goal ? [existing.goal] : ["everyday"])
  );

  function toggleCat(g: Goal) {
    setCats(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  }

  useEffect(() => {
    // si on change de cours vers FR, forcer answerLang visible
    if (course === "fr" && !["fr","ru"].includes(answerLang)) setAnswerLang("ru");
  }, [course, answerLang]);

  if (!open) return null;

  const save = () => {
    const base = existing ?? {
      deviceId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const uniqueSorted = Array.from(new Set(cats)).sort();
    saveProfile({
      ...base,
      course,
      answerLang,
      variant,
      categories: uniqueSorted,
      // on peut ignorer goal désormais
    });
    onClose();
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border bg-white shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Bienvenue !</h2>
        </div>

        <p className="text-sm text-gray-600">
          Dis-moi <b>ta langue de réponse</b> et ce que tu veux <b>apprendre</b>.
        </p>

        <div className="grid gap-4">
          <PrettySelect
            id="spoken"
            label="Je parle (je répondrai en…)"
            value={answerLang}
            onChange={(v) => setAnswerLang(v as "fr"|"ru")}
            options={[
              { value: "fr", label: "Français", emoji: "🇫🇷" },
              { value: "ru", label: "Русский (russe)", emoji: "🇷🇺" },
            ]}
            hint="Ta langue pour écrire les réponses."
          />

          <PrettySelect
            id="course"
            label="Je veux apprendre"
            value={course}
            onChange={(v) => setCourse(v as "en"|"fr")}
            options={[
              { value: "en", label: "Anglais", emoji: "🇬🇧" },
              { value: "fr", label: "Français", emoji: "🇫🇷" },
            ]}
          />

          {course === "en" && (
            <PrettySelect
              id="variant"
              label="Variante d’anglais"
              value={variant}
              onChange={(v) => setVariant(v as EnglishVariant)}
              options={[
                { value: "british", label: "Anglais britannique", emoji: "🇬🇧" },
                { value: "american", label: "Anglais américain", emoji: "🇺🇸" },
              ]}
            />
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium mb-1">Catégories</div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_CATS.map(g => (
                <label key={g} className={`cursor-pointer rounded-xl border px-3 py-2 flex items-center gap-2
                   ${cats.includes(g) ? "bg-indigo-50 border-indigo-300" : "bg-white"}`}>
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    checked={cats.includes(g)}
                    onChange={() => toggleCat(g)}
                  />
                  <span className="capitalize">
                    {g === "everyday" ? "Vie quotidienne" :
                     g === "travel"   ? "Voyage" :
                     g === "work"     ? "Travail" : "Examens"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 rounded-2xl bg-indigo-600 text-white py-2 hover:bg-indigo-700">
            C’est parti 🚀
          </button>
          {hasProfile() && (
            <button onClick={onClose} className="rounded-2xl border py-2 px-3 hover:bg-gray-50">
              Plus tard
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Astuce : chaque appareil garde son profil en mémoire (pas de compte requis).
        </p>
      </div>
    </div>
  );
}

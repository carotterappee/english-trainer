
"use client";
import { useEffect, useState } from "react";
import PrettySelect from "@/components/PrettySelect";
import { loadProfile, saveProfile, type EnglishVariant, type Goal } from "@/lib/profile";

export default function SettingsPage() {
  const p = loadProfile();
  const [course, setCourse] = useState<"en"|"fr">(p?.course ?? "en");
  const [answerLang, setAnswerLang] = useState<"fr"|"ru">(p?.answerLang ?? "fr");
  const [variant, setVariant] = useState<EnglishVariant>(p?.variant ?? "british");
  const [goal, setGoal] = useState<Goal>(p?.goal ?? "everyday");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSaved(false); }, [course, answerLang, variant, goal]);

  const save = () => {
    if (!p) return;
  saveProfile({ ...p, course, answerLang, variant, goal });
    setSaved(true);
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Réglages</h1>

      <div className="p-6 rounded-3xl border bg-white space-y-4">
        <PrettySelect
          id="spoken"
          label="Je parle (je répondrai en…)"
          value={answerLang}
          onChange={(v)=>setAnswerLang(v as "fr"|"ru")}
          options={[
            { value: "fr", label: "Français", emoji: "🇫🇷" },
            { value: "ru", label: "Русский (russe)", emoji: "🇷🇺" },
          ]}
        />

        <PrettySelect
          id="course"
          label="Je veux apprendre"
          value={course}
          onChange={(v)=>setCourse(v as "en"|"fr")}
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
            onChange={(v)=>setVariant(v as EnglishVariant)}
            options={[
              { value: "british", label: "Anglais britannique", emoji: "🇬🇧" },
              { value: "american", label: "Anglais américain", emoji: "🇺🇸" },
            ]}
          />
        )}

        <PrettySelect
          id="goal"
          label="Objectif"
          value={goal}
          onChange={(v)=>setGoal(v as Goal)}
          options={[
            { value: "everyday", label: "Vie quotidienne", emoji: "🏠" },
            { value: "travel", label: "Voyage", emoji: "🧳" },
            { value: "work", label: "Travail", emoji: "💼" },
            { value: "exams", label: "Examens", emoji: "📝" },
          ]}
        />

        <div className="flex gap-3 pt-2">
          <button onClick={save} className="rounded-2xl bg-indigo-600 text-white px-4 py-2">💾 Enregistrer</button>
          {saved && <span className="self-center text-emerald-700">✅ Sauvegardé</span>}
        </div>
      </div>
    </main>
  );
}

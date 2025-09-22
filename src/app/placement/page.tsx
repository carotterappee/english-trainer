"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/profile_store";
import P_EN, { PlaceEN } from "@/content/placement_en";
import P_FR, { PlaceFR } from "@/content/placement_fr";
import { savePlacement, scoreToCEFR } from "@/lib/placement";
import { answersEqual } from "@/lib/textUtils";

type Item = PlaceEN | PlaceFR;

export default function PlacementPage() {
  const router = useRouter();
  const profile = getProfile();
  const course = (profile.course ?? "en") as "en" | "fr";

  // Liste typée d’items selon la langue du cours
  const items: Item[] =
    course === "en" ? (P_EN as PlaceEN[]) : (P_FR as PlaceFR[]);

  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [tries, setTries] = useState(0);
  const [goodFirst, setGoodFirst] = useState(0);
  const [goodTotal, setGoodTotal] = useState(0);

  const current = items[i];

  // attendu + alternatives, typés sans `any`
  const expected: string =
    course === "en"
      ? (current as PlaceEN).fr
      : (current as PlaceFR).ru;

  const alts: string[] =
    "alts" in current && current.alts ? current.alts : [];

  function check() {
    const ok = [expected, ...alts].some((v) => answersEqual(input, v));
    if (ok) {
      if (tries === 0) setGoodFirst((x) => x + 1);
      setGoodTotal((x) => x + 1);
      next();
    } else {
      setTries((t) => t + 1);
    }
  }

  function next() {
    setTries(0);
    setInput("");
    if (i + 1 < items.length) setI(i + 1);
    else finish();
  }

  function finish() {
    // score simple : 1er coup vaut double
    const scoreRaw = goodFirst * 8 + (goodTotal - goodFirst) * 4; // max ~96
    const score = Math.min(100, Math.max(0, Math.round(scoreRaw)));
    const cefr = scoreToCEFR(score);

    savePlacement({ course, score, cefr, date: new Date().toISOString() });
    updateProfile({ ...profile, cefr });
    router.replace("/?placed=1");
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Trouver son niveau</h1>
      <p className="text-sm text-gray-600">
        12 phrases, sans aide. Appuie sur Entrée pour valider.
      </p>

      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <div className="text-xs text-gray-500">
          Item {i + 1}/{items.length}
        </div>
        <div className="text-lg font-medium">
          {course === "en"
            ? (current as PlaceEN).en
            : (current as PlaceFR).fr}
        </div>
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder={
            course === "en"
              ? "Réponse en français..."
              : "Ответ по-русски..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={check}
            className="rounded-xl bg-indigo-600 text-white px-4 py-2"
          >
            Valider
          </button>
          {tries > 0 && (
            <span className="text-sm text-rose-600">❌ Réessaye</span>
          )}
        </div>
      </div>
    </main>
  );
}

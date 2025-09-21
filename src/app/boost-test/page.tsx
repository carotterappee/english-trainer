"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { answersEqual, normalizeAnswer } from "@/lib/textUtils";
import { selectedCats, catsKey } from "@/lib/profile";
import { loadProfile } from "@/lib/profile";
import testEn, { BoostItemEN } from "@/content/boost_test_en";
import testFr, { BoostItemFR } from "@/content/boost_test_fr";
import { computePlacement, savePlacement } from "@/lib/boost";

export default function BoostTestPage() {
  const router = useRouter();
  const profile = loadProfile();
  // Initialisation des hooks d'état AVANT tout return
  const course = (profile?.course ?? "en") as "en"|"fr";
  const cats = ["boost"];
  const key = "boost";
  const items: (BoostItemEN | BoostItemFR)[] = course === "en" ? testEn : testFr;
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [tries, setTries] = useState(0);
  const [goodFirst, setGoodFirst] = useState(0);
  const [goodTotal, setGoodTotal] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const t0 = useRef<number>(Date.now());
  // Après tous les hooks, on peut faire le return conditionnel
  if (!profile) return null;

  const current = items[i] as BoostItemEN | BoostItemFR;
  const expected = course === "en"
    ? (current as BoostItemEN).fr
    : (current as BoostItemFR).ru;
  const alts = ("alts" in current && Array.isArray(current.alts)) ? current.alts : [];

  const check = () => {
    const ok = [expected, ...alts].some(v => answersEqual(input, v));
    const dt = (Date.now() - t0.current)/1000;
    setTimes(prev => [...prev, dt]);
    if (ok) {
      if (tries === 0) setGoodFirst(x => x + 1);
      setGoodTotal(x => x + 1);
      next();
    } else {
      setTries(t => t + 1);
    }
  };

  const next = () => {
    setTries(0);
    setInput("");
    t0.current = Date.now();
    if (i + 1 < items.length) setI(i + 1);
    else finish();
  };

  const finish = () => {
    const placement = computePlacement(course, key, {
      firstTry: goodFirst,
      totalGood: goodTotal,
      totalItems: items.length,
      times
    });
    savePlacement(placement);
    router.replace("/?boost=ready");
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Test d’entrée “Boost”</h1>
      <p className="text-sm text-gray-600">
        {course === "en"
          ? "Traduisez en français sans aide. 12 phrases."
          : "Переведите на русский без подсказок. 12 предложений."}
      </p>

      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <div className="text-xs text-gray-500">Item {i+1}/{items.length}</div>
        <div className="text-lg font-medium">
          {course === "en"
            ? (current as BoostItemEN).en
            : (current as BoostItemFR).fr}
        </div>
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder={course === "en" ? "Réponse en français..." : "Ответ по-русски..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e)=>{ if(e.key==="Enter") check(); }}
        />
        <div className="flex gap-2">
          <button onClick={check} className="rounded-xl bg-indigo-600 text-white px-4 py-2">Valider</button>
          {tries>0 && <span className="text-sm text-rose-600">❌ Réessaye</span>}
        </div>
      </div>
    </main>
  );
}

"use client";
type SessionWindow = Window & {
  __sessionScore?: number;
  __sessionMinutes?: number;
};

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProfile, VARIANT_FLAG, GOAL_LABEL, type UserProfile } from "@/lib/profile";
import { translateWord } from "@/lib/dict";
import { addWord } from "@/lib/wordStore";
import { normalize, softEquals } from "@/lib/textUtils";
function applyVariant(text: string, variant: "british"|"american") {
  const swaps: Record<string, string> =
    variant === "british"
      ? { apartment: "flat", fries: "chips", cookie: "biscuit", color: "colour", favorite: "favourite" }
      : { flat: "apartment", chips: "fries", biscuit: "cookie", colour: "color", favourite: "favorite" };
  let out = text;
  Object.entries(swaps).forEach(([from, to]) => {
    out = out.replace(new RegExp(`\\b${from}\\b`, "gi"), to);
  });
  return out;
}

// phrase simple selon l’objectif
function getSentence(p: UserProfile) {
  switch (p.goal) {
    case "everyday": return "I wake up early and make coffee.";
    case "travel":   return "I would like a return ticket to London, please.";
    case "work":     return "I have a meeting at ten o'clock.";
    case "exams":    return "There are three questions in the test.";
    default:         return "I wake up early and make coffee.";
  }
}

// tokenisation simple mots/punctuations
function tokenize(sentence: string) {
  const tokens: { t: string; isWord: boolean }[] = [];
  const re = /[A-Za-z']+|[^A-Za-z'\s]+|\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence))) {
    const t = m[0];
    const isWord = /^[A-Za-z']+$/.test(t);
    tokens.push({ t, isWord });
  }
  return tokens;
}


export default function Mission() {
  "use client";
  const router = useRouter();
  const profile = loadProfile();

  // Hooks toujours appelés, valeurs nulles si pas de profil
  const base = profile ? getSentence(profile) : "";
  const sentence = profile ? applyVariant(base, profile.variant) : "";
  const tokens = useMemo(() => tokenize(sentence), [sentence]);
  const [selected, setSelected] = useState<string | null>(null);
  const [fr, setFr] = useState("");
  const [feedback, setFeedback] = useState<"ok"|"ko"|null>(null);
  const expectedFr = useMemo(() => {
    switch (normalize(sentence)) {
      case normalize("I wake up early and make coffee."):
        return "Je me réveille tôt et je fais du café.";
      case normalize("I would like a return ticket to London, please."):
        return "Je voudrais un billet aller-retour pour Londres, s’il vous plaît.";
      case normalize("I have a meeting at ten o'clock."):
        return "J’ai une réunion à dix heures.";
      case normalize("There are three questions in the test."):
        return "Il y a trois questions dans le test.";
      default:
        return "";
    }
  }, [sentence]);

  useEffect(() => { if (!profile) router.replace("/"); }, [profile, router]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window as SessionWindow;
      w.__sessionScore = feedback === "ok" ? 100 : 0;
      w.__sessionMinutes = 5;
    }
  }, [feedback]);

  if (!profile) return null;

  const check = () => {
    if (!expectedFr) return setFeedback("ko");
    setFeedback(softEquals(fr, expectedFr) ? "ok" : "ko");
  };

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Mission du jour</h1>
        <span className="ml-auto text-sm rounded-full px-3 py-1 bg-indigo-100 text-indigo-800">
          {VARIANT_FLAG[profile.variant]} {GOAL_LABEL[profile.goal]}
        </span>
      </div>

      {/* Phrase avec mots cliquables */}
      <article className="p-4 rounded-2xl border bg-white">
        <h2 className="font-medium mb-2">📖 Phrase du jour</h2>
        <p className="leading-8 text-lg">
          {tokens.map((tok, i) =>
            tok.isWord ? (
              <button
                key={i}
                onClick={() => setSelected(tok.t)}
                className="underline decoration-dotted underline-offset-4 hover:bg-yellow-50 rounded px-1"
                title="Cliquer pour voir la traduction"
              >
                {tok.t}
              </button>
            ) : (
              <span key={i}>{tok.t}</span>
            )
          )}
        </p>
      </article>

      {/* Panneau traduction mot + ajout à la liste */}
      {selected && (
        <div className="p-4 rounded-2xl border bg-white flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Mot sélectionné</div>
            <div className="text-lg font-medium">{selected}</div>
            <div className="text-gray-700">→ {translateWord(selected)}</div>
          </div>
          <button
            onClick={() => addWord(selected, translateWord(selected))}
            className="px-4 py-2 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            ➕ Ajouter à ma liste
          </button>
        </div>
      )}

      {/* Zone de traduction FR */}
      <div className="p-4 rounded-2xl border bg-white space-y-3">
        <p className="font-medium">📝 Traduis en français</p>
        <textarea
          value={fr}
          onChange={(e) => { setFr(e.target.value); setFeedback(null); }}
          placeholder="Écris ta traduction ici…"
          className="w-full rounded-xl border p-3 min-h-[100px]"
        />
        <div className="flex gap-3">
          <button onClick={check} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700">
            Vérifier
          </button>
          {feedback === "ok" && <span className="text-green-700">✅ Correct !</span>}
          {feedback === "ko" && (
            <span className="text-rose-700">
              ❌ Presque. Attendu : <em className="underline">{expectedFr}</em>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}


"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProfile, VARIANT_FLAG, GOAL_LABEL, type UserProfile } from "@/lib/profile";
import { getSentences, type SentenceItem } from "@/content/sentences";
import { translateWord } from "@/lib/dict";
import { addWord } from "@/lib/wordStore";
import { normalize, softEquals } from "@/lib/textUtils";
import { addCoins } from "@/lib/coins";
import Timer from "@/components/Timer";

// --- utils ---
type Token = { t: string; isWord: boolean };
function tokenize(sentence: string): Token[] {
  const tokens: Token[] = [];
  const re = /[A-Za-z']+|[^A-Za-z'\s]+|\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence))) {
    const t = m[0];
    tokens.push({ t, isWord: /^[A-Za-z']+$/.test(t) });
  }
  return tokens;
}
function applyVariant(text: string, variant: "british" | "american") {
  let out = text;
  if (variant === "american") {
    out = out.replace(/\breturn ticket\b/gi, "round-trip ticket");
    out = out.replace(/\bin the test\b/gi, "on the test");
  } else {
    out = out.replace(/\bround-?trip ticket\b/gi, "return ticket");
    out = out.replace(/\bon the test\b/gi, "in the test");
  }
  return out;
}
type SessionWindow = Window & { __sessionScore?: number; __sessionMinutes?: number };

const COINS_PER_CORRECT = 3;
const SESSION_SECONDS = 15 * 60;

export default function Mission() {

  const router = useRouter();
  const profile = loadProfile();

  // hooks toujours appelés, valeurs nulles si pas de profil
  const bankBase = useMemo(() => getSentences(profile?.goal ?? "everyday"), [profile?.goal]);
  const bank: SentenceItem[] = useMemo(
    () => bankBase.map(s => ({ en: applyVariant(s.en, profile?.variant ?? "british"), fr: s.fr })),
    [bankBase, profile?.variant]
  );
  const [idx, setIdx] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerFr, setAnswerFr] = useState<string>("");
  const [feedback, setFeedback] = useState<"idle" | "ok" | "ko">("idle");
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [sessionCoins, setSessionCoins] = useState<number>(0);
  const [ended, setEnded] = useState<boolean>(false);
  const current = bank[idx];
  const tokens = useMemo(() => tokenize(current.en), [current.en]);
  const scorePct = attempts ? Math.round((correctCount / attempts) * 100) : 0;

  useEffect(() => { if (!profile) router.replace("/"); }, [profile, router]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window as SessionWindow;
      w.__sessionScore = scorePct;
      w.__sessionMinutes = Math.round((SESSION_SECONDS - 0) / 60); // simple placeholder
    }
  }, [scorePct]);

  if (!profile) return null;

  function check() {
    setAttempts(a => a + 1);
    if (softEquals(answerFr, current.fr)) {
      setFeedback("ok");
      setCorrectCount(c => c + 1);
      setSessionCoins(c => c + COINS_PER_CORRECT);
    } else {
      setFeedback("ko");
    }
  }
  function next() {
    setSelected(null);
    setAnswerFr("");
    setFeedback("idle");
    setIdx(i => (i + 1) % bank.length);
  }
  function finishSession() {
  setEnded(true);
  addCoins(sessionCoins, profile!.goal);
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Mission du jour</h1>
        <span className="ml-auto text-sm rounded-full px-3 py-1 bg-indigo-100 text-indigo-800">
          {VARIANT_FLAG[profile.variant]} {GOAL_LABEL[profile.goal]}
        </span>
      </div>

      {/* En-tête : timer + pièces */}
      <div className="p-4 rounded-2xl border flex items-center gap-4 bg-white">
        <Timer durationSec={SESSION_SECONDS} onElapsed={finishSession} />
        <div className="ml-auto flex items-center gap-2">
          <span
            className="inline-block rounded-full"
            style={{
              width: 22, height: 22,
              background: "radial-gradient(circle at 30% 30%, #ffd7f2, #ff63c3 60%, #b11c8c)",
              boxShadow: "0 4px 10px rgba(255, 99, 195, .35), inset 0 2px 5px rgba(255,255,255,.6)",
            }}
            aria-hidden
          />
          <span className="font-medium">{sessionCoins}</span>
        </div>
      </div>

      {/* Phrase cliquable */}
      <article className="p-4 rounded-2xl border bg-white">
        <h2 className="font-medium mb-2">📖 Traduis la phrase</h2>
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

      {/* Panneau mot + ajout */}
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

      {/* Réponse FR */}
      <div className="p-4 rounded-2xl border bg-white space-y-3">
        <textarea
          value={answerFr}
          onChange={(e) => { setAnswerFr(e.target.value); setFeedback("idle"); }}
          placeholder="Écris la traduction en français…"
          className="w-full rounded-xl border p-3 min-h-[100px]"
        />
        <div className="flex flex-wrap gap-3">
          <button onClick={check} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700">
            Vérifier
          </button>
          {feedback === "ok" && (
            <>
              <span className="self-center text-green-700">✅ Correct !</span>
              <button onClick={next} className="px-4 py-2 rounded-2xl border hover:bg-indigo-50">
                Phrase suivante →
              </button>
            </>
          )}
          {feedback === "ko" && (
            <span className="self-center text-rose-700">
              ❌ Presque. Attendu : <em className="underline">{current.fr}</em>
            </span>
          )}
        </div>
      </div>

      {/* Résumé de fin */}
      {ended && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-5">
            <h2 className="text-xl font-semibold">Session terminée 🎉</h2>
            <p>Score : <b>{scorePct}</b>/100</p>
            <div className="flex items-center gap-2">
              <span
                className="inline-block rounded-full"
                style={{
                  width: 24, height: 24,
                  background: "radial-gradient(circle at 30% 30%, #ffd7f2, #ff63c3 60%, #b11c8c)",
                  boxShadow: "0 4px 10px rgba(255, 99, 195, .35), inset 0 2px 5px rgba(255,255,255,.6)",
                }}
              />
              <span>Tu as gagné <b>{sessionCoins}</b> pièces roses !</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => router.push("/chest")} className="rounded-2xl bg-indigo-600 text-white py-2">
                Ouvrir le coffre 🧰
              </button>
              <button onClick={() => location.reload()} className="rounded-2xl border py-2">
                Rejouer 15 min
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

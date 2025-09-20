
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProfile, VARIANT_FLAG, GOAL_LABEL, type UserProfile } from "@/lib/profile";
import { getSentences, type SentenceItem } from "@/content/sentences";
import { translateWord } from "@/lib/dict";
import { addWord } from "@/lib/wordStore";
import { normalize, softEquals, evaluateFrenchAnswer } from "@/lib/textUtils";
import { sentenceId, isPassed, markSeen } from "@/lib/seenStore";
import { addCoins } from "@/lib/coins";
import Timer from "@/components/Timer";
import Coin from "@/components/Coin";

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
  // ids basés sur la phrase EN "de base" (sans variante) pour rester stables
  const idsBase = useMemo(() => bankBase.map(s => sentenceId(s.en)), [bankBase]);

  // index de la phrase courante (null = plus de candidates)
  const [idx, setIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerFr, setAnswerFr] = useState<string>("");
  const [feedback, setFeedback] = useState<"idle" | "ok" | "ko">("idle");
  const [notes, setNotes] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [sessionCoins, setSessionCoins] = useState<number>(0);
  const [ended, setEnded] = useState<boolean>(false);
  const current = idx === null ? null : bank[idx];
  const currentId = idx === null ? "" : idsBase[idx];
  const tokens = useMemo(() => tokenize(current?.en || ""), [current]);
  const scorePct = attempts ? Math.round((correctCount / attempts) * 100) : 0;

  useEffect(() => { if (!profile) router.replace("/"); }, [profile, router]);
  // au montage: choisir une première phrase non vue/réussie
  useEffect(() => {
    if (!profile) return;
    const first = pickNextUnseenIndex(null);
    setIdx(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.goal, profile?.variant]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window as SessionWindow;
      w.__sessionScore = scorePct;
      w.__sessionMinutes = Math.round((SESSION_SECONDS - 0) / 60); // simple placeholder
    }
  }, [scorePct]);

  if (!profile) return null;

  // Sélection de la prochaine phrase non réussie
  function pickNextUnseenIndex(from: number | null): number | null {
    if (!profile) return null;
    // liste des indices non "passed"
    const candidates: number[] = idsBase
      .map((_, i) => i)
      .filter(i => !isPassed(profile.goal, idsBase[i]));
    if (candidates.length === 0) return null;

    // option: éviter de répéter immédiatement la même
    const filtered = from === null ? candidates : candidates.filter(i => i !== from);
    const list = filtered.length ? filtered : candidates;

    // tirage aléatoire simple
    const pick = list[Math.floor(Math.random() * list.length)];
    return pick;
  }

  function check() {
    if (!current || !profile) return;
    const res = evaluateFrenchAnswer(current.fr, answerFr);
    setAttempts(a => a + 1);

    // on marque "vu" à la première tentative :
    markSeen(profile.goal, currentId, false);

    if (res.ok) {
      setFeedback("ok");
      setCorrectCount(c => c + 1);
      setSessionCoins(c => c + COINS_PER_CORRECT);

      // et on marque "réussi" -> la phrase sort définitivement du pool
      markSeen(profile.goal, currentId, true);
    } else {
      setFeedback("ko");
    }
    setNotes(res.notes);
  }

  function next() {
    if (idx === null) return;
    setSelected(null);
    setAnswerFr("");
    setFeedback("idle");
    const n = pickNextUnseenIndex(idx);
    setIdx(n);
  }
  function finishSession() {
  setEnded(true);
  addCoins(sessionCoins, profile!.goal);
  }

  // Gestion “plus de nouvelles phrases”
  const exhausted = idx === null;

  if (exhausted) {
    return (
      <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Mission du jour</h1>
          <span className="ml-auto text-sm rounded-full px-3 py-1 bg-indigo-100 text-indigo-800">
            {VARIANT_FLAG[profile.variant]} {GOAL_LABEL[profile.goal]}
          </span>
        </div>

        <div className="p-6 rounded-3xl border bg-white space-y-4">
          <p className="text-lg">🎉 Tu as terminé toutes les phrases <b>nouvelles</b> pour ce thème.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => location.assign("/settings")}
              className="rounded-2xl border py-2 hover:bg-indigo-50"
            >
              Changer de thème
            </button>
            <button
              onClick={() => { import("@/lib/seenStore").then(m => m.clearSeen(profile.goal)); location.reload(); }}
              className="rounded-2xl bg-indigo-600 text-white py-2"
            >
              Rejouer ce thème (réinitialiser)
            </button>
          </div>
        </div>
      </main>
    );
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
          <Coin size={22} />
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
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); check(); }
          }}
          placeholder="Écris la traduction en français… (Entrée = vérifier)"
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
          {feedback === "ko" && current && (
            <span className="self-center text-rose-700">
              ❌ Presque. Attendu : <em className="underline">{current.fr}</em>
            </span>
          )}
          {notes.length > 0 && (
            <ul className="text-sm text-gray-700 list-disc pl-5">
              {notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
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
              <Coin size={24} />
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

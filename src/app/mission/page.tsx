"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { loadLevel, recordAnswer, targetWordRange, wordCount } from "@/lib/level";
import { getSentences } from "@/content/sentences";
import { sentencesFR } from "@/content/sentences_fr";
import { applyVariant } from "@/lib/variant";
import { preloadForSentence, translateWordGeneric } from "@/lib/bigdict";
import { isPassed, markSeen, sentenceId } from "@/lib/seenStore";
import { evaluateFrenchAnswer, evaluateAnswerGeneric } from "@/lib/textUtils";
import { VARIANT_FLAG, GOAL_LABEL } from "@/lib/profile";
import { addCoins } from "@/lib/coins";
import { loadSession, saveSession, clearSession as clearSess, secondsLeft, startSession } from "@/lib/session";
import Timer from "@/components/Timer";
// Typage pour l'accès window custom
type SessionWindow = Window & { __sessionScore?: number; __sessionMinutes?: number };
// Valeur par défaut pour la durée d'une session (15 min)
const SESSION_SECONDS = 900;
import Coin from "@/components/Coin";
// Ajoutez ici d'autres imports de composants si besoin

export default function Mission() {
  const router = useRouter();
  const profile = loadProfile();
  // État global pour le nombre d'essais sur la phrase courante
  const [tries, setTries] = useState(0);


  // Timer/session state (remplacement)
  const course = profile?.course ?? "en";
  const [lvl, setLvl] = useState(() => profile ? loadLevel(course, profile.goal).level : 1);
  const sess0 = loadSession();
  const [left, setLeft] = useState<number>(sess0 ? secondsLeft(sess0) : 900);
  const durationTotal = sess0?.durationSec ?? 900;
  const [ended, setEnded] = useState<boolean>(false);
  useEffect(() => {
    if (!sess0) {
      // si on arrive ici sans session (ex: lien direct), on crée par défaut 15 min
      if (!profile) return;
      const s = startSession(profile, 15);
      setLeft(secondsLeft(s));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hooks toujours appelés, valeurs par défaut si pas de profil
  const isEn = (profile?.course ?? "en") === "en";
  type EnFr = { en: string; fr: string };
  type FrRu = { fr: string; ru: string };
  const bankBase = useMemo<EnFr[] | FrRu[]>(
    () => (profile ? (isEn ? getSentences(profile.goal) as EnFr[] : sentencesFR as FrRu[]) : []),
    [isEn, profile?.goal]
  );
  const bank = useMemo<EnFr[] | FrRu[]>(
    () => (profile ? (isEn ? (bankBase as EnFr[]).map((s) => ({ en: applyVariant(s.en, profile.variant), fr: s.fr })) : bankBase) : []),
    [bankBase, isEn, profile]
  );
  const idsBase = useMemo<string[]>(
    () => bankBase.map((s) => sentenceId(isEn ? ('en' in s ? s.en : s.fr) : s.fr)),
    [bankBase, isEn]
  );
  const [idx, setIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerFr, setAnswerFr] = useState<string>("");
  const [feedback, setFeedback] = useState<"idle" | "ok" | "ko">("idle");
  const [notes, setNotes] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [sessionCoins, setSessionCoins] = useState<number>(0);
  const current = idx === null ? null : bank[idx];
  const currentId = idx === null ? "" : idsBase[idx];
  // Typage correct pour EN->FR ou FR->RU
  let srcText = "";
  let expText = "";
  let tokens: string[] = [];
  if (isEn && current && 'en' in current && 'fr' in current) {
    srcText = current.en;
    expText = current.fr;
    tokens = current.en.split(" "); // ou utilisez tokenize si besoin
  } else if (!isEn && current && 'fr' in current && 'ru' in current) {
    srcText = current.fr;
    expText = current.ru;
    tokens = current.fr.split(" ");
  }
  const scorePct = attempts ? Math.round((correctCount / attempts) * 100) : 0;
  const [translations, setTranslations] = useState<string[]|null>(null);

  // Redirection si pas de profil
  useEffect(() => {
    if (!profile) router.replace("/");
  }, [profile, router]);

  // Choix de la première phrase non vue/réussie
  useEffect(() => {
    if (profile) {
      const first = pickNextIndexDifficultyAware(null);
      setIdx(first);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.goal, profile?.variant, lvl]);

  // Score session dans window
  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window as SessionWindow;
      w.__sessionScore = scorePct;
      w.__sessionMinutes = Math.round((SESSION_SECONDS - 0) / 60); // simple placeholder
    }
  }, [scorePct]);

  // Préchargement dictionnaire pour la phrase courante (EN)
  useEffect(() => {
    if (isEn && current && 'en' in current) preloadForSentence(current.en);
  }, [current, isEn]);

  // Traduction du mot sélectionné
  useEffect(() => {
    let alive = true;
    if (!selected) return setTranslations(null);
    const src = isEn ? "en" : "fr";
    const tgt = isEn ? "fr" : (profile?.answerLang ?? "ru");
    translateWordGeneric(selected, src, tgt).then((res) => { if (alive) setTranslations(res); });
    return () => { alive = false; };
  }, [selected, isEn, profile?.answerLang]);

  if (!profile) return null;


  // Sélectionne une phrase non réussie dont la longueur colle au niveau (avec un peu d'aléatoire)
  function pickNextIndexDifficultyAware(prev: number | null): number | null {
    if (!profile) return null;
    const candidates = idsBase
      .map((_, i) => i)
      .filter(i => !isPassed(profile.goal, idsBase[i]));
    if (!candidates.length) return null;

    const { min, max } = targetWordRange(lvl);
    const mid = (min + max) / 2;
    const lengthOf = (i: number) => {
      const s = bankBase[i];
      if (course === "en" && 'en' in s) return wordCount(s.en);
      if ('fr' in s) return wordCount(s.fr);
      return 0;
    };

    const scored = candidates.map(i => {
      const len = lengthOf(i);
      const prox = Math.abs(len - mid);
      const jitter = Math.random() * 0.4; // naturel
      return { i, score: prox + jitter };
    }).sort((a,b) => a.score - b.score);

    const pool = prev == null ? scored : scored.filter(x => x.i !== prev);
    const choice = pool.slice(0, Math.max(3, Math.ceil(pool.length * 0.2)));
    return choice[Math.floor(Math.random()*choice.length)].i;
  }

  function check() {
    if (!current || !profile) return;
    const res = isEn
      ? evaluateFrenchAnswer(expText, answerFr)
      : evaluateAnswerGeneric(expText, answerFr, 0.2);
    setAttempts(a => a + 1);
    markSeen(profile.goal, currentId, false);
    // Gestion du niveau adaptatif
    const firstTry = tries === 0;
    const st = recordAnswer(profile, { ok: res.ok, tries: firstTry ? 1 : tries + 1 });
    setLvl(st.level);
    if (res.ok) {
      setFeedback("ok");
      setCorrectCount(c => c + 1);
      setSessionCoins(c => c + 5); // 5 pièces par bonne réponse (valeur par défaut)
      markSeen(profile.goal, currentId, true);
      // pièces immédiates
      addCoins(5, profile.goal);
      // persiste la session (coins/attempts/correct)
      const s = loadSession();
      if (s) {
        s.coins += 5;
        s.attempts += 1;
        s.correct += 1;
        saveSession(s);
      }
      setTries(0); // reset essais après succès
    } else {
      setFeedback("ko");
      // même en cas d’échec, incrémente attempts
      setTries(t => t + 1);
      const s2 = loadSession();
      if (s2) { s2.attempts += 1; saveSession(s2); }
    }
    setNotes(res.notes);
  }

  function next() {
    if (idx === null) return;
    setSelected(null);
    setAnswerFr("");
    setFeedback("idle");
    const n = pickNextIndexDifficultyAware(idx);
    setIdx(n);
    setTries(0);
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
        <span className="ml-2 text-sm rounded-full px-3 py-1 bg-amber-100 text-amber-800">
          Niveau {lvl}
        </span>
      </div>

      {/* En-tête : timer + pièces */}
      <div className="p-4 rounded-2xl border flex items-center gap-4 bg-white">
        <Timer
          durationSec={durationTotal}
          initialLeft={left}
          onTick={(n) => setLeft(n)}
          onElapsed={() => {
            setEnded(true);
            const s = loadSession();
            if (s) { s.ended = true; saveSession(s); }
          }}
        />
        <div className="ml-auto flex items-center gap-2">
          <Coin size={22} />
          <span className="font-medium">{sessionCoins}</span>
        </div>
      </div>

      {/* Phrase cliquable */}
      <article className="p-4 rounded-2xl border bg-white">
        <h2 className="font-medium mb-2">📖 Traduis la phrase</h2>
        <p className="leading-8 text-lg">
          {tokens.map((tok, i) => (
            <button
              key={i}
              onClick={() => setSelected(tok)}
              className="underline decoration-dotted underline-offset-4 hover:bg-yellow-50 rounded px-1"
              title="Cliquer pour voir la traduction"
            >
              {tok}
            </button>
          ))}
        </p>
      </article>

      {/* Panneau mot + ajout */}
      {selected && (
        <div className="p-4 rounded-2xl border bg-white flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Mot sélectionné</div>
            <div className="text-lg font-medium">{selected}</div>
            <div className="text-gray-700">
              {translations ? translations.slice(0,3).join(" · ") : "…"}
            </div>
          </div>
          <button
            onClick={() => {
              const first = translations?.[0] ?? "(?)";
        import("@/lib/wordStore").then(({ addWord }) => addWord(selected, first));
  import("@/lib/wordStore").then(({ addWord }) => addWord(selected, first));
            }}
            className="px-4 py-2 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            ➕ Ajouter à ma liste
          </button>
        </div>
      )}

      {/* Réponse FR */}
      <div className="p-4 rounded-2xl border bg-white space-y-3">
        <p className="font-medium">
          📝 Traduis en {isEn ? "français" : (profile.answerLang === "ru" ? "russe" : "français")}
        </p>
        <textarea
          value={answerFr}
          onChange={(e) => { setAnswerFr(e.target.value); setFeedback("idle"); }}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); check(); }
          }}
          onFocus={() => tries === 0 && setTries(1)}
          placeholder={isEn ? "Écris la traduction en français… (Entrée = vérifier)" : "Écris la traduction en russe… (Entrée = vérifier)"}
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
              ❌ Presque. Attendu : <em className="underline">{expText}</em>
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
              <button
                onClick={() => { clearSess(); location.assign("/"); }}
                className="rounded-2xl border py-2"
              >
                Retour à l’accueil
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

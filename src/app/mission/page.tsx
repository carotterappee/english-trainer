"use client";


import React, { useEffect, useMemo, useState } from "react";
import ClickableSentence from "@/components/ClickableSentence";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { loadLevel, recordAnswer, targetWordRange, wordCount } from "@/lib/level";
import { getSentences } from "@/content/sentences";
import { getSentencesFR } from "@/content/sentences";
import { applyVariant } from "@/lib/variant";
import { translateWordGeneric } from "@/lib/bigdict";
import type { DictResult } from "@/lib/bigdict";
import { isPassed, markSeen, sentenceId } from "@/lib/seenStore";
import { normalizeAnswer, displayFriendly, isTranslatableToken, answersEqual, frenchHints } from "@/lib/textUtils";
import Correction from "@/components/Correction";
import { VARIANT_FLAG, GOAL_LABEL } from "@/lib/profile";
import { addCoins } from "@/lib/coins";
import { finalizeSession, clearSession, loadSession, saveSession, secondsLeft, startSession } from "@/lib/session";
import Timer from "@/components/Timer";
// Typage pour l'accès window custom
type SessionWindow = Window & { __sessionScore?: number; __sessionMinutes?: number };
// Valeur par défaut pour la durée d'une session (15 min)
const SESSION_SECONDS = 900;
import Coin from "@/components/Coin";
// Ajoutez ici d'autres imports de composants si besoin

export default function Mission() {
  const [last, setLast] = useState<{ ok: boolean; expected: string; user: string; notes?: string[] } | null>(null);
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
    () => {
      if (!profile) return [];
      if (isEn) return getSentences(profile.goal) as EnFr[];
      // Pour FR, ne charge que si goal est 'everyday' ou 'exams'
      if (profile.goal === "everyday" || profile.goal === "exams") {
        return getSentencesFR(profile.goal) as FrRu[];
      }
      return [];
    },
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
  const [coinPop, setCoinPop] = useState(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [sessionCoins, setSessionCoins] = useState<number>(0);
  const current = idx === null ? null : bank[idx];
  const currentId = idx === null ? "" : idsBase[idx];
  // Typage correct pour EN->FR ou FR->RU
  let srcText = "";
  let expText = "";
  let tokens: string[] = [];
  let expected: string | undefined = undefined;
  if (isEn && current && 'en' in current && 'fr' in current) {
    srcText = current.en;
    expText = current.fr;
    expected = current.fr;
    tokens = current.en.split(" ");
  } else if (!isEn && current && 'fr' in current) {
    srcText = current.fr;
    // current est FrRu | undefined
    expText = (current as { fr: string; ru?: string }).ru ?? "";
    expected = (current as { fr: string; ru?: string }).ru;
    tokens = current.fr.split(" ");
  }
  const phraseAffichee = displayFriendly(srcText);
  const scorePct = attempts ? Math.round((correctCount / attempts) * 100) : 0;
  const [dict, setDict] = useState<DictResult | null>(null);

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
  // useEffect(() => {
  //   if (isEn && current && 'en' in current) preloadForSentence(current.en);
  // }, [current, isEn]);

  // Traduction du mot sélectionné (nouvelle version enrichie)
  useEffect(() => {
    let alive = true;
    if (!selected) { setDict(null); return; }
    const src: "en" | "fr" = isEn ? "en" : "fr";
    const tgt: "fr" | "ru" = isEn ? "fr" : "ru";
    translateWordGeneric(selected, src, tgt, { ctxSentence: srcText })
      .then((res) => { if (alive) setDict(res); });
    return () => { alive = false; };
  }, [selected, isEn, srcText]);

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
  const attempt = tries + 1;
  // Mode FR : si pas de traduction RU fournie, on accepte toute réponse non vide
  if (!isEn && (!expected || expected.trim() === "")) {
      const ok = (answerFr || "").trim().length > 0;
      setLast({ ok, expected: "(réponse libre)", user: answerFr });
      if (ok) {
        if (profile) addCoins(5, profile.goal);
        setCoinPop(true);
        setTimeout(() => setCoinPop(false), 1200);
        const s = loadSession(); if (s) { s.coins += 5; s.attempts += 1; s.correct += 1; saveSession(s); }
        if (profile) {
          const st = recordAnswer(profile, { ok: true, tries: attempt });
          setLvl(st.level);
        }
        setFeedback("ok");
        setTimeout(() => {
          setLast(null);
          setFeedback("idle");
          next();
        }, 1200);
      } else {
        setFeedback("ko");
        const s = loadSession(); if (s) { s.attempts += 1; saveSession(s); }
      }
      return;
    }
  if (!current || !profile) return;
    if (!normalizeAnswer(answerFr)) {
      setLast({ ok: false, expected: expText, user: answerFr });
      setFeedback("ko");
      return;
    }
    const ok = answersEqual(answerFr, expText);
    setTries(attempt);
    if (ok) {
      addCoins(5, profile.goal);
      setCoinPop(true);
      setTimeout(() => setCoinPop(false), 1200);
      const s = loadSession();
      if (s) { s.coins += 5; s.attempts += 1; s.correct += 1; saveSession(s); }
      const st = recordAnswer(profile, { ok: true, tries: attempt });
      setLvl(st.level);
      setLast({ ok: true, expected: expText, user: answerFr });
      setFeedback("ok");
      // Passage à la phrase suivante après un court délai pour laisser voir le feedback
      setTimeout(() => {
        setLast(null);
        setFeedback("idle");
        next();
      }, 1200);
      return;
    } else {
      const notes = isEn ? frenchHints(expText, answerFr) : [];
      setLast({ ok: false, expected: expText, user: answerFr, notes });
      setFeedback("ko");
      const s = loadSession();
      if (s) { s.attempts += 1; saveSession(s); }
      const st = recordAnswer(profile, { ok: false, tries: attempt });
      setLvl(st.level);
      // on reste sur la même phrase, avec boutons Réessayer / Phrase suivante
    }
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
        {/* <span className="ml-2 text-sm rounded-full px-3 py-1 bg-amber-100 text-amber-800">
          Niveau {lvl}
        </span> */}
      </div>

      {/* En-tête : timer + pièces */}
      <div className="p-4 rounded-2xl border flex items-center gap-4 bg-white">
        <Timer
          durationSec={durationTotal}
          initialLeft={left}
          onTick={(n) => setLeft(n)}
          onElapsed={() => {
            finalizeSession(lvl);   // 👈 journalise la session du jour
            setEnded(true);
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
        <ClickableSentence
          text={srcText}
          selected={selected}
          onSelect={(tok: string) => {
            if (!isTranslatableToken(tok)) return;
            setSelected(tok);
            setDict(null);
          }}
        />
      </article>

      {/* Panneau mot + ajout enrichi */}
      {selected && dict && (
        <div className="mt-3 rounded-2xl border bg-white/80 backdrop-blur px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">“{selected}”</span>
            <span>→ {dict.defs.join(", ")}</span>
            <button
              onClick={() => import("@/lib/wordStore").then(({ addWord }) => addWord(
                isEn ? selected! : dict.defs[0],
                isEn ? dict.defs[0] : selected!
              ))}
              className="ml-auto rounded-xl bg-emerald-600 text-white px-3 py-1.5"
            >
              + Ajouter à mes mots
            </button>
          </div>
          {dict.phrase && (
            <div className="mt-1 text-gray-700">
              <span className="text-xs rounded-full border px-2 py-0.5 mr-2">Expression</span>
              <span className="font-medium">{dict.phrase.text}</span>
              <span> → {dict.phrase.defs.join(", ")}</span>
              {dict.phrase.note && <div className="text-xs text-gray-500">{dict.phrase.note}</div>}
            </div>
          )}
          {dict.variants && (
            <div className="mt-1 text-xs text-gray-500">
              Variantes : {dict.variants.join(" · ")}
            </div>
          )}
          {dict.note && (
            <div className="mt-1 text-xs text-gray-500">
              {dict.note}
            </div>
          )}
        </div>
      )}

      {/* Réponse FR */}
      <div className="p-4 rounded-2xl border bg-white space-y-3 relative">
        <p className="font-medium">
          📝 Traduis en {isEn ? "français" : (profile.answerLang === "ru" ? "russe" : "français")}
        </p>
        <textarea
          value={answerFr}
          onChange={e => {
            setAnswerFr(e.target.value);
            setLast(null);
            setFeedback("idle");
          }}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); check(); }
          }}
          onFocus={() => tries === 0 && setTries(1)}
          placeholder={isEn ? "Écris la traduction en français… (Entrée = vérifier)" : "Écris la traduction en russe… (Entrée = vérifier)"}
          className="w-full rounded-xl border p-3 min-h-[100px]"
        />
        {/* Animation pop de pièces */}
        {coinPop && (
          <div className="absolute right-6 top-2 animate-bounce z-10 flex items-center gap-1">
            <Coin size={28} />
            <span className="text-pink-600 font-bold text-lg">+5</span>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button onClick={check} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700">
            Vérifier
          </button>
          {feedback === "ok" && (
            <span className="self-center text-green-700 animate-pulse">✅ Correct !</span>
          )}
          {feedback === "ko" && current && (
            <span className="self-center text-rose-700">
              ❌ Presque. Attendu : <em className="underline">{expText}</em>
            </span>
          )}
          {last && !last.ok && (
            <Correction
              expected={last.expected}
              user={last.user}
              notes={last.notes || []}
              onRetry={() => { setLast(null); setFeedback("idle"); }}
              onNext={() => { setLast(null); setFeedback("idle"); next(); }}
            />
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
                onClick={() => {
                  finalizeSession(lvl);   // 👈 écrit dans /progress
                  clearSession();         // pour ne plus proposer “Continuer”
                  location.assign("/");   // retour home
                }}
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

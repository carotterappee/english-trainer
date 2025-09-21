
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasProfile, loadProfile } from "@/lib/profile";
import { getProfile } from "@/lib/profile_store";
import { needsPlacement, getPlacement } from "@/lib/placement";
import { useEffect, useState } from "react";
import SelectProfileModal from "@/components/SelectProfileModal";
import SelectDurationModal from "@/components/SelectDurationModal";
import CloudBackground from "@/components/CloudBackground";
import NightSkyFX from "@/components/NightSkyFX";
import SunsetFX from "@/components/SunsetFX";
import WinterFX from "@/components/WinterFX";
import { hasActiveSession, startSession } from "@/lib/session";


export default function Home() {
  const router = useRouter();
  const [openCats, setOpenCats] = useState(false);
  const [durationModal, setDurationModal] = useState(false);
  const [active, setActive] = useState(false);


  // Profil courant (avec fallback)
  const profile = getProfile();
  if (!profile.course) profile.course = "en";
  if (!profile.answerLang) profile.answerLang = "fr";
  if (!profile.categories?.length) profile.categories = ["everyday"];

  // Placement : première fois ?
  const firstTime = needsPlacement((profile.course ?? "en") as "en"|"fr");
  const CTA_LABEL = firstTime ? "Trouver son niveau" : (active ? "▶️ Continuer la mission" : "🚀 Commencer (choisir durée)");
  const CTA_ACTION = () => router.push(firstTime ? "/placement" : "/mission");

  useEffect(() => { setActive(hasActiveSession()); }, []);


  const onPrimary = () => {
    if (!hasProfile()) return setOpenCats(true);
    if (firstTime) return CTA_ACTION();
    if (active) return router.push("/mission");
    setDurationModal(true);
  };

  const startWithDuration = (minutes: number) => {
    const p = loadProfile();
    if (!p) return setOpenCats(true);
    startSession(p, minutes);
    router.push("/mission");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6">
      <CloudBackground />
      <NightSkyFX />
      <SunsetFX />
      <WinterFX />
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700">🌍 English Trainer</h1>
        <p className="text-center text-gray-600">Ta mission du jour en anglais — 15 minutes chrono.</p>


        <button onClick={onPrimary}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl shadow-lg transition">
          {CTA_LABEL}
        </button>

        {false && (
          <button onClick={() => setOpenCats(true)} className="block mx-auto mt-2 text-2xl" title="Réglages">
            ⚙️
          </button>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Link href="/progress"   className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">📈 Progression</Link>
          <Link href="/flashcards" className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🧠 Flashcards</Link>
          <Link href="/chest"      className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🧰 Coffre</Link>
        </div>

        <p className="text-center text-sm text-gray-400">Progression sauvegardée automatiquement</p>
      </div>

      <SelectProfileModal open={openCats} onClose={() => setOpenCats(false)} />
      <SelectDurationModal open={durationModal} onClose={() => setDurationModal(false)} onStart={startWithDuration} />
    </main>
  );
}

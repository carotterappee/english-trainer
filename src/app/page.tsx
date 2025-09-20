
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasProfile, loadProfile } from "@/lib/profile";
import { useEffect, useState } from "react";
import SelectProfileModal from "@/components/SelectProfileModal";
import SelectDurationModal from "@/components/SelectDurationModal";
import CloudBackground from "@/components/CloudBackground";
import { hasActiveSession, startSession } from "@/lib/session";



export default function Home() {
  const router = useRouter();
  const [profileModal, setProfileModal] = useState(false);
  const [durationModal, setDurationModal] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => { setActive(hasActiveSession()); }, []);

  const onPrimary = () => {
    if (!hasProfile()) return setProfileModal(true);
    if (active) return router.push("/mission");
    setDurationModal(true);
  };

  const startWithDuration = (minutes: number) => {
    const p = loadProfile();
    if (!p) return setProfileModal(true);
    startSession(p, minutes);
    router.push("/mission");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6">
      <CloudBackground />
      {/* Overlays décoratifs */}
      <div className="moon" />
      <div className="stars l1" />
      <div className="stars l2" />
      <div className="meteor" />
      <div className="stars" />
      <div className="waves" />
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700">🌍 English Trainer</h1>
        <p className="text-center text-gray-600">Ta mission du jour en anglais — 15 minutes chrono.</p>



        <button onClick={onPrimary}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl shadow-lg transition">
          {active ? "▶️ Continuer la mission" : "🚀 Commencer (choisir durée)"}
        </button>



        <div className="grid grid-cols-4 gap-3">
          <Link href="/progress"   className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">📈 Progression</Link>
          <Link href="/flashcards" className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🧠 Flashcards</Link>
          <Link href="/chest"      className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🧰 Coffre</Link>
          <Link href="/shop"       className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🎨 Thèmes</Link>
        </div>

        <p className="text-center text-sm text-gray-400">Progression sauvegardée automatiquement</p>
      </div>



      <SelectProfileModal open={profileModal} onClose={() => setProfileModal(false)} onDone={() => setDurationModal(true)} />
      <SelectDurationModal open={durationModal} onClose={() => setDurationModal(false)} onStart={startWithDuration} />
    </main>
  );
}


"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasProfile } from "@/lib/profile";
import { useState } from "react";
import SelectProfileModal from "@/components/SelectProfileModal";
import CloudBackground from "@/components/CloudBackground";

export default function Home() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const start = () => {
    if (hasProfile()) router.push("/mission");
    else setModalOpen(true);
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

        <button
          onClick={start}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl shadow-lg transition"
        >
          🚀 Commencer la mission
        </button>



        <div className="grid grid-cols-4 gap-3">
          <Link href="/progress"   className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">📈 Progression</Link>
          <Link href="/flashcards" className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🧠 Flashcards</Link>
          <Link href="/chest"      className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🧰 Coffre</Link>
          <Link href="/shop"       className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition">🎨 Thèmes</Link>
        </div>

        <p className="text-center text-sm text-gray-400">Progression sauvegardée automatiquement</p>
      </div>

      <SelectProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDone={() => router.push("/mission")}
      />
    </main>
  );
}

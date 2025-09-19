import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          🌍 English Trainer
        </h1>
        <p className="text-center text-gray-600">
          Ta mission du jour en anglais — 15 minutes chrono.
        </p>

        <Link
          href="/mission"
          className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl shadow-lg transition"
        >
          🚀 Commencer la mission
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/progress"
            className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition"
          >
            📈 Progression
          </Link>
          <Link
            href="/settings"
            className="text-center rounded-2xl border py-2 hover:bg-indigo-50 transition"
          >
            ⚙️ Réglages
          </Link>
        </div>

        <p className="text-center text-sm text-gray-400">
          Progression sauvegardée automatiquement
        </p>
      </div>
    </main>
  );
}

"use client";
import { loadWallet } from "@/lib/coins";

function Coin({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{
        width: size, height: size,
        background: "radial-gradient(circle at 30% 30%, #ffd7f2, #ff63c3 60%, #b11c8c)",
        boxShadow: "0 6px 16px rgba(255, 99, 195, .35), inset 0 2px 6px rgba(255,255,255,.6)",
      }}
      aria-hidden
    />
  );
}

export default function Chest() {
  const w = loadWallet();
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-3">🧰 Treasure Chest</h1>

      <div className="p-6 rounded-3xl border bg-white flex items-center gap-4">
        <Coin size={40} />
        <div className="text-3xl font-bold">{w.balance}</div>
        <div className="text-gray-500">pièces</div>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">Dernières sessions</h2>
        {w.history.length === 0 ? (
          <p className="text-gray-600">Aucune pièce pour l’instant. Fais une mission 🙂</p>
        ) : (
          <ul className="space-y-2">
            {w.history.map(h => (
              <li key={h.id} className="p-3 rounded-2xl border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coin />
                  <span className="font-medium">+{h.coins}</span>
                </div>
                <span className="text-sm text-gray-500">{new Date(h.date).toLocaleString()} • {h.goal}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}


"use client";
import { useEffect, useMemo, useState } from "react";
import { progressByDay, loadProgress } from "@/lib/progress";

function fmtMin(sec: number) { return Math.round(sec/60); }
function pct(ok: number, tot: number) { return tot ? Math.round((ok/tot)*100) : 0; }

export default function ProgressPage() {
  const [rows, setRows] = useState<Array<{date:string; attempts:number; correct:number; coins:number; durationSec:number}>>([]);
  const [total, setTotal] = useState({ sessions: 0, minutes: 0, coins: 0, acc: 0 });

  useEffect(() => {
    const days = progressByDay();
    setRows(days);
    const all = loadProgress();
    const minutes = all.reduce((a, e) => a + e.durationSec, 0) / 60;
    const coins = all.reduce((a, e) => a + e.coins, 0);
    const attempts = all.reduce((a, e) => a + e.attempts, 0);
    const correct  = all.reduce((a, e) => a + e.correct, 0);
    setTotal({
      sessions: all.length,
      minutes: Math.round(minutes),
      coins,
      acc: pct(correct, attempts),
    });
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Progression</h1>

      <section className="p-5 rounded-3xl border bg-white grid sm:grid-cols-4 gap-4">
        <Stat label="Sessions" value={total.sessions} />
        <Stat label="Minutes"  value={total.minutes} />
        <Stat label="Pièces"   value={total.coins} />
        <Stat label="Précision" value={`${total.acc}%`} />
      </section>

      <section className="p-5 rounded-3xl border bg-white space-y-3">
        <h2 className="text-lg font-medium">Par jour</h2>
        <div className="divide-y">
          {rows.length === 0 && (
            <div className="text-sm text-gray-500">Pas encore de données. Termine une session pour voir ta progression ici.</div>
          )}
          {rows.map((r) => (
            <div key={r.date} className="py-3 flex items-center gap-3">
              <div className="w-28 font-mono text-sm text-gray-600">{r.date}</div>
              <div className="text-sm">✅ {r.correct}/{r.attempts} ({pct(r.correct, r.attempts)}%)</div>
              <div className="ml-auto text-sm">{fmtMin(r.durationSec)} min</div>
              <div className="ml-4 text-sm">🪙 {r.coins}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

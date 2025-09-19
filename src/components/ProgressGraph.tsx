"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { loadProgress, toSeries, computeStreak } from "@/lib/progressStore";

export default function ProgressGraph() {
  const [series, setSeries] = useState<{date:string; score:number; minutes:number}[]>([]);
  const [streak, setStreak] = useState(0);
  const [tz, setTz] = useState("");

  useEffect(() => {
    const p = loadProgress();
    setSeries(toSeries(p));
    setStreak(computeStreak(p));
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <h2 className="text-xl font-semibold">Évolution du score</h2>
        <span className="text-sm opacity-70">Fuseau : {tz}</span>
        <span className="ml-auto rounded-full px-3 py-1 bg-green-100 text-green-800 text-sm">
          🔥 Streak : {streak} jour{streak>1?"s":""}
        </span>
      </div>

      <div className="h-64 w-full rounded-2xl border p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-48 w-full rounded-2xl border p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

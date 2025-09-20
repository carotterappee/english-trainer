"use client";
import { useEffect, useState } from "react";
import { THEMES, type ThemeId } from "@/lib/themes";
import { getOwned, setOwned, isOwned, getSelected, setSelected, getDynamicTZ, setDynamicTZ } from "@/lib/themeStore";
import { loadWallet, spendCoins } from "@/lib/coins";
import Link from "next/link";

export default function Shop() {
  const [owned, setOwnedState] = useState<ThemeId[]>([]);
  const [selected, setSelectedState] = useState<ThemeId>("clouds");
  const [balance, setBalance] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [tz, setTz] = useState("Europe/Paris");
  useEffect(() => { setTz(getDynamicTZ()); }, []);

  useEffect(() => {
    setOwnedState(getOwned());
    setSelectedState(getSelected());
    setBalance(loadWallet().balance);
  }, []);

  function buy(id: ThemeId, price: number) {
    if (isOwned(id)) return;
    const r = spendCoins(price);
    if (!r.ok) { setMsg("Pas assez de pièces."); return; }
    setBalance(r.balance);
    const next = Array.from(new Set([...owned, id]));
    setOwned(next); setOwnedState(next);
    setMsg("Acheté ! 🎉");
  }
  function apply(id: ThemeId) {
    if (!isOwned(id)) return;
    setSelected(id); setSelectedState(id);
    if (id === "dynamic") {
      // applique tout de suite la phase courante (sinon ThemeMount s’en charge dans la minute)
      const zone = getDynamicTZ() === "auto"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : getDynamicTZ();
      const h = new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hour12: false, timeZone: zone }).format(new Date());
      const hour = Number(h);
      const phase = (hour >= 21 || hour < 6) ? "night" : ((hour >= 6 && hour < 8) || (hour >= 18 && hour < 21)) ? "sunset" : "clouds";
      document.documentElement.setAttribute("data-theme", phase);
      window.dispatchEvent(new CustomEvent("themechange", { detail: phase }));
    } else {
      document.documentElement.setAttribute("data-theme", id);
      window.dispatchEvent(new CustomEvent("themechange", { detail: id }));
    }
    setMsg("Thème appliqué.");
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Shop des thèmes</h1>
        <span className="ml-auto text-sm rounded-full border px-3 py-1">💰 {balance} pièces</span>
      </div>

      {msg && <div className="rounded-2xl bg-emerald-50 text-emerald-800 px-3 py-2">{msg}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        {THEMES.map(t => {
          const ownedFlag = owned.includes(t.id);
          const isSelected = selected === t.id;
          return (
            <div key={t.id} className="p-4 rounded-2xl border bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <div className="font-medium">{t.name}</div>
                {isSelected && <span className="ml-auto text-xs rounded-full bg-indigo-600 text-white px-2 py-0.5">actif</span>}
              </div>
              <Preview id={t.id} />
              {t.id === "dynamic" && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Fuseau&nbsp;:</label>
                  <select
                    value={tz}
                    onChange={(e) => { setTz(e.target.value); setDynamicTZ(e.target.value); }}
                    className="rounded-xl border px-2 py-1"
                    title="Fuseau horaire utilisé pour le mode Auto"
                  >
                    <option value="Europe/Paris">Europe/Paris (Paris)</option>
                    <option value="auto">Auto (navigateur)</option>
                    <option value="Europe/London">Europe/London (Londres)</option>
                    <option value="America/New_York">America/New_York (New York)</option>
                  </select>
                </div>
              )}
              <div className="flex gap-2">
                {!ownedFlag ? (
                  <button onClick={() => buy(t.id, t.price)} className="flex-1 rounded-2xl bg-indigo-600 text-white py-2">
                    Acheter · {t.price}
                  </button>
                ) : (
                  <button onClick={() => apply(t.id)} className="flex-1 rounded-2xl border py-2 hover:bg-indigo-50">
                    Appliquer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Preview({ id }: { id: ThemeId }) {
  const style: Record<ThemeId, string> = {
    clouds: "bg-gradient-to-b from-sky-100 via-indigo-50 to-white",
    night:  "bg-[radial-gradient(ellipse_at_20%_10%,#1b2340,#0b1024_60%,#080c1a)]",
    sunset: "bg-gradient-to-b from-[#ff9a9e] via-[#fecfef] to-[#f6d365]",
    paper:  "bg-[#f7f4ef]",
    dynamic: "bg-gradient-to-r from-[#ff9a9e] via-[#f7fbff] to-[#0b1024]"
  };
  return <div className={`h-24 rounded-xl border ${style[id]}`} />;
}


"use client";

import { useEffect, useState } from "react";
import Coin from "@/components/Coin";
import { loadWallet, spendCoins } from "@/lib/coins";
import { THEMES, type ThemeId } from "@/lib/themes";
import {
  getOwned, setOwned, isOwned,
  getSelected, setSelected,
  getDynamicTZ, setDynamicTZ
} from "@/lib/themeStore";

export default function ChestPage() {
  const [balance, setBalance] = useState(0);
  const [owned, setOwnedState] = useState<ThemeId[]>([]);
  const [selected, setSelectedState] = useState<ThemeId>("clouds");
  const [tz, setTz] = useState("Europe/Paris");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setBalance(loadWallet().balance);
    setOwnedState(getOwned());
    setSelectedState(getSelected());
    setTz(getDynamicTZ());
  }, []);

  function applyThemeImmediate(id: ThemeId) {
    document.documentElement.setAttribute("data-theme", id);
    window.dispatchEvent(new CustomEvent("themechange", { detail: id }));
  }

  function buy(id: ThemeId, price: number) {
    if (isOwned(id)) return;
    const r = spendCoins(price);
    if (!r.ok) { setMsg("Pas assez de pièces."); return; }
    setBalance(r.balance);
    const next = Array.from(new Set([...owned, id]));
    setOwned(next);
    setOwnedState(next);
    setMsg("Acheté ! 🎉");
  }

  function apply(id: ThemeId) {
    if (!isOwned(id)) return;
    setSelected(id);
    setSelectedState(id);

    if (id === "dynamic") {
      // applique la phase courante maintenant (sinon ThemeMount le fera à la minute)
      const zone = getDynamicTZ() === "auto"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : getDynamicTZ();
      const hour = Number(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hour12: false, timeZone: zone }).format(new Date()));
      const phase: ThemeId = (hour >= 21 || hour < 6) ? "night" : ((hour >= 6 && hour < 8) || (hour >= 18 && hour < 21)) ? "sunset" : "clouds";
      applyThemeImmediate(phase);
    } else {
      applyThemeImmediate(id);
    }
    setMsg("Thème appliqué.");
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Coffre</h1>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <Coin size={20} />
          <span className="font-medium">{balance}</span>
          <span className="text-gray-500">pièces</span>
        </div>
      </header>

      {msg && (
        <div className="rounded-2xl bg-emerald-50 text-emerald-800 px-3 py-2">{msg}</div>
      )}

      {/* --- Thèmes à acheter / appliquer --- */}
      <section className="p-5 rounded-3xl border bg-white space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">🎨 Thèmes</span>
          <span className="ml-auto text-xs rounded-full border px-2 py-0.5">
            Actif : {prettyTheme(selected)}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {THEMES.map(t => {
            const ownedFlag = owned.includes(t.id);
            const isActive = selected === t.id;
            return (
              <div key={t.id} className="p-4 rounded-2xl border bg-white flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.emoji}</span>
                  <div className="font-medium">{t.name}</div>
                  {isActive && (
                    <span className="ml-auto text-xs rounded-full bg-indigo-600 text-white px-2 py-0.5">
                      actif
                    </span>
                  )}
                </div>

                <Preview id={t.id} />

                {t.id === "dynamic" && ownedFlag && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Fuseau&nbsp;:</label>
                    <select
                      value={tz}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTz(val);
                        setDynamicTZ(val);
                        if (selected === "dynamic") apply("dynamic");
                      }}
                      className="rounded-xl border px-2 py-1"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="auto">Auto (navigateur)</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-2">
                  {!ownedFlag ? (
                    <button
                      onClick={() => buy(t.id, t.price)}
                      className="flex-1 rounded-2xl bg-indigo-600 text-white py-2"
                    >
                      Acheter · {t.price}
                    </button>
                  ) : (
                    <button
                      onClick={() => apply(t.id)}
                      className="flex-1 rounded-2xl border py-2 hover:bg-indigo-50"
                    >
                      Appliquer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500">
          Astuce : les thèmes restent sur cet appareil une fois achetés.
        </p>
      </section>
    </main>
  );
}

function prettyTheme(id: ThemeId) {
  switch (id) {
    case "clouds": return "Clouds";
    case "night": return "Night Sky";
    case "sunset": return "Sunset";
    case "paper": return "Paper";
    case "dynamic": return "Auto Jour/Nuit";
    default: return id;
  }
}

function Preview({ id }: { id: ThemeId }) {
  const style: Record<ThemeId, string> = {
    clouds: "bg-gradient-to-b from-sky-100 via-indigo-50 to-white",
    night:  "bg-[radial-gradient(ellipse_at_20%_10%,#1b2340,#0b1024_60%,#080c1a)]",
    sunset: "bg-gradient-to-b from-[#ff9a9e] via-[#fecfef] to-[#f6d365]",
    paper:  "bg-[#f7f4ef]",
    dynamic:"bg-gradient-to-r from-[#ff9a9e] via-[#f7fbff] to-[#0b1024]"
  };
  return <div className={`h-20 rounded-xl border ${style[id]}`} />;
}

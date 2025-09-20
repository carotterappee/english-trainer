import type { Goal } from "@/lib/profile";

export type WalletEntry = { id: string; date: string; coins: number; goal: Goal };
export type Wallet = { balance: number; history: WalletEntry[] };

const KEY = "wallet:v1";

export function loadWallet(): Wallet {
  if (typeof window === "undefined") return { balance: 0, history: [] };
  try { return JSON.parse(localStorage.getItem(KEY) || '{"balance":0,"history":[]}'); }
  catch { return { balance: 0, history: [] }; }
}
function saveWallet(w: Wallet) {
  localStorage.setItem(KEY, JSON.stringify(w));
}
export function addCoins(coins: number, goal: Goal) {
  const w = loadWallet();
  w.balance += Math.max(0, Math.floor(coins));
  w.history.unshift({
    id: "e_" + Date.now().toString(36),
    date: new Date().toISOString(),
    coins: Math.max(0, Math.floor(coins)),
    goal,
  });
  saveWallet(w);
  return w;
}

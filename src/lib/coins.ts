export function spendCoins(coins: number) {
  const w = loadWallet();
  if (w.balance < coins) return { ok: false as const, balance: w.balance };
  w.balance -= coins;
  saveWallet(w);
  return { ok: true as const, balance: w.balance };
}
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
export function addCoins(coins: number, goal: string) {
  const w = loadWallet();
  w.balance += Math.max(0, Math.floor(coins));
  const entry: WalletEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    coins,
    goal: goal as unknown as import("@/lib/profile").Goal, // typage strict
  };
  w.history.unshift(entry);
  saveWallet(w);
  return w;
}

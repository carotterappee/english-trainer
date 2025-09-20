"use client";
import { useEffect, useState } from "react";
import { getSelected } from "@/lib/themeStore";


import { runMigrations } from "@/lib/migrations";
import { ensureProfileDefaults } from "@/lib/profile";


export default function ThemeMount() {
  const [t, setT] = useState<string>("clouds");
  useEffect(() => {
    runMigrations();
    ensureProfileDefaults();
    const id = getSelected();
    setT(id);
    document.documentElement.setAttribute("data-theme", id);
  }, []);
  return null;
}

"use client";
import { useEffect, useState } from "react";
import { getSelected } from "@/lib/themeStore";

export default function ThemeMount() {
  const [t, setT] = useState<string>("clouds");
  useEffect(() => {
    const id = getSelected();
    setT(id);
    document.documentElement.setAttribute("data-theme", id);
  }, []);
  return null;
}

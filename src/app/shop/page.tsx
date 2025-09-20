"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function ShopRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/chest"); }, [router]);
  return null;
}


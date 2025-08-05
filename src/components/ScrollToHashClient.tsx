"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToHashClient() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

  return null;
} 
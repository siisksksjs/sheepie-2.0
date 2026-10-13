// components/site/header-over-hero.tsx
"use client";

import { useEffect } from "react";

/** Keeps the fixed header transparent while #hero sits under it. */
export function HeaderOverHero() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    const hero = document.getElementById("hero");
    if (!header || !hero) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        header.dataset.over = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "-110px 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return null;
}

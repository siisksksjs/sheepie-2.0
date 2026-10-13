"use client";

import { useEffect } from "react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Dims #lights as it scrolls in. The scroll listener exists only while the band
 * is near the viewport, writes once per animation frame, and touches only
 * opacity and transform.
 */
export function LightsOutController() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const band = document.getElementById("lights");
    if (!band) return;
    const layer = (name: string) => band.querySelector<HTMLElement>(`[data-lights="${name}"]`)!;
    const sky = layer("sky");
    const far = layer("far");
    const near = layer("near");
    const content = layer("content");
    let ticking = false;

    const update = () => {
      ticking = false;
      const r = band.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = window.innerWidth <= 760 ? clamp((vh * 0.9 - r.top) / (vh * 0.7)) : clamp((vh * 0.6 - r.top) / (r.height - vh * 0.4));
      const dark = ease(0, 0.3, p);
      const rise = ease(0.15, 0.4, p);
      sky.style.opacity = String(dark);
      far.style.opacity = String(dark * 0.8);
      near.style.opacity = String(dark);
      far.style.transform = `translate3d(0, ${(-p * 80).toFixed(1)}px, 0)`;
      near.style.transform = `translate3d(0, ${(-p * 180).toFixed(1)}px, 0)`;
      content.style.opacity = String(rise);
      content.style.transform = `translate3d(0, ${((1 - rise) * 24).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(band);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

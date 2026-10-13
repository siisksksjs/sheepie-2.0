"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { initPixel, sendMetaEvent } from "@/lib/meta/client";
import { pageView } from "@/lib/meta/events";

/** Loads the pixel once and records a PageView on every route change. */
export function MetaPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (pixelId) initPixel(pixelId);
    } catch {
      // A broken pixel must never break the page.
    }
  }, [pixelId]);

  useEffect(() => {
    try {
      sendMetaEvent(pageView());
    } catch {
      // Tracking never interrupts the page.
    }
  }, [pathname]);

  return null;
}

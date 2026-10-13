"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { initPixel, sendMetaEvent } from "@/lib/meta/client";
import { pageView } from "@/lib/meta/events";

/** Loads the pixel once and records a PageView on every route change. */
export function MetaPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pixelId) initPixel(pixelId);
  }, [pixelId]);

  useEffect(() => {
    sendMetaEvent(pageView());
  }, [pathname]);

  return null;
}

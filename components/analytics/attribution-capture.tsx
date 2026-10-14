"use client";

import { useEffect } from "react";

import { captureAttribution } from "@/lib/attribution";

/** Remembers an ad's UTM tags from the landing URL so buy buttons can pass them on. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution(window.location.search);
  }, []);
  return null;
}

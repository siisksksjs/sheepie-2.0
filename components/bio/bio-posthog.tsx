"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/**
 * Traffic collection for /bio. PostHog supplies visitors, page views, referrers,
 * and the device/browser/OS/geo breakdowns that the dashboard reports.
 *
 * Behavioral events still go to /api/bio-events and Supabase; the two sources are
 * counted separately. Initialization is deliberately best-effort so an analytics
 * failure can never interfere with an outbound link.
 */
export function BioPostHog() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: true,
        capture_pageleave: true,
        // The page is a single static route; session recording and autocapture
        // would collect far more than this report needs.
        autocapture: false,
        disable_session_recording: true,
        persistence: "localStorage+cookie",
      });
    } catch {
      return;
    }
  }, []);

  return null;
}

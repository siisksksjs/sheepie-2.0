"use client";

import { useEffect, useRef } from "react";

import {
  createBioEventFactory,
  createOnce,
  reachedScrollDepths,
  resolveCtaDetails,
  sendBioEvent,
  type BioEventDetails,
} from "@/lib/bio-analytics/client";
import { PRODUCT_SLUGS, type BioProductSlug } from "@/lib/bio-analytics/contracts";
import { createBioSession } from "@/lib/bio-analytics/session";

const SECTION_VISIBILITY_RATIO = 0.35;

/**
 * Observes the bio page and reports anonymous engagement. Every code path is
 * best-effort: a tracking failure must never affect rendering or outbound links.
 */
export function BioTracker() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let session;
    try {
      session = createBioSession(window.localStorage, window.sessionStorage);
    } catch {
      return;
    }

    const startedAt = Date.now();
    const createEvent = createBioEventFactory({
      session,
      startedAt,
      now: () => Date.now(),
      newEventId: () => crypto.randomUUID(),
      language: navigator.language || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      screenWidth: () => window.innerWidth,
      referrer: document.referrer,
    });

    const once = createOnce();
    const emit = (details: BioEventDetails) => {
      try {
        sendBioEvent(createEvent(details));
      } catch {
        // Session or transport failures are non-fatal by design.
      }
    };

    emit({
      event_name: "bio_page_view",
      section_id: null,
      product_slug: null,
      cta_id: null,
      cta_position: null,
      destination: null,
      scroll_depth: null,
    });

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-bio-track-section]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < SECTION_VISIBILITY_RATIO) continue;

          const element = entry.target as HTMLElement;
          const sectionId = element.dataset.bioTrackSection;
          if (!sectionId) continue;

          once(`section:${sectionId}`, () =>
            emit({
              event_name: "bio_section_view",
              section_id: sectionId,
              product_slug: null,
              cta_id: null,
              cta_position: null,
              destination: null,
              scroll_depth: null,
            }),
          );

          const product = element.dataset.bioProduct;
          if (product && PRODUCT_SLUGS.includes(product as BioProductSlug)) {
            once(`product:${product}`, () =>
              emit({
                event_name: "bio_product_view",
                section_id: sectionId,
                product_slug: product as BioProductSlug,
                cta_id: null,
                cta_position: null,
                destination: null,
                scroll_depth: null,
              }),
            );
          }

          observer.unobserve(element);
        }
      },
      { threshold: [SECTION_VISIBILITY_RATIO] },
    );

    for (const section of sections) observer.observe(section);

    const reportScroll = () => {
      const depths = reachedScrollDepths(
        window.scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight,
      );
      for (const depth of depths) {
        once(`scroll:${depth}`, () =>
          emit({
            event_name: "bio_scroll_depth",
            section_id: null,
            product_slug: null,
            cta_id: null,
            cta_position: null,
            destination: null,
            scroll_depth: depth,
          }),
        );
      }
    };

    let scrollFrame = 0;
    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        reportScroll();
      });
    };

    reportScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Capture phase so the event is recorded even if a handler stops propagation.
    // The default action is never prevented: navigation stays independent of analytics.
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const cta = target.closest<HTMLElement>("[data-bio-cta]");
      if (!cta) return;

      const details = resolveCtaDetails((name) => cta.getAttribute(name));
      if (!details) return;

      emit(details);

      if (details.event_name === "bio_outbound_click") {
        try {
          void import("posthog-js").then(({ default: posthog }) => {
            posthog.capture("bio_outbound_click", {
              cta_id: details.cta_id,
              cta_position: details.cta_position,
              section_id: details.section_id,
              destination: details.destination,
              product_slug: details.product_slug,
            });
          });
        } catch {
          // PostHog is an optional mirror for aggregate correlation.
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick, { capture: true });
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return null;
}

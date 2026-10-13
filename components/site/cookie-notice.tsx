"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";

import styles from "./cookie-notice.module.css";

const KEY = "sheepie-cookie-notice";
const copy: Record<Locale, { text: string; ok: string }> = {
  id: { text: "Kami memakai cookie untuk analitik dan iklan agar situs ini lebih baik.", ok: "Oke" },
  en: { text: "We use cookies for analytics and ads to improve this site.", ok: "Okay" },
};

export function CookieNotice({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissed = true;
    try {
      dismissed = !!localStorage.getItem(KEY);
    } catch {
      // Storage blocked: stay quiet rather than nag on every page.
    }
    if (dismissed) return;

    // Wait for a little scrolling so the notice never covers the landing view.
    const onScroll = () => {
      if (window.scrollY < 200) return;
      window.removeEventListener("scroll", onScroll);
      setOpen(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!open) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // Ignore; closing for this view is enough.
    }
    setOpen(false);
  };

  return (
    <div className={styles.notice} role="region" aria-label="Cookie">
      <p>{copy[locale].text}</p>
      <button type="button" onClick={dismiss}>{copy[locale].ok}</button>
    </div>
  );
}

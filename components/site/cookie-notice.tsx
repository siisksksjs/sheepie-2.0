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
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state after mount to keep SSR markup stable
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      // Storage blocked: stay quiet rather than nag on every page.
    }
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

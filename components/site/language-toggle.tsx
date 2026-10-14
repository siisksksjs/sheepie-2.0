// components/site/language-toggle.tsx
"use client";

import { useEffect, useState } from "react";

import { locales, type Locale } from "@/i18n/config";

const LOCALE_PREFIX = /^\/(id|en)(?=\/|$)/;

/**
 * ID | EN segmented switch. Each side links to the same page in that language;
 * the paths are read after mount so the server markup stays stable.
 */
export function LanguageToggle({ locale, className }: { locale: Locale; className?: string }) {
  const [paths, setPaths] = useState<Record<Locale, string>>({ id: "/id", en: "/en" });

  useEffect(() => {
    const path = window.location.pathname;
    const tail = window.location.search;
    const to = (l: Locale) => (LOCALE_PREFIX.test(path) ? path.replace(LOCALE_PREFIX, `/${l}`) + tail : `/${l}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state after mount to keep SSR markup stable
    setPaths({ id: to("id"), en: to("en") });
  }, []);

  return (
    <span className={className} role="group" aria-label="Language">
      {locales.map((l) => (
        <a key={l} href={paths[l]} hrefLang={l} aria-current={l === locale ? "true" : undefined} data-language-switch={l}>
          {l.toUpperCase()}
        </a>
      ))}
    </span>
  );
}

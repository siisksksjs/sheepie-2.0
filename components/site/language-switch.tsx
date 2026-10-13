// components/site/language-switch.tsx
"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import { siteCopy } from "@/lib/site/copy";

const LOCALE_PREFIX = /^\/(id|en)(?=\/|$)/;

/**
 * Links to the same page in the other language. Reads the path after mount
 * (no next/navigation hook) so it also renders outside the App Router, e.g. in tests.
 */
export function LanguageSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const target: Locale = locale === "id" ? "en" : "id";
  const [href, setHref] = useState(`/${target}`);

  useEffect(() => {
    const path = window.location.pathname;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state after mount to keep SSR markup stable
    setHref(LOCALE_PREFIX.test(path) ? path.replace(LOCALE_PREFIX, `/${target}`) + window.location.search : `/${target}`);
  }, [target]);

  return (
    <a href={href} hrefLang={target} className={className} data-language-switch>
      {siteCopy[locale].language.switchTo}
    </a>
  );
}

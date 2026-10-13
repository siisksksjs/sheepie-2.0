import { useLocale } from "next-intl";

import { SiteFooter } from "@/components/site/site-footer";
import { defaultLocale, isLocale } from "@/i18n/config";

/** Phase 2 pages still import Footer; they now get the new footer. */
export function Footer() {
  const locale = useLocale();
  return <SiteFooter locale={isLocale(locale) ? locale : defaultLocale} />;
}

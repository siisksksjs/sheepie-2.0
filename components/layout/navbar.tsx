import { useLocale } from "next-intl";

import { SiteHeader } from "@/components/site/site-header";
import { defaultLocale, isLocale } from "@/i18n/config";

/** Phase 2 pages still import Navbar; they now get the new header. */
export function Navbar() {
  const locale = useLocale();
  return <SiteHeader locale={isLocale(locale) ? locale : defaultLocale} />;
}

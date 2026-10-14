import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/config";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  // Always open in Bahasa Indonesia; English only when the visitor picks it.
  localeDetection: false,
});

export const config = {
  // Match all pathnames except API routes, Next.js internals, the standalone
  // /bio and /go routes, and static files.
  matcher: ["/((?!api|_next|bio(?:/|$)|go(?:/|$)|.*\\..*).*)"],
};

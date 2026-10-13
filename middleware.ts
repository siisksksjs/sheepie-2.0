import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n/config";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
});

export const config = {
  // Match all pathnames except API routes, Next.js internals, the standalone
  // /bio and /go routes, and static files.
  matcher: ["/((?!api|_next|bio(?:/|$)|go(?:/|$)|.*\\..*).*)"],
};

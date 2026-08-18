import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'id'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals
  // - Standalone /bio page (outside next-intl)
  // - Static files
  matcher: ['/((?!api|_next|bio(?:/|$)|.*\\..*).*)']
};

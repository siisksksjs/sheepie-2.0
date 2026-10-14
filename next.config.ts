import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

import retiredPosts from "./data/retired-posts.json";
 
const withNextIntl = createNextIntlPlugin();

const LOCALES = ["id", "en"] as const;

const nextConfig: NextConfig = {
  // The first blog (13 articles) was retired; each old article URL points permanently
  // at the product it was about, or the home page, so links and search rankings carry over.
  async redirects() {
    // The Sheepie x Yoga spin-wheel event has ended.
    const endedEvent = [
      { source: "/sheepie-x-yoga-spin", destination: "/id", permanent: true },
      ...LOCALES.map((locale) => ({ source: `/${locale}/sheepie-x-yoga-spin`, destination: `/${locale}`, permanent: true })),
    ];
    return [...endedEvent, ...retiredPosts.flatMap(({ slug, to }) => [
      { source: `/blog/${slug}`, destination: `/id${to}`, permanent: true },
      ...LOCALES.map((locale) => ({ source: `/${locale}/blog/${slug}`, destination: `/${locale}${to}`, permanent: true })),
    ])];
  },
  experimental: {
    // Inline the (small) CSS into the HTML so first paint does not wait on a stylesheet request.
    inlineCss: true,
  },
};

export default withNextIntl(nextConfig);

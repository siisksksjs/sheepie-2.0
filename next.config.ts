import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    // Inline the (small) CSS into the HTML so first paint does not wait on a stylesheet request.
    inlineCss: true,
  },
};

export default withNextIntl(nextConfig);

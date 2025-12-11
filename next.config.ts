import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    unoptimized: true,
  },
};

// export default withPWA(nextConfig);
export default nextConfig;

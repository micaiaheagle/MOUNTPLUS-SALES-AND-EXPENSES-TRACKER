import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for Cloudflare Pages
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

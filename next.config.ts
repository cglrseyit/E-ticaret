import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local placeholder product images are SVGs; allow next/image to serve them.
    // (These are our own trusted assets.)
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [],
  },
};

export default nextConfig;

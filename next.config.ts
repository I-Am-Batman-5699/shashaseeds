import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ignoreDuringBuilds: true
    dirs: ["src/app", "src/components", "src/lib"],
  }
};

export default nextConfig;

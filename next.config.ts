import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/TrueCalc',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages deployment configuration
  basePath: process.env.NODE_ENV === 'production' ? '/QNA-task' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/QNA-task/' : '',
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias['@/lib'] = path.resolve(__dirname, 'lib');
    return config;
  }
};

export default nextConfig;

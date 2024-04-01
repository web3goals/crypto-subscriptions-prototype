/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // Fix for Pinata
    config.externals.push("pino-pretty", "encoding"); // Fix for RainbowKit
    return config;
  },
};

export default nextConfig;

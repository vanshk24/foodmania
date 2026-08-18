import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/.next/**",
        "C:/*.sys",
        "C:/*.tmp",
      ],
    };
    return config;
  },
  transpilePackages: [
    "@food-mania/ui",
    "@food-mania/shared",
    "@food-mania/utils",
    "@food-mania/theme",
    "@food-mania/types",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.foodmania.com" },
      { protocol: "https", hostname: "cdn.foodmania.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

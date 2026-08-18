/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@food-mania/ui",
    "@food-mania/shared",
    "@food-mania/utils",
    "@food-mania/theme",
    "@food-mania/types",
  ],
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "C:/*.sys",
          "C:/*.tmp",
          "C:/DumpStack.log.tmp",
          "C:/hiberfil.sys",
          "C:/pagefile.sys",
          "C:/swapfile.sys",
        ],
      };
    }
    return config;
  },
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

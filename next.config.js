/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  output: "standalone",
  assetPrefix: process.env.BASE_PATH || undefined,
  basePath: process.env.BASE_PATH || ""
};

module.exports = nextConfig;

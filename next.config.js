/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  output: "standalone",
  assetPrefix: process.env.BASE_PATH || undefined,
  basePath: process.env.BASE_PATH || "",
  async rewrites() {
    return [
      {
        source: "/:acct(@[a-zA-Z0-9_-]+)",
        destination: "/user/:acct"
      },
      {
        source: "/:acct(@[a-zA-Z0-9_-]+)/:id",
        destination: "/user/:acct/:id"
      }
    ];
  }
};

module.exports = nextConfig;

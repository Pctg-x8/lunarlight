/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  async rewrites() {
    return [
      {
        source: "/:acct(@[a-zA-Z0-9_@.-]+)",
        destination: "/user/:acct",
      },
      {
        source: "/:acct(@[a-zA-Z0-9_@.-]+)/:id",
        destination: "/user/:acct/:id",
      },
    ];
  },
  webpack: cfg => {
    cfg.resolve.alias.os = false;
    cfg.resolve.alias["child_process"] = false;
    cfg.resolve.alias["fs"] = false;
    cfg.resolve.alias["path"] = false;
    return cfg;
  },
};

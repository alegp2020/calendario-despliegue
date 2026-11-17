import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["alexandra-virtualbox.tailf6d070.ts.net"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'recruitmentrawaes.sgp1.digitaloceanspaces.com',
      },
    ],
  },
};

export default nextConfig;

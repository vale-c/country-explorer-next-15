import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    minimumCacheTTL: 3600,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'country-explorer-next-15.vercel.app'],
    },
  },
};

export default nextConfig;

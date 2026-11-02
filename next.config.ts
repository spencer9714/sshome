import type { NextConfig } from 'next';
import { airbnbUrl, stays } from './src/data/stays';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/go/desert', destination: airbnbUrl(stays[0]), permanent: false },
      { source: '/go/family', destination: airbnbUrl(stays[1]), permanent: false },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

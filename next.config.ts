import type { NextConfig } from 'next';
import config from './src/data/tracking-config.json';

const nextConfig: NextConfig = {
  async redirects() {
    // Short links resolve by listing key, so reordering homes never changes a destination.
    return Object.entries(config.listings).map(([key, listing]) => ({
      source: `/go/${key}`,
      destination: `https://www.airbnb.com/rooms/${listing.id}`,
      permanent: false,
    }));
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

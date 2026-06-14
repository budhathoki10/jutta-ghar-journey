/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
      { hostname: 'api.cloudinary.com' },
    ],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      type: 'asset/resource',
    });

    if (isServer) {
      const cacheGroups = config.optimization?.splitChunks?.cacheGroups;
      if (cacheGroups?.vendor) {
        cacheGroups.vendor.filename = 'chunks/[name].js';
      }
    }

    return config;
  },
};

module.exports = nextConfig;

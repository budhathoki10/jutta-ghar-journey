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
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig;

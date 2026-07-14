/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com', 'img.clerk.com'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },
};

export default nextConfig;

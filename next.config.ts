/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // --- ADD THIS 'IMAGES' BLOCK ---
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/static/uploads/**',
      },
    ],
  },
  // --------------------------------

  // Add this line for Capacitor
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this line for Capacitor
  output: 'export',
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // prevent ESLint from breaking Netlify builds
  },
  experimental: {
    serverActions: true // if you're using server actions
  }
}

module.exports = nextConfig

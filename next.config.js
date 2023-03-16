/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== 'production'
})
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  }
})
module.exports = nextConfig
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone mode for better deployment compatibility
  output: 'standalone',
  
  // Handle images properly for all environments
  images: {
    domains: ['localhost', 'your-netlify-site.netlify.app'], // Add your domains here
  },
  
  // Environment variables handling
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: false, // Enable PWA in development too
  register: true,
  skipWaiting: true,
});

export default pwaConfig(nextConfig);
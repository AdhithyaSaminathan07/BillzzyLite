import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone mode for better deployment compatibility
  output: 'standalone',
  
  // Ensure proper handling of environment variables
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  
  // Handle images properly for all environments
  images: {
    domains: ['localhost', 'your-netlify-site.netlify.app'], // Add your Netlify domain here
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default pwaConfig(nextConfig);
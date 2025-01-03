import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['livdata.online'],
    
  },
  target: 'serverless',
};

export default nextConfig;

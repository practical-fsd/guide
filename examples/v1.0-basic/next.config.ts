import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Compiler (experimental in Next.js 15)
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;

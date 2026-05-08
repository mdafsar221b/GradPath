import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    const proxyTarget = process.env.API_PROXY_TARGET?.trim()
      || (publicApiUrl && /^https?:\/\//i.test(publicApiUrl) ? publicApiUrl : '');
    if (!proxyTarget) {
      return [];
    }

    const normalizedTarget = proxyTarget.replace(/\/+$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${normalizedTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const internalApiUrl =
      process.env.INTERNAL_API_URL || "http://127.0.0.1:5001";
    return [
      {
        source: "/api/:path*",
        destination: `${internalApiUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${internalApiUrl}/uploads/:path*`,
      },
    ];
  },


  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "kevasiya.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "57.128.189.225",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "100.66.61.11",
        port: "5006",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "100.66.61.11",
        port: "1337",
        pathname: "/**",
      },
      // WordPress image patterns
      {
        protocol: "https",
        hostname: "kevasiya.com",
        pathname: "/cms-blog/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "kevasiya.com",
        pathname: "/wp-content/**",
      },
    ],
  },
};

export default nextConfig;
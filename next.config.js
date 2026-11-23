/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The login page used to live at /admin/login; keep old bookmarks working.
    return [{ source: "/admin/login", destination: "/login", permanent: false }];
  },
  async rewrites() {
    // Proxy /api/v1/* to the backend so auth cookies are first-party
    // (vercel.app is a public suffix, so cross-site cookies get blocked).
    const target = (process.env.API_PROXY_TARGET || "").replace(/\/+$/, "");
    if (!target) return [];
    return [{ source: "/api/v1/:path*", destination: `${target}/api/v1/:path*` }];
  },
  images: {
    // Swap/add your real image hosts here before launch.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

module.exports = nextConfig;

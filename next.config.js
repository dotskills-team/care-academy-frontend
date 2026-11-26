// Uploaded media is served by the API, so next/image has to allow that host. In proxy
// mode NEXT_PUBLIC_API_URL is relative and the host comes from API_PROXY_TARGET.
const uploadPatterns = () => {
  const url = [process.env.NEXT_PUBLIC_API_URL, process.env.API_PROXY_TARGET, "http://localhost:5000"].find(
    (value) => /^https?:\/\//.test(value || ""),
  );
  const { protocol, hostname, port } = new URL(url);
  return [{ protocol: protocol.slice(0, -1), hostname, port, pathname: "/uploads/**" }];
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Without this, moving between pages can reuse a copy up to 30 seconds old in the browser
  experimental: { staleTimes: { dynamic: 0 } },
  async redirects() {
    // The login page used to live at /admin/login; keep old bookmarks working.
    return [{ source: "/admin/login", destination: "/login", permanent: false }];
  },
  async rewrites() {
    // Proxy /api/v1/* to the backend so auth cookies are first-party
    // (vercel.app is a public suffix, so cross-site cookies get blocked).
    const target = (process.env.API_PROXY_TARGET || "").replace(/\/+$/, "");
    if (!target) return [];
    return [
      { source: "/api/v1/:path*", destination: `${target}/api/v1/:path*` },
      // Uploaded media, so the admin panel can preview it through the same proxy
      { source: "/uploads/:path*", destination: `${target}/uploads/:path*` },
    ];
  },
  images: {
    // Swap/add your real image hosts here before launch.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      ...uploadPatterns(),
    ],
  },
};

module.exports = nextConfig;

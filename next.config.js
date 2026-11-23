/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The login page used to live at /admin/login; keep old bookmarks working.
    return [{ source: "/admin/login", destination: "/login", permanent: false }];
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

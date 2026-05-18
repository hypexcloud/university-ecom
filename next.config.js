/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    domains: ["university-ecom.com"],
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://client.crisp.chat https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://client.crisp.chat",
              "img-src 'self' data: blob: https://*.supabase.co https://*.b-cdn.net https://*.stripe.com",
              "font-src 'self' data: https://client.crisp.chat",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://client.crisp.chat wss://client.relay.crisp.chat https://*.b-cdn.net",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://o4512011724587008.ingest.us.sentry.io;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' blob: data: https:;
  connect-src 'self' https://o4512011724587008.ingest.us.sentry.io https://accounts.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/invoices/:path*",
        destination: "/app/invoices/:path*",
        permanent: false,
      },
      {
        source: "/clients/:path*",
        destination: "/app/clients/:path*",
        permanent: false,
      },
      {
        source: "/projects/:path*",
        destination: "/app/projects/:path*",
        permanent: false,
      },
      {
        source: "/products/:path*",
        destination: "/app/products/:path*",
        permanent: false,
      },
      {
        source: "/expenses/:path*",
        destination: "/app/expenses/:path*",
        permanent: false,
      },
      {
        source: "/reports/:path*",
        destination: "/app/reports/:path*",
        permanent: false,
      },
      {
        source: "/settings/:path*",
        destination: "/app/settings/:path*",
        permanent: false,
      },
      {
        source: "/transfers/:path*",
        destination: "/app/transfers/:path*",
        permanent: false,
      },
      {
        source: "/billing/:path*",
        destination: "/app/billing/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

/* 
export default withSentryConfig(nextConfig, {
  org: "siteradiant",
  project: "invoicing",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
*/


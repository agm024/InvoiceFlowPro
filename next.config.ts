import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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


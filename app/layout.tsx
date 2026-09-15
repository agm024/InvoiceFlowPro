import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FlowRadiantPro - Invoicing & Business Insights",
    template: "%s | FlowRadiantPro",
  },
  description: "FlowRadiantPro is an all-in-one GST invoicing and business management software. Create invoices, manage clients, and track payments to scale your business.",
  keywords: ["invoicing software", "GST billing", "invoice generator", "business management", "FlowRadiantPro"],
  authors: [{ name: "FlowRadiantPro" }],
  creator: "FlowRadiantPro",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://flow.siteradiant.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://flow.siteradiant.co.in",
    siteName: "FlowRadiantPro",
    title: "FlowRadiantPro - Invoicing & Business Insights",
    description: "FlowRadiantPro is an all-in-one GST invoicing and business management software. Create invoices, manage clients, and track payments to scale your business.",
    images: [
      {
        url: "https://flow.siteradiant.co.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlowRadiantPro - Invoicing & Business Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowRadiantPro - Invoicing & Business Insights",
    description: "FlowRadiantPro is an all-in-one GST invoicing and business management software. Create invoices, manage clients, and track payments to scale your business.",
    images: ["https://flow.siteradiant.co.in/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "FlowRadiantPro",
                "alternateName": "FlowRadiant Pro",
                "url": "https://flow.siteradiant.co.in/"
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "FlowRadiantPro",
                "image": "https://flow.siteradiant.co.in/og-image.png",
                "url": "https://flow.siteradiant.co.in/",
                "telephone": "+91-9876543210",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "SiteRadiant HQ",
                  "addressLocality": "Mumbai",
                  "addressRegion": "MH",
                  "postalCode": "400001",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 19.0760,
                  "longitude": 72.8777
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                  ],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                "sameAs": [
                  "https://twitter.com/SiteRadiant",
                  "https://www.linkedin.com/company/siteradiant",
                  "https://github.com/SiteRadiant"
                ]
              }
            ])
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#fff',
              color: '#3f3f46',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              borderRadius: '12px',
              border: '1px solid #e4e4e7',
              fontSize: '14px',
              fontWeight: 500
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }} 
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

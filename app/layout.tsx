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
    default: "FlowRadiantPro | The Business OS & GST Invoicing Software",
    template: "%s | FlowRadiantPro",
  },
  description: "FlowRadiantPro is the all-in-one Business OS for Indian SMBs. Start with smart GST invoicing, payment tracking, and client management to scale your business.",
  keywords: ["business OS", "GST invoicing software", "invoice generator", "business management", "FlowRadiantPro"],
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
    title: "FlowRadiantPro | The Business OS & GST Invoicing Software",
    description: "FlowRadiantPro is the all-in-one Business OS for Indian SMBs. Start with smart GST invoicing, payment tracking, and client management to scale your business.",
    images: [
      {
        url: "https://flow.siteradiant.co.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlowRadiantPro | The Business OS & GST Invoicing Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowRadiantPro | The Business OS & GST Invoicing Software",
    description: "FlowRadiantPro is the all-in-one Business OS for Indian SMBs. Start with smart GST invoicing, payment tracking, and client management to scale your business.",
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": "FlowRadiantPro",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Web",
                  "url": "https://flow.siteradiant.co.in/",
                  "brand": {
                    "@type": "Brand",
                    "name": "FlowRadiantPro"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "SiteRadiant",
                    "url": "https://siteradiant.co.in/"
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR"
                  }
                },
                {
                  "@type": "Organization",
                  "name": "FlowRadiantPro",
                  "url": "https://flow.siteradiant.co.in/",
                  "logo": "https://flow.siteradiant.co.in/logo.png",
                  "parentOrganization": {
                    "@type": "Organization",
                    "name": "SiteRadiant",
                    "url": "https://siteradiant.co.in/"
                  },
                  "sameAs": [
                    "https://twitter.com/SiteRadiant",
                    "https://www.linkedin.com/company/siteradiant",
                    "https://github.com/SiteRadiant"
                  ]
                },
                {
                  "@type": "WebSite",
                  "name": "FlowRadiantPro",
                  "url": "https://flow.siteradiant.co.in/",
                  "publisher": {
                    "@type": "Organization",
                    "name": "SiteRadiant"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://flow.siteradiant.co.in/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "About",
                      "item": "https://flow.siteradiant.co.in/about"
                    }
                  ]
                }
              ]
            })
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

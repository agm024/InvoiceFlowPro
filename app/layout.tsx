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
    default: "FlowRadiantPro - From invoices to business insights. All In One",
    template: "%s | FlowRadiantPro",
  },
  description: "From invoices to business insights. All In One",
  keywords: ["invoicing software", "GST billing", "invoice generator", "business management", "FlowRadiantPro"],
  authors: [{ name: "FlowRadiant" }],
  creator: "FlowRadiant",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://flowradiant.siteradiant.co.in'),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://flowradiant.siteradiant.co.in",
    siteName: "FlowRadiantPro",
    title: "FlowRadiantPro - From invoices to business insights. All In One",
    description: "From invoices to business insights. All In One",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlowRadiantPro - From invoices to business insights. All In One",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowRadiantPro - From invoices to business insights. All In One",
    description: "From invoices to business insights. All In One",
    images: ["/og-image.png"],
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

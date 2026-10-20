import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Get Started Free with FlowRadiantPro',
  description: 'Create your free FlowRadiantPro account in seconds. Modern GST invoicing, client management, and real-time cash flow tracking for Indian SMBs.',
  alternates: {
    canonical: '/sign-up',
  },
  openGraph: {
    title: 'Sign Up Free | FlowRadiantPro by SiteRadiant',
    description: 'Create your free FlowRadiantPro account. Modern GST invoicing and client management for Indian SMBs.',
    url: 'https://flow.siteradiant.co.in/sign-up',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

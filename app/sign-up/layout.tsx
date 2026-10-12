import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Get Started Free',
  description: 'Create your free FlowRadiantPro account in seconds. Modern GST invoicing, client management, and payment tracking for Indian SMBs.',
  alternates: {
    canonical: '/sign-up',
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

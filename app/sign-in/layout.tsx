import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In to Your Account',
  description: 'Log in to your FlowRadiantPro account to manage GST invoices, payments, and client records.',
  alternates: {
    canonical: '/sign-in',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

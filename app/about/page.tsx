import '../landing.css'
import { auth } from '@/auth'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn what FlowRadiantPro is and how it functions as the all-in-one Business OS for Indian SMBs.',
  alternates: {
    canonical: '/about',
  },
}

export default async function AboutPage() {
  const session = await auth()

  return (
    <div data-landing="true" className="flex flex-col min-h-screen" style={{ overflowX: 'clip' }}>
      <LandingNav isLoggedIn={!!session?.user} />

      <main id="main-content" className="flex-1 flex flex-col pt-32 pb-24 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tight text-[#151515]">
          About FlowRadiantPro
        </h1>

        <section className="prose prose-lg max-w-none text-zinc-700">
          <h2 className="text-2xl font-bold text-[#151515] mb-4">What is FlowRadiantPro?</h2>
          <p className="mb-6">
            FlowRadiantPro is the ultimate Business OS (Operating System) built specifically for small and medium businesses, startups, freelancers, and agencies. 
          </p>
          <p className="mb-6">
            While it provides a powerful, world-class invoicing and billing engine at its core, FlowRadiantPro is <strong>NOT</strong> just an invoicing app. It is a comprehensive platform designed to streamline your entire business operation. 
          </p>
          <p className="mb-6">
            Our vision is to replace the scattered ecosystem of spreadsheets, basic invoice generators, and complex legacy ERPs with a single, intuitive system. FlowRadiantPro handles invoices, payments, expenses, customer relationships, cash flow tracking, GST compliance workflows, and—eventually—AI-powered business intelligence.
          </p>

          <h2 className="text-2xl font-bold text-[#151515] mb-4 mt-12">Built by SiteRadiant</h2>
          <p className="mb-6">
            FlowRadiantPro is proudly built and maintained under the SiteRadiant brand. We believe Indian SMBs deserve world-class software without the enterprise price tag. Our focus is currently on the Indian market, delivering seamless integrations for GST and UPI payments right out of the box, with plans to expand globally.
          </p>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}

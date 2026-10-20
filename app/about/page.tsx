import '../landing.css'
import { auth } from '@/auth'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us — The Business OS Built by SiteRadiant',
  description: 'Discover FlowRadiantPro: the all-in-one Business OS and GST invoicing software engineered by Agastya at SiteRadiant for Indian SMBs, agencies, and freelancers.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About FlowRadiantPro | Built by SiteRadiant',
    description: 'Discover FlowRadiantPro: our mission to replace fragmented spreadsheets with modern GST billing and business workflows.',
    url: 'https://flow.siteradiant.co.in/about',
    type: 'website',
  },
}

export default async function AboutPage() {
  const session = await auth()

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About FlowRadiantPro',
    'url': 'https://flow.siteradiant.co.in/about',
    'description': 'Learn about FlowRadiantPro, the Business OS and GST invoicing software built by Agastya under SiteRadiant.',
    'mainEntity': {
      '@type': 'SoftwareApplication',
      'name': 'FlowRadiantPro',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
      'author': {
        '@type': 'Person',
        'name': 'Agastya',
        'url': 'https://github.com/agm024',
      },
      'creator': {
        '@type': 'Organization',
        'name': 'SiteRadiant',
        'url': 'https://siteradiant.co.in/',
      },
    },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://flow.siteradiant.co.in/',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'About',
          'item': 'https://flow.siteradiant.co.in/about',
        },
      ],
    },
  }

  return (
    <div data-landing="true" className="flex flex-col min-h-screen" style={{ overflowX: 'clip' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <LandingNav isLoggedIn={!!session?.user} />

      <main id="main-content" className="flex-1 flex flex-col pt-32 pb-24 px-6 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-semibold text-cyan-800 mb-6 w-fit">
          About SiteRadiant &amp; FlowRadiantPro
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-[#151515]">
          About FlowRadiantPro by SiteRadiant
        </h1>

        <section className="prose prose-lg max-w-none text-zinc-700 leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold text-[#151515]">The Business Operating System for Modern Indian SMBs</h2>
          <p>
            FlowRadiantPro was created to solve a widespread problem facing Indian small businesses, freelancers, agencies, and logistics operators: the daily friction of managing business finances across disconnected tools, messy spreadsheets, and outdated legacy software.
          </p>
          <p>
            While FlowRadiantPro includes a high-performance, tax-compliant GST invoicing engine at its foundation, it is engineered as a complete <strong>Business Operating System (Business OS)</strong>. Our platform consolidates billing, client management, expense tracking, and cash flow visibility into a single, cohesive workspace.
          </p>

          <h2 className="text-2xl font-bold text-[#151515] pt-6">The Creator &amp; Engineering</h2>
          <p>
            FlowRadiantPro is designed and built by{' '}
            <a
              href="https://github.com/agm024"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 font-semibold underline hover:text-cyan-900"
            >
              Agastya (agm024)
            </a>
            , a full-stack engineer and creator focusing on high-performance web systems, intuitive SaaS workflows, and robust business tooling.
          </p>

          <h2 className="text-2xl font-bold text-[#151515] pt-6">Built Under SiteRadiant</h2>
          <p>
            FlowRadiantPro is operated and maintained under <strong>SiteRadiant</strong>, a digital studio focused on modern web platforms and digital infrastructure for enterprises and startups.
          </p>
          <p>
            We adhere to rigorous standards for data protection—utilizing AES-256 encryption at rest, secure TLS encryption in transit, and role-based permissions to guarantee privacy and regulatory compliance.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/sign-up" className="land-btn-primary text-center">
              Create your free account →
            </Link>
            <Link href="/pricing" className="land-btn-ghost text-center">
              View transparent pricing
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}

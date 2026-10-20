import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import prisma from '@/utils/prisma'
import { PricingClient } from './PricingClient'
import { cookies } from 'next/headers'

import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing & Plans — Transparent Billing for SMBs',
  description: 'Transparent pricing for Indian SMBs and freelancers by SiteRadiant. Choose from Free, Pro, and Max tiers for GST invoicing, client portals, and multi-user access.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'FlowRadiantPro Pricing & Plans | By SiteRadiant',
    description: 'Transparent pricing for Indian SMBs and freelancers. Start free with GST invoicing, client portals, and cash flow tracking.',
    url: 'https://flow.siteradiant.co.in/pricing',
    type: 'website',
  },
}

const getCachedPlans = unstable_cache(
  async () => {
    return await prisma.plan.findMany({
      orderBy: { monthlyPrice: 'asc' }
    })
  },
  ['public-pricing-plans'],
  { revalidate: 3600 } // Cache for 1 hour
)

export default async function PricingPage() {
  const token = (await cookies()).get('auth_token')?.value
  let user = { companyId: 'test' }; // mock user for testing
  let plans = await getCachedPlans()

  // Put popular plan in the middle
  const popularIndex = plans.findIndex(p => p.isPopular);
  if (popularIndex !== -1 && plans.length >= 3) {
    const popularPlan = plans.splice(popularIndex, 1)[0];
    const middleIndex = Math.floor(plans.length / 2);
    plans.splice(middleIndex, 0, popularPlan);
  }

  // Structured Data for Pricing / SoftwareApplication Offer Catalog
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'FlowRadiantPro Pricing & Plans',
    'url': 'https://flow.siteradiant.co.in/pricing',
    'description': 'Pricing tiers and plans for FlowRadiantPro GST invoicing and business management platform.',
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
          'name': 'Pricing',
          'item': 'https://flow.siteradiant.co.in/pricing',
        },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <MarketingNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-4">
            FlowRadiantPro Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            FlowRadiantPro Plans &amp; Pricing
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Transparent pricing for Indian small businesses and growing teams. Pay only for what you need with zero hidden costs.
          </p>
        </div>
        
        <PricingClient plans={plans} user={user} />
      </main>
      <MarketingFooter />
    </div>
  )
}

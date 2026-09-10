import './landing.css'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'
import { LandingNav }         from '@/components/landing/LandingNav'
import { LandingHero }        from '@/components/landing/LandingHero'
import { LandingTrustStrip }  from '@/components/landing/LandingTrustStrip'
import { LandingProductTabs } from '@/components/landing/LandingProductTabs'
import { LandingFeatures }    from '@/components/landing/LandingFeatures'
import { LandingPricing }     from '@/components/landing/LandingPricing'
import { LandingFinalCTA }    from '@/components/landing/LandingFinalCTA'
import { LandingFooter }      from '@/components/landing/LandingFooter'

export const metadata = {
  title: 'InvoiceFlowPro — Your business, billed beautifully',
  description:
    'Create professional GST-ready invoices, manage customers, track payments, and run your billing operation without the spreadsheet chaos. Built for Indian businesses.',
}

export default async function LandingPage() {
  const session = await auth()
  const signupHref = session?.user ? '/app' : '/sign-up'

  const plans = await prisma.plan.findMany({
    orderBy: { monthlyPrice: 'asc' },
  })

  return (
    <div data-landing="true" className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <LandingNav isLoggedIn={!!session?.user} />

      <main className="flex-1 flex flex-col">
        {/* 1. Hero — animated invoice workspace */}
        <LandingHero signupHref={signupHref} />

        {/* 2. Trust strip — stats */}
        <LandingTrustStrip />

        {/* 3. Interactive product tabs */}
        <LandingProductTabs />

        {/* 4–9. Feature storytelling sections */}
        <LandingFeatures />

        {/* 10. Pricing — DB-connected */}
        <LandingPricing plans={plans} />

        {/* 11. Final CTA */}
        <LandingFinalCTA signupHref={signupHref} />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}

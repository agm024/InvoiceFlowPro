'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function OnboardingPlansClient({ plans }: { plans: any[] }) {
  const router = useRouter()
  const [isAnnual, setIsAnnual] = useState(true)

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  if (plans.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        Pricing plans are currently being updated.
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-center items-center gap-4 mb-10">
        <span className={`text-sm font-medium ${!isAnnual ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>Monthly</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative inline-flex h-7 w-14 items-center rounded-full bg-zinc-200 dark:bg-zinc-800 transition-colors"
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-blue-600 transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>
          Yearly <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Save 20%</span>
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice
          const monthlyEquivalent = isAnnual && plan.yearlyPrice > 0 ? (plan.yearlyPrice / 12).toFixed(0) : null
          const currencySymbol = '₹'

          const handleSelect = async () => {
            if (price === 0) {
              // They already have the Free plan from sign-up action, so just go to app
              router.push('/app')
            } else if (plan.trialPeriod > 0) {
              setLoadingPlan(plan.id)
              try {
                const res = await fetch('/api/subscriptions/start-trial', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ planId: plan.id, isAnnual })
                })
                if (!res.ok) throw new Error('Failed to start trial')
                router.push('/app')
              } catch (e: any) {
                // Ignore silent error
                router.push(`/checkout/${plan.id}?cycle=${isAnnual ? 'yearly' : 'monthly'}`)
              }
            } else {
              router.push(`/checkout/${plan.id}?cycle=${isAnnual ? 'yearly' : 'monthly'}`)
            }
          }

          if (plan.isPopular) {
            return (
              <div key={plan.id} className="relative bg-gradient-to-b from-blue-600 to-blue-800 rounded-3xl p-8 border-none text-white shadow-xl transform md:-translate-y-4 flex flex-col">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-cyan-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-blue-100 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-extrabold">{currencySymbol}{isAnnual && monthlyEquivalent ? Number(monthlyEquivalent).toLocaleString('en-IN') : price.toLocaleString('en-IN')}</span>
                  <span className="text-blue-200"> /month</span>
                </div>
                {isAnnual && price > 0 && <p className="text-sm text-blue-200 mb-6">Billed {currencySymbol}{price.toLocaleString('en-IN')} yearly</p>}
                {!isAnnual && price > 0 && <p className="text-sm text-blue-200 mb-6 opacity-0">Spacer</p>}
                {price === 0 && <p className="text-sm text-blue-200 mb-6 opacity-0">Spacer</p>}
                
                <p className="text-blue-100 mb-8 flex-grow">{plan.description}</p>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> {plan.clientLimits === null ? 'Unlimited' : `${plan.clientLimits} Clients`}</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> {plan.invoiceLimits === null ? 'Unlimited' : `${plan.invoiceLimits} Invoices/mo`}</li>
                  
                  {Array.isArray(plan.features) ? plan.features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> {feature}</li>
                  )) : (
                    <>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> Advanced Reporting</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> Dedicated Client Portal</li>
                    </>
                  )}
                </ul>
                <button 
                  onClick={handleSelect} 
                  disabled={loadingPlan === plan.id}
                  className="block text-center w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-zinc-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {loadingPlan === plan.id ? 'Processing...' : (price === 0 ? 'Continue with Free' : (plan.trialPeriod ? `Start ${plan.trialPeriod}-Day Free Trial` : 'Choose Plan'))}
                </button>
              </div>
            )
          }

          return (
            <div key={plan.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-sm">
              <h3 className="text-xl font-bold text-zinc-500 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-extrabold">{currencySymbol}{isAnnual && monthlyEquivalent ? Number(monthlyEquivalent).toLocaleString('en-IN') : price.toLocaleString('en-IN')}</span>
                <span className="text-zinc-500"> /month</span>
              </div>
              {isAnnual && price > 0 && <p className="text-sm text-zinc-500 mb-6">Billed {currencySymbol}{price.toLocaleString('en-IN')} yearly</p>}
              {!isAnnual && price > 0 && <p className="text-sm text-zinc-500 mb-6 opacity-0">Spacer</p>}
              {price === 0 && <p className="text-sm text-zinc-500 mb-6">Free forever</p>}
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 flex-grow">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" size={20}/> {plan.clientLimits === null ? 'Unlimited' : `${plan.clientLimits} Clients`}</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" size={20}/> {plan.invoiceLimits === null ? 'Unlimited' : `${plan.invoiceLimits} Invoices/mo`}</li>
                
                {Array.isArray(plan.features) ? plan.features.map((feature: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-3"><CheckCircle2 className="text-green-500" size={20}/> {feature}</li>
                )) : (
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500" size={20}/> Basic Reporting</li>
                )}
              </ul>
              
              <button 
                onClick={handleSelect} 
                disabled={loadingPlan === plan.id}
                className="block text-center w-full py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold hover:border-zinc-300 dark:hover:border-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loadingPlan === plan.id ? 'Processing...' : (price === 0 ? 'Continue with Free' : (plan.trialPeriod ? `Start ${plan.trialPeriod}-Day Free Trial` : 'Choose Plan'))}
              </button>
            </div>
          )
        })}
      </div>
      
      <div className="mt-12 text-center">
        <button onClick={() => router.push('/app')} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 font-medium inline-flex items-center gap-2">
          Skip for now <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

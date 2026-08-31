"use client"

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'

export function PricingClient({ plans }: { plans: any[] }) {
  const [isAnnual, setIsAnnual] = useState(true)

  if (plans.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        Pricing plans are currently being updated. Please check back later!
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-center mb-12">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl inline-flex items-center">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${!isAnnual ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Annually
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          let price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice
          let intervalLabel = isAnnual ? 'year' : 'month'
          let monthlyEquivalent = isAnnual && price > 0 ? (price / 12).toFixed(0) : null
          
          // Ensure price is safely numeric
          price = price || 0
          
          const currencySymbol = plan.currency === 'USD' ? '$' : plan.currency === 'INR' ? '₹' : plan.currency;

          if (plan.isPopular) {
            return (
              <div key={plan.id} className="bg-blue-600 text-white rounded-3xl p-8 border border-blue-600 flex flex-col shadow-xl relative transform md:-translate-y-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 text-blue-950 px-4 py-1 rounded-full text-sm font-bold shadow-sm">Most Popular</div>
                <h3 className="text-xl font-bold text-blue-200 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-extrabold">{currencySymbol}{isAnnual && monthlyEquivalent ? Number(monthlyEquivalent).toLocaleString('en-IN') : price.toLocaleString('en-IN')}</span>
                  <span className="text-blue-200"> /month</span>
                </div>
                {isAnnual && (
                  <p className="text-blue-200 text-sm mb-6">Billed annually at {currencySymbol}{price.toLocaleString('en-IN')} / year</p>
                )}
                {!isAnnual && <div className="mb-6 h-5"></div>}
                
                <p className="text-blue-100 mb-8">Everything you need to grow your business.</p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> {plan.userLimits === null ? 'Unlimited' : plan.userLimits} Team Members</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> {plan.clientLimits === null ? 'Unlimited' : plan.clientLimits} Clients</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> {plan.invoiceLimits === null ? 'Unlimited' : plan.invoiceLimits} Invoices</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> Advanced Reporting</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> Dedicated Client Portal</li>
                </ul>
                <Link href="/sign-up" className="block text-center w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-zinc-50 transition shadow-sm">Start Free Trial</Link>
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
              {isAnnual && price > 0 && (
                <p className="text-zinc-500 text-sm mb-6">Billed annually at {currencySymbol}{price.toLocaleString('en-IN')} / year</p>
              )}
              {(!isAnnual || price === 0) && <div className="mb-6 h-5"></div>}
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> {plan.userLimits === null ? 'Unlimited' : plan.userLimits} Team Member{plan.userLimits !== 1 ? 's' : ''}</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> {plan.clientLimits === null ? 'Unlimited' : `Up to ${plan.clientLimits}`} Clients</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> {plan.invoiceLimits === null ? 'Unlimited' : plan.invoiceLimits} Invoices</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Basic Reporting</li>
                {price > 10000 ? (
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Priority Support</li>
                ) : (
                  <li className="flex items-center gap-3 text-zinc-400"><XCircle size={20}/> Client Portal</li>
                )}
              </ul>
              <Link href={price > 30000 ? "/contact" : "/sign-up"} className="block text-center w-full py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                {price > 30000 ? "Contact Sales" : "Get Started"}
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

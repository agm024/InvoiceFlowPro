"use client"

import { useState, useTransition } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { createCheckoutSession } from './actions'

export default function BillingClient({ plans, subscription }: { plans: any[], subscription: any }) {
  const [isAnnual, setIsAnnual] = useState(true)
  const [isPending, startTransition] = useTransition()

  return (
    <div className="dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Plans</h2>
        
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl inline-flex items-center">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${!isAnnual ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Annually
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          let price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice
          let intervalLabel = isAnnual ? 'year' : 'month'
          let monthlyEquivalent = isAnnual && price > 0 ? (price / 12).toFixed(0) : null
          price = price || 0

          const currencySymbol = plan.currency === 'USD' ? '$' : plan.currency === 'INR' ? '₹' : plan.currency;
          const isCurrentPlan = subscription?.planId === plan.id

          return (
            <div key={plan.id} className={`border dark:border-zinc-700 rounded-2xl p-6 flex flex-col bg-white dark:bg-zinc-900 shadow-sm transition-shadow relative ${plan.isPopular && !isCurrentPlan ? 'border-blue-500 border-2' : ''}`}>
              {isCurrentPlan && (
                <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                  Current Plan
                </div>
              )}
              {plan.isPopular && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold">
                  {currencySymbol}{isAnnual && monthlyEquivalent ? Number(monthlyEquivalent).toLocaleString('en-IN') : price.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/mo</span>
              </div>
              
              {isAnnual && price > 0 && (
                <p className="text-gray-500 text-sm mb-4">Billed annually at {currencySymbol}{price.toLocaleString('en-IN')} / yr</p>
              )}
              {(!isAnnual || price === 0) && <div className="mb-4 h-5"></div>}

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{plan.userLimits === null ? 'Unlimited' : `${plan.userLimits} Users`}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{plan.clientLimits === null ? 'Unlimited' : `${plan.clientLimits} Clients`}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{plan.invoiceLimits === null ? 'Unlimited' : `${plan.invoiceLimits} Invoices`}</span>
                </li>
              </ul>
              
              <button
                onClick={() => {
                  startTransition(async () => {
                    await createCheckoutSession(plan.id, isAnnual ? 'year' : 'month');
                  })
                }}
                disabled={isPending || (isCurrentPlan && subscription?.status === 'active' && subscription?.billingInterval === intervalLabel)}
                className={`w-full py-2.5 px-4 rounded-lg font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${plan.isPopular && !isCurrentPlan ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' : 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-zinc-700'} disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 dark:disabled:border-zinc-700`}
              >
                {isPending ? 'Processing...' : isCurrentPlan 
                  ? (subscription?.status === 'active' && subscription?.billingInterval === intervalLabel ? 'Current Plan' : 'Update Plan') 
                  : 'Subscribe'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

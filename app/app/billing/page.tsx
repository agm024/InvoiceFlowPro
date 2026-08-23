import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { createCheckoutSession } from './actions'

export default async function BillingPage() {
  const { companyId } = await requireCompany()

  const subscription = await prisma.subscription.findUnique({
    where: { companyId },
    include: { plan: true }
  })

  // get all plans
  const plans = await prisma.plan.findMany({
    orderBy: { displayOrder: 'asc' }
  })

  const isWarningStatus = subscription?.status === 'past_due' || subscription?.status === 'canceled'

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground text-lg">
          Manage your subscription, view your current plan, and upgrade or downgrade as needed.
        </p>
      </div>

      {isWarningStatus && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold">Payment Action Required</h3>
            <p className="text-red-700 mt-1">
              Your subscription is currently {subscription?.status.replace('_', ' ')}. Please update your payment method or subscribe to a plan to continue using the service.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
        {subscription ? (
          <div className="space-y-2">
            <p><strong>Plan:</strong> {subscription.plan?.name}</p>
            <p><strong>Status:</strong> <span className="capitalize">{subscription.status.replace('_', ' ')}</span></p>
            {subscription.currentPeriodEnd && (
              <p><strong>Renews on:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">You do not have an active subscription.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="border rounded-2xl p-6 flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow relative">
              {subscription?.planId === plan.id && (
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                  Current Plan
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {plan.currency === 'USD' ? '$' : plan.currency === 'INR' ? '₹' : plan.currency}
                  {plan.price}
                </span>
                <span className="text-gray-500">/{plan.interval}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{plan.userLimits === 0 ? 'Unlimited' : plan.userLimits} Users</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{plan.clientLimits === 0 ? 'Unlimited' : plan.clientLimits} Clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{plan.invoiceLimits === 0 ? 'Unlimited' : plan.invoiceLimits} Invoices</span>
                </li>
              </ul>
              
              <form action={async () => {
                'use server';
                await createCheckoutSession(plan.id);
              }}>
                <button
                  disabled={subscription?.planId === plan.id && subscription?.status === 'active'}
                  className="w-full py-2.5 px-4 rounded-lg font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200"
                >
                  {subscription?.planId === plan.id 
                    ? (subscription?.status === 'active' ? 'Current Plan' : 'Renew Plan') 
                    : 'Subscribe'}
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

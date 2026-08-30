import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { AlertCircle, ShieldAlert } from 'lucide-react'
import BillingClient from './BillingClient'
import { cancelSubscription } from './actions'

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

      <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
          {subscription ? (
            <div className="space-y-2">
              <p><strong>Plan:</strong> {subscription.plan?.name}</p>
              <p><strong>Status:</strong> <span className={`capitalize font-medium ${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{subscription.status.replace('_', ' ')}</span></p>
              <p><strong>Billing Interval:</strong> <span className="capitalize">{subscription.billingInterval || 'Month'}</span></p>
              {subscription.currentPeriodEnd && (
                <p><strong>Renews on:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">You do not have an active subscription.</p>
          )}
        </div>
        
        {subscription && subscription.status === 'active' && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 max-w-sm">
            <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2"><ShieldAlert size={16} /> Danger Zone</h3>
            <p className="text-xs text-red-700 mb-4">Canceling your subscription will immediately revoke your access to premium features at the end of your billing cycle.</p>
            <form action={cancelSubscription}>
              <button type="submit" className="w-full bg-red-100 text-red-700 hover:bg-red-200 py-2 rounded-md text-sm font-semibold transition-colors">
                Cancel Subscription
              </button>
            </form>
          </div>
        )}
      </div>

      <BillingClient plans={plans} subscription={subscription} />
    </div>
  )
}

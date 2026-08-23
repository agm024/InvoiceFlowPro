import { createPlan } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { requireSuperAdmin } from '@/lib/auth-context'

export default async function NewPlanPage() {
  await requireSuperAdmin()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link href="/app/admin/billing/plans" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 text-sm font-medium mb-4 transition">
          <ArrowLeft size={16} /> Back to Plans
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Subscription Plan</h1>
        <p className="text-zinc-500 mt-2">Define a new pricing tier for your businesses.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm p-8">
        <form action={createPlan} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Plan Name</label>
            <input type="text" name="name" required placeholder="e.g. Pro Tier" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-transparent focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Price</label>
              <input type="number" name="price" required step="0.01" min="0" placeholder="29.99" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-transparent focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Currency</label>
              <select name="currency" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-transparent focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors appearance-none">
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="SGD">SGD (S$)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Billing Interval</label>
              <select name="interval" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-transparent focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors appearance-none">
                <option value="month">Monthly</option>
                <option value="year">Annually</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <Link href="/app/admin/billing/plans" className="px-6 py-2.5 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
              Cancel
            </Link>
            <button type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition flex items-center gap-2">
              <Save size={18} /> Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

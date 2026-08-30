import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { Save } from "lucide-react"

export default async function SystemSettingsPage() {
  await requireSuperAdmin()

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">System Settings</h1>
      
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-bold">Currency & Localization</h2>
          <p className="text-sm text-zinc-500 mt-1">Configure how the platform handles multi-currency conversions.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base Reporting Currency</label>
            <input type="text" disabled value="INR (Indian Rupee)" readOnly className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 cursor-not-allowed" />
            <p className="text-xs text-zinc-500 mt-1">Platform revenue reporting is strictly standardized to INR.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Exchange Rate API Provider</label>
            <select className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <option>Client-side Custom API Integration</option>
              <option>OpenExchangeRates</option>
              <option>Fixer.io</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-bold">Platform Subscription Gateway</h2>
          <p className="text-sm text-zinc-500 mt-1">Configure the Master Gateway (Razorpay) used exclusively for collecting SaaS subscriptions from your users. (Individual tenants will connect their own custom gateways separately for their clients).</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Active Gateway</label>
            <select className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <option>Razorpay</option>
              <option>Stripe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Webhook Secret</label>
            <input type="password" defaultValue="************************" readOnly className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg" />
          </div>
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

import { requireSuperAdmin } from '@/lib/auth-context'

export default async function SystemSettingsPage() {
  await requireSuperAdmin()

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Platform Settings</h1>
        <p className="text-zinc-500 mt-2">Configure application-wide settings and integrations.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
        
        {/* Settings Navigation */}
        <div className="border-b border-zinc-200 dark:border-zinc-900 px-6 pt-4 flex gap-6">
          <button className="pb-3 border-b-2 border-zinc-900 dark:border-white font-medium text-zinc-900 dark:text-white">
            General
          </button>
          <button className="pb-3 border-b-2 border-transparent font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            Payment Gateways
          </button>
          <button className="pb-3 border-b-2 border-transparent font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            Email & Notifications
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-6 space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Application Name</label>
                <input 
                  type="text" 
                  defaultValue="InvoiceFlowPro"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Default Currency</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>INR (₹)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="support@invoiceflowpro.com"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" 
                />
              </div>
            </div>
          </section>

          <hr className="border-zinc-200 dark:border-zinc-900" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Payment Integrations</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-zinc-900 dark:text-white">Razorpay API Keys</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-zinc-500">Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Key ID</label>
                    <input 
                      type="password" 
                      defaultValue="rzp_test_123456789"
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Key Secret</label>
                    <input 
                      type="password" 
                      defaultValue="*****************"
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" 
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-zinc-900 dark:text-white">Stripe API Keys</h3>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Not Configured</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75 hover:opacity-100 transition">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Publishable Key</label>
                    <input 
                      type="text" 
                      placeholder="pk_test_..."
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Secret Key</label>
                    <input 
                      type="password" 
                      placeholder="sk_test_..."
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-lg font-medium text-sm transition">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import SettingsForm from './SettingsForm'
import BankAccountsList from './BankAccountsList'
import ExchangeRatesList from './ExchangeRatesList'
import SupportAccessToggle from './SupportAccessToggle'
import { Building2, Landmark, Currency, Users, Shield, Receipt, Check } from 'lucide-react'

export default function SettingsTabs({ 
  settings, 
  banks, 
  exchangeRates,
  internalTransfers = [],
  initialTab = 'company',
  supportAccessGranted = false
}: { 
  settings: any, 
  banks: any[], 
  exchangeRates: any[],
  internalTransfers?: any[],
  initialTab?: string,
  supportAccessGranted?: boolean
}) {
  const router = useRouter()
  const activeTab = initialTab || 'company'

  const handleTabChange = (tabId: string) => {
    router.push(`/app/settings?tab=${tabId}`)
  }

  const tabs = [
    { id: 'company', name: 'Company Profile', icon: Building2 },
    { id: 'banks', name: 'Bank Accounts', icon: Landmark },
    { id: 'currency', name: 'Exchange Rates', icon: Currency },
    { id: 'team', name: 'Team Members', icon: Users },
    { id: 'billing', name: 'Billing', icon: Receipt },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="md:w-64 shrink-0">
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-800/20 text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-sidebar-bg hover:text-foreground'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white' : 'text-zinc-400'} />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {activeTab === 'company' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Company Profile</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage your company details and GST information.</p>
            </div>
            <SettingsForm initialSettings={settings} />
            <SupportAccessToggle initialGranted={supportAccessGranted} />
          </div>
        )}

        {activeTab === 'banks' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Bank Accounts</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage bank accounts for receiving payments and internal transfers.</p>
            </div>
            <section className="bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-sm">
              <BankAccountsList initialBanks={banks} initialTransfers={internalTransfers || []} />
            </section>
          </div>
        )}

        {activeTab === 'currency' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Currency Conversion Rates</h2>
              <p className="text-sm text-zinc-500 mt-1">Set fixed exchange rates for international invoices (e.g., USD to INR).</p>
            </div>
            <section className="bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-sm">
              <ExchangeRatesList initialRates={exchangeRates} />
            </section>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Team Management</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage accountants and team members.</p>
            </div>
            <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-card-border flex justify-between items-center">
                <h3 className="font-semibold text-foreground">Active Members (3)</h3>
                <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  Invite Member
                </button>
              </div>
              <div className="divide-y divide-card-border">
                {[
                  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
                  { name: 'Alice Smith', email: 'alice@example.com', role: 'Accountant', status: 'Active' },
                  { name: 'Bob Jones', email: 'bob@example.com', role: 'Viewer', status: 'Pending' },
                ].map((user, idx) => (
                  <div key={idx} className="p-4 px-6 flex items-center justify-between hover:bg-sidebar-bg/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-sm text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-sidebar-bg px-3 py-1 rounded-full border border-card-border">
                        {user.role}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Billing & Subscription</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage your plan and billing history.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <span className="bg-indigo-500/10 text-indigo-500 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">CURRENT PLAN</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">Pro Plan</h3>
                <p className="text-zinc-500 mb-6">₹ 4,999 / year</p>
                <ul className="space-y-3 mb-8">
                  {['Unlimited Invoices', 'Custom Branding', 'Up to 5 Team Members', 'Priority Support'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Check size={12} strokeWidth={3} /></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground font-semibold py-2.5 rounded-lg transition-colors">
                  Manage Subscription
                </button>
              </div>
              <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-sm flex flex-col">
                <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 border border-card-border rounded-lg mb-6 bg-sidebar-bg/50">
                  <div className="w-12 h-8 bg-zinc-200 dark:bg-zinc-700 rounded flex items-center justify-center font-bold text-zinc-500 text-xs">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Visa ending in 4242</p>
                    <p className="text-xs text-zinc-500">Expires 12/28</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="font-semibold text-foreground mb-4">Billing History</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm py-2 border-b border-card-border">
                      <span className="text-zinc-500">Jan 1, 2026</span>
                      <span className="text-foreground font-medium">₹ 4,999</span>
                      <a href="#" className="text-indigo-500 hover:underline">Download</a>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="text-zinc-500">Jan 1, 2025</span>
                      <span className="text-foreground font-medium">₹ 4,999</span>
                      <a href="#" className="text-indigo-500 hover:underline">Download</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

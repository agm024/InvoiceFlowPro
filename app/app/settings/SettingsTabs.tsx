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
      </div>
    </div>
  )
}

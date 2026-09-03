'use client'

import { useRouter } from 'next/navigation'
import SettingsForm from './SettingsForm'
import BankAccountsList from './BankAccountsList'
import ExchangeRatesList from './ExchangeRatesList'
import SupportAccessToggle from './SupportAccessToggle'
import RolesClient from './RolesClient'
import TeamMembersClient from './TeamMembersClient'
import MyProfileClient from './MyProfileClient'
import { Building2, Landmark, Currency, Users, Shield, Receipt, Check, UserCircle } from 'lucide-react'

export default function SettingsTabs({ 
  settings, 
  banks, 
  exchangeRates,
  internalTransfers = [],
  initialTab = 'profile',
  supportAccessGranted = false,
  roles = [],
  users = [],
  invitations = [],
  currentUser = {},
  subscription = null
}: { 
  settings: any, 
  banks: any[], 
  exchangeRates: any[],
  internalTransfers?: any[],
  initialTab?: string,
  supportAccessGranted?: boolean,
  roles?: any[],
  users?: any[],
  invitations?: any[],
  currentUser?: any,
  subscription?: any
}) {
  const router = useRouter()
  const activeTab = initialTab || 'profile'

  const handleTabChange = (tabId: string) => {
    router.push(`/app/settings?tab=${tabId}`)
  }

  const tabs = [
    { id: 'profile', name: 'My Profile', icon: UserCircle },
    { id: 'company', name: 'Company Profile', icon: Building2 },
    { id: 'banks', name: 'Bank Accounts', icon: Landmark },
    { id: 'currency', name: 'Exchange Rates', icon: Currency },
    { id: 'team', name: 'Team Members', icon: Users },
    { id: 'roles', name: 'Roles & Permissions', icon: Shield },
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
        {activeTab === 'profile' && (
          <MyProfileClient currentUser={currentUser} subscription={subscription} />
        )}

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
          <TeamMembersClient users={users} invitations={invitations} roles={roles} />
        )}
        {activeTab === 'roles' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <RolesClient initialRoles={roles || []} />
          </div>
        )}
      </div>
    </div>
  )
}

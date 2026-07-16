export const dynamic = 'force-dynamic'
import { getCompanySettings, getBanks, getExchangeRates } from './actions'
import SettingsForm from './SettingsForm'
import BankAccountsList from './BankAccountsList'
import ExchangeRatesList from './ExchangeRatesList'

export const metadata = {
  title: 'Settings - InvoiceFlowPro'
}

export default async function SettingsPage() {
  const settings = await getCompanySettings()
  const banks = await getBanks()
  const exchangeRates = await getExchangeRates()

  return (
    <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your company profile, bank accounts, and preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Company Settings */}
        <SettingsForm initialSettings={settings} />

        {/* Bank Accounts */}
        <section className="bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Bank Accounts</h2>
            <p className="text-sm text-zinc-500 mt-1">Manage bank accounts for client transfers.</p>
          </div>
          <BankAccountsList initialBanks={banks} />
        </section>

        {/* Exchange Rates */}
        <section className="bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Currency Conversion Rates</h2>
            <p className="text-sm text-zinc-500 mt-1">Set fixed exchange rates for international invoices (e.g., USD to INR).</p>
          </div>
          <ExchangeRatesList initialRates={exchangeRates} />
        </section>
      </div>
    </div>
  )
}


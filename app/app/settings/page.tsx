export const dynamic = 'force-dynamic'
import { getCompanySettings, getBanks, getExchangeRates, getInternalTransfers } from './actions'
import SettingsForm from './SettingsForm'
import BankAccountsList from './BankAccountsList'
import ExchangeRatesList from './ExchangeRatesList'
import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import SettingsTabs from './SettingsTabs'

export const metadata = {
  title: 'Settings - InvoiceFlowPro'
}

export default async function SettingsPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams
  const initialTab = searchParams.tab || 'company'
  const settings = await getCompanySettings()
  const banks = await getBanks()
  const exchangeRates = await getExchangeRates()
  const internalTransfers = await getInternalTransfers()
  
  const { companyId } = await requireCompany()
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { supportAccessGranted: true }
  })

  const roles = await prisma.customRole.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  })

  const users = await prisma.user.findMany({
    where: { companyId },
    include: { customRole: true },
    orderBy: { createdAt: 'desc' }
  })

  const invitations = await prisma.invitation.findMany({
    where: { companyId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' }
  })

  const subscription = await prisma.subscription.findUnique({
    where: { companyId }
  })

  const { user: currentUser } = await requireCompany()

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your company profile, bank accounts, and preferences.</p>
      </div>

      <SettingsTabs 
        settings={settings} 
        banks={banks} 
        exchangeRates={exchangeRates} 
        internalTransfers={internalTransfers} 
        initialTab={initialTab} 
        supportAccessGranted={company?.supportAccessGranted || false}
        roles={roles}
        users={users}
        invitations={invitations}
        currentUser={currentUser}
        subscription={subscription}
      />
    </div>
  )
}


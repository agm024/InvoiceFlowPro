const fs = require('fs');
let content = fs.readFileSync('app/app/clients/page.tsx', 'utf8');

content = `import { getClients } from './actions'
import ClientsClient from './ClientsClient'
import prisma from '@/utils/prisma'
import { requireCompany } from '@/lib/auth-context'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const clients = await getClients()
  const { companyId } = await requireCompany()
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  
  let isLimitReached = false;
  if (company?.subscription?.plan?.clientLimits) {
    if (clients.length >= company.subscription.plan.clientLimits) {
      isLimitReached = true;
    }
  }
  
  return <ClientsClient initialClients={clients} isLimitReached={isLimitReached} />
}`;

fs.writeFileSync('app/app/clients/page.tsx', content, 'utf8');

import { getClients } from './actions'
import ClientsClient from './ClientsClient'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const clients = await getClients()
  return <ClientsClient initialClients={clients} />
}

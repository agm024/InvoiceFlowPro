export const dynamic = 'force-dynamic'

import { getClients, deleteClient } from './actions'
import Link from 'next/link'

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Clients</h1>
        <Link 
          href="/clients/new" 
          className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Add Client
        </Link>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p>No clients found. Add your first client to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-sidebar-bg text-zinc-500 border-b border-sidebar-border uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">GSTIN</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sidebar-border">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-sidebar-bg/50 transition-colors text-foreground">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/clients/${client.id}`} className="hover:underline text-blue-500 dark:text-blue-400">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{client.email || '-'}</span>
                        <span className="text-zinc-500 text-xs">{client.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{client.gstin || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <form action={async () => {
                        'use server'
                        await deleteClient(client.id)
                      }}>
                        <button className="text-red-500 hover:text-red-600 text-xs font-medium bg-red-500/10 px-2 py-1 rounded">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


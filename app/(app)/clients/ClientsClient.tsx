'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Edit2, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteClient, updateClient } from './actions'

type Client = any

export default function ClientsClient({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      const res = await deleteClient(id)
      if (res.success) {
        setClients(clients.filter(c => c.id !== id))
        toast.success('Client deleted')
      } else {
        toast.error('Failed to delete')
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingClient) return

    const formData = new FormData(e.currentTarget)
    const res = await updateClient(editingClient.id, formData)
    
    if (res.success && res.client) {
      setClients(clients.map(c => c.id === editingClient.id ? res.client : c))
      setEditingClient(null)
      toast.success('Client updated successfully')
    } else {
      toast.error('Failed to update client')
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Clients</h1>
        <Link 
          href="/clients/new" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Client
        </Link>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden relative">
        {clients.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p>No clients found. Add your first client to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-sidebar-bg text-zinc-500 border-b border-sidebar-border uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Name</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Contact</th>
                  <th className="px-6 py-4 font-medium tracking-wider">GST Details</th>
                  <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sidebar-border">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-sidebar-bg/50 transition-colors text-foreground">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/clients/${client.slug}`} className="hover:underline text-blue-600 dark:text-blue-400 font-semibold">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{client.email || '-'}</span>
                        <span className="text-zinc-500 text-xs">{client.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-600 dark:text-zinc-400">{client.gstin || 'Unregistered'}</span>
                        {client.stateCode && <span className="text-zinc-500 text-xs">State Code: {client.stateCode}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingClient(client)}
                          className="text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
                          className="text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingClient(null)}></div>
            <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-card-border flex justify-between items-center bg-sidebar-bg/50">
                <h2 className="text-lg font-semibold text-foreground">Edit Client Details</h2>
                <button onClick={() => setEditingClient(null)} className="text-zinc-400 hover:text-foreground bg-sidebar-border hover:bg-zinc-200 dark:hover:bg-zinc-700 p-1.5 rounded-md transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-5 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Company / Client Name *</label>
                    <input type="text" name="name" defaultValue={editingClient.name} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Email Address</label>
                    <input type="email" name="email" defaultValue={editingClient.email || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                    <input type="text" name="phone" defaultValue={editingClient.phone || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Billing Address</label>
                    <textarea name="address" defaultValue={editingClient.address || ''} rows={2} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">GSTIN</label>
                    <input type="text" name="gstin" defaultValue={editingClient.gstin || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 uppercase" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">PAN Number</label>
                    <input type="text" name="panNo" defaultValue={editingClient.panNo || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 uppercase" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">State Code (e.g. 27)</label>
                    <input type="text" name="stateCode" defaultValue={editingClient.stateCode || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-card-border">
                  <button type="button" onClick={() => setEditingClient(null)} className="px-5 py-2.5 font-medium text-zinc-500 hover:bg-sidebar-bg rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

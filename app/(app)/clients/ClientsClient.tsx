'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Edit2, X, Plus, Search, Building2, MapPin, Mail, Phone, FileText, IndianRupee, Users, Link as LinkIcon, ExternalLink, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteClient, updateClient, generateMissingPortalTokens } from './actions'
import { useEffect } from 'react'
import { format } from 'date-fns'

type InvoiceStub = { total: number, status: string, date: Date }
type Client = any // We'll assume it has invoices: InvoiceStub[]

export default function ClientsClient({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState(initialClients)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fire and forget to generate missing tokens
    generateMissingPortalTokens()
  }, [])

  const copyPortalLink = (token: string) => {
    if (!token) {
      toast.error('Token not generated yet. Please refresh the page.')
      return
    }
    const url = `${window.location.origin}/portal/${token}`
    navigator.clipboard.writeText(url)
    toast.success('Portal link copied to clipboard!')
  }

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
      // Keep existing invoices data when updating client metadata
      const updatedClient = { ...res.client, invoices: editingClient.invoices }
      setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c))
      setEditingClient(null)
      toast.success('Client updated successfully')
    } else {
      toast.error('Failed to update client')
    }
  }

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const calculateClientStats = (client: Client) => {
    const invoices: InvoiceStub[] = client.invoices || []
    let totalBilled = 0
    let totalPaid = 0
    let outstanding = 0
    let lastPaymentDate: Date | null = null

    invoices.forEach(inv => {
      totalBilled += inv.total
      if (inv.status === 'PAID') {
        totalPaid += inv.total
        if (!lastPaymentDate || new Date(inv.date) > new Date(lastPaymentDate)) {
          lastPaymentDate = inv.date
        }
      } else if (inv.status === 'SENT' || inv.status === 'OVERDUE') {
        outstanding += inv.total
      }
    })

    return { totalBilled, totalPaid, outstanding, invoiceCount: invoices.length, lastPaymentDate }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clients</h1>
          <p className="text-zinc-500 mt-1">Manage your customers and view their billing history.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card-bg border border-card-border rounded-lg text-sm focus:outline-none focus:border-blue-500 text-foreground shadow-sm w-full md:w-64"
            />
          </div>
          <Link 
            href="/clients/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 shrink-0"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Client</span>
          </Link>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="bg-card-bg border border-card-border rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No clients found</h3>
          <p className="text-zinc-500 mb-6">You haven&apos;t added any clients yet, or none match your search.</p>
          <Link href="/clients/new" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
            <Plus size={16} /> Create your first client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const stats = calculateClientStats(client)
            
            return (
              <div key={client.id} className="bg-card-bg border border-card-border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                <div className="p-5 border-b border-card-border">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/clients/${client.slug}`} className="font-bold text-lg text-foreground hover:text-blue-600 transition-colors truncate pr-2">
                      {client.name}
                    </Link>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button 
                        onClick={() => {
                          if (!client.portalToken) return toast.error('Token not generated yet.')
                          const url = `${window.location.origin}/portal/${client.portalToken}`
                          const message = `Hi ${client.name.split(' ')[0]}, you can view your dashboard, outstanding balances, and pay your invoices directly through your secure client portal here: ${url}`
                          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
                        }} 
                        title="Share Portal via WhatsApp" 
                        className="text-zinc-400 hover:text-green-600 p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        <Send size={14} />
                      </button>
                      <button onClick={() => copyPortalLink(client.portalToken)} title="Copy Portal Link" className="text-zinc-400 hover:text-green-600 p-1.5 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                        <LinkIcon size={14} />
                      </button>
                      <button onClick={() => setEditingClient(client)} className="text-zinc-400 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="text-zinc-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 text-sm text-zinc-500 mt-3">
                    {client.email && <div className="flex items-center gap-2 truncate"><Mail size={14} className="shrink-0" /> <span className="truncate">{client.email}</span></div>}
                    {client.phone && <div className="flex items-center gap-2"><Phone size={14} className="shrink-0" /> {client.phone}</div>}
                  </div>
                </div>

                <div className="p-5 bg-sidebar-bg/30 flex-1 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Outstanding</p>
                      <p className={`font-semibold text-lg ${stats.outstanding > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}`}>
                        ₹{stats.outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Paid</p>
                      <p className="font-semibold text-lg text-green-600 dark:text-green-500">
                        ₹{stats.totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-card-border/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                      <FileText size={14} />
                      {stats.invoiceCount} {stats.invoiceCount === 1 ? 'Invoice' : 'Invoices'}
                    </div>
                    {stats.lastPaymentDate && (
                      <div className="text-xs text-zinc-500 font-medium">
                        Last paid: {format(new Date(stats.lastPaymentDate), 'dd MMM yyyy')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal (Kept mostly same, just styled slightly better) */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingClient(null)}></div>
          <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-card-border flex justify-between items-center bg-sidebar-bg/50">
              <h2 className="text-lg font-semibold text-foreground">Edit Client Details</h2>
              <button onClick={() => setEditingClient(null)} className="text-zinc-400 hover:text-foreground bg-sidebar-border hover:bg-zinc-200 dark:hover:bg-zinc-700 p-1.5 rounded-md transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-5 overflow-y-auto hide-scrollbar">
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
                <div className="sm:col-span-2">
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
  )
}

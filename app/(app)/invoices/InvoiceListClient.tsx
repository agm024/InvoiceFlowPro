'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, subYears, startOfYear, endOfYear, startOfQuarter, subQuarters, isWithinInterval, parseISO } from 'date-fns'
import { Search, Plus, PlayCircle, Settings, SlidersHorizontal, ChevronDown, Eye, Send, MoreHorizontal, Copy, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteInvoice } from './actions'

type Invoice = any // using any for simplicity, usually from prisma type
type TabType = 'All' | 'Pending' | 'Paid' | 'Cancelled' | 'Drafts'

export default function InvoiceListClient({ initialInvoices, settings }: { initialInvoices: Invoice[], settings: any }) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const [dateRange, setDateRange] = useState('This Year')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)

  const dateRanges = [
    'Today', 'Yesterday', 'This Week',
    'Last Week', 'This Month', 'Last Month',
    'Last 30 Days', 'This Year', 'Last Year',
    'Last Quarter', 'FY 26-27', 'FY 25-26',
    'FY 24-25', 'FY 23-24', 'Custom'
  ]

  // Handlers
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const res = await deleteInvoice(id)
      if (res.success) {
        setInvoices(invoices.filter(i => i.id !== id))
        toast.success('Invoice deleted')
      } else {
        toast.error('Failed to delete invoice')
      }
    }
  }

  const handleCopyLink = (invoice: Invoice) => {
    const url = `${window.location.origin}/pay/${invoice.id}`
    navigator.clipboard.writeText(url)
    setCopiedId(invoice.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // 1. Tab filtering
      if (activeTab === 'Pending' && invoice.status !== 'sent') return false
      if (activeTab === 'Paid' && invoice.status !== 'paid') return false
      if (activeTab === 'Drafts' && invoice.status !== 'draft') return false
      if (activeTab === 'Cancelled' && invoice.status !== 'cancelled') return false // if cancelled status exists
      
      // 2. Search filtering
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = invoice.client.name.toLowerCase().includes(query)
        const matchesInvNo = invoice.invoiceNumber.toLowerCase().includes(query)
        if (!matchesName && !matchesInvNo) return false
      }
      
      // 3. Date Range filtering
      if (dateRange !== 'Custom' && dateRange !== 'All Time') {
        const invDate = new Date(invoice.date)
        const now = new Date()
        
        switch (dateRange) {
          case 'Today': if (!isToday(invDate)) return false; break;
          case 'Yesterday': if (!isYesterday(invDate)) return false; break;
          case 'This Week': if (!isThisWeek(invDate, { weekStartsOn: 1 })) return false; break;
          case 'Last Week': {
            const start = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
            const end = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
            if (!isWithinInterval(invDate, { start, end })) return false;
            break;
          }
          case 'This Month': if (!isThisMonth(invDate)) return false; break;
          case 'Last Month': {
            const start = startOfMonth(subMonths(now, 1))
            const end = endOfMonth(subMonths(now, 1))
            if (!isWithinInterval(invDate, { start, end })) return false;
            break;
          }
          case 'Last 30 Days': {
            const start = subDays(now, 30)
            if (!isWithinInterval(invDate, { start, end: now })) return false;
            break;
          }
          case 'This Year': if (!isThisYear(invDate)) return false; break;
          case 'Last Year': {
            const start = startOfYear(subYears(now, 1))
            const end = endOfYear(subYears(now, 1))
            if (!isWithinInterval(invDate, { start, end })) return false;
            break;
          }
          case 'Last Quarter': {
            const start = startOfQuarter(subQuarters(now, 1))
            // Approx 3 months
            const end = endOfMonth(subMonths(start, 2))
            if (!isWithinInterval(invDate, { start, end })) return false;
            break;
          }
          case 'FY 26-27': if (invDate < new Date('2026-04-01') || invDate > new Date('2027-03-31')) return false; break;
          case 'FY 25-26': if (invDate < new Date('2025-04-01') || invDate > new Date('2026-03-31')) return false; break;
          case 'FY 24-25': if (invDate < new Date('2024-04-01') || invDate > new Date('2025-03-31')) return false; break;
          case 'FY 23-24': if (invDate < new Date('2023-04-01') || invDate > new Date('2024-03-31')) return false; break;
        }
      }
      
      return true
    })
  }, [invoices, activeTab, searchQuery, dateRange])

  // Summary Calculations
  const summary = useMemo(() => {
    let total = 0
    let paid = 0
    let pending = 0

    filteredInvoices.forEach(inv => {
      // Converting everything back to INR equivalent for summary if needed, or just summing the base value.
      // Since the screenshot shows a single currency (₹), we assume the user wants the total in INR.
      const invTotalInr = inv.currency === 'INR' ? inv.total : (inv.total * inv.exchangeRate)
      
      total += invTotalInr
      if (inv.status === 'paid') paid += invTotalInr
      else pending += invTotalInr
    })

    return { total, paid, pending }
  }, [filteredInvoices])

  const tabs: TabType[] = ['All', 'Pending', 'Paid', 'Cancelled', 'Drafts']

  return (
    <div className="flex flex-col h-full bg-white dark:bg-card-bg rounded-2xl shadow-sm border border-zinc-200 dark:border-card-border overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-zinc-100 dark:border-sidebar-border gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Sales</h1>
          <PlayCircle className="text-pink-500 fill-pink-50" size={24} />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <Link href="/settings" className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            <Settings size={16} /> Document Settings
          </Link>
          <Link 
            href="/invoices/new" 
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus size={18} /> Create Invoice
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-zinc-100 dark:border-sidebar-border overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab}
            {tab === 'All' && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'All' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-600'}`}>
                {invoices.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filters Bar */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 flex-shrink-0">
          <Search className="absolute left-3 top-2.5 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by transaction, customers, invoice etc.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg pl-10 pr-4 py-2 bg-zinc-50 dark:bg-sidebar-bg border border-zinc-200 dark:border-sidebar-border focus:outline-none focus:border-blue-500 text-sm transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-end relative">
          <button 
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-sidebar-bg text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            {dateRange} <ChevronDown size={16} />
          </button>

          {isDateDropdownOpen && (
            <>
              {/* Backdrop for mobile closing */}
              <div className="fixed inset-0 z-40" onClick={() => setIsDateDropdownOpen(false)}></div>
              
              <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-white dark:bg-card-bg border border-zinc-200 dark:border-card-border rounded-xl shadow-xl z-50 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-foreground">Select Date Range</h3>
                  <button onClick={() => setIsDateDropdownOpen(false)} className="text-zinc-400 hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>
                
                <h4 className="font-semibold text-foreground mb-3">Presets</h4>
                
                <div className="flex flex-wrap gap-2">
                  {dateRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => { setDateRange(range); setIsDateDropdownOpen(false); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        dateRange === range 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-transparent text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-sidebar-border hover:border-zinc-300 dark:hover:border-zinc-500'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-x-auto min-h-0">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-zinc-50 dark:bg-sidebar-bg text-zinc-500 text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Mode</th>
              <th className="px-6 py-4">Bill #</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right rounded-tr-lg w-48"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-sidebar-border text-sm">
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="group hover:bg-zinc-50/50 dark:hover:bg-sidebar-bg/50 transition-colors">
                
                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    {invoice.currency === 'INR' ? '₹' : invoice.currency} {invoice.total.toFixed(2)}
                    {invoice.status === 'sent' && <div className="w-4 h-4 bg-green-100 text-green-600 rounded flex items-center justify-center" title="Sent via email"><Send size={10} /></div>}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.status === 'paid' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                      PAID
                    </span>
                  ) : invoice.status === 'sent' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      PENDING
                    </span>
                  ) : invoice.status === 'draft' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                      DRAFT
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700 border border-red-200 uppercase">
                      {invoice.status}
                    </span>
                  )}
                </td>

                {/* Mode Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.paymentMethod === 'UPI' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 uppercase">
                      UPI
                    </span>
                  ) : invoice.paymentMethod === 'BANK' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                      BANK
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-xs">-</span>
                  )}
                </td>

                {/* Bill # */}
                <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-900 dark:text-zinc-200">
                  {invoice.invoiceNumber}
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-zinc-900 dark:text-white">{invoice.client.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{invoice.client.phone || invoice.client.email || 'No contact details'}</div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-zinc-900 dark:text-white">{format(new Date(invoice.date), 'dd MMM yyyy')}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{format(new Date(invoice.createdAt), 'dd MMM yy, hh:mm a')}</div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/invoices/${invoice.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-sidebar-bg dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Eye size={14} /> View
                    </Link>
                    <button 
                      onClick={() => handleCopyLink(invoice)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      {copiedId === invoice.id ? <Check size={14} /> : <Send size={14} />} 
                      {copiedId === invoice.id ? 'Copied' : 'Send'}
                    </button>
                    
                    {/* Simplified More Options for this UI */}
                    <div className="relative group/dropdown">
                      <button className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-sidebar-bg dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-card-bg rounded-lg shadow-lg border border-zinc-200 dark:border-card-border opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10">
                        {invoice.status !== 'paid' && (
                          <button onClick={async () => {
                            const { markInvoiceAsPaid } = await import('./actions')
                            const res = await markInvoiceAsPaid(invoice.id)
                            if (res.success) {
                              setInvoices(invoices.map(i => i.id === invoice.id ? { ...i, status: 'paid' } : i))
                              toast.success('Invoice marked as paid!')
                            } else {
                              toast.error('Failed to update status')
                            }
                          }} className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 text-left w-full border-b border-zinc-100 dark:border-card-border">Mark as Paid</button>
                        )}
                        <Link href={`/invoices/${invoice.id}/edit`} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 text-left w-full">Edit</Link>
                        <button onClick={() => handleDelete(invoice.id)} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left w-full">Delete</button>
                      </div>
                    </div>
                  </div>
                </td>

              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  No invoices found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-zinc-50 dark:bg-sidebar-bg p-4 border-t border-zinc-100 dark:border-sidebar-border flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
            <span className="text-sm font-medium">Total</span>
            <span className="font-bold">₹{summary.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-2 rounded-xl border border-green-100 dark:border-green-800">
            <span className="text-sm font-medium">Paid</span>
            <span className="font-bold">₹{summary.paid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <Check size={14} className="ml-1" />
          </div>

          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-800">
            <span className="text-sm font-medium">Pending</span>
            <span className="font-bold">₹{summary.pending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
          <span>1/1</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded bg-zinc-200/50 text-zinc-400 cursor-not-allowed">{'<'}</button>
            <button className="p-1.5 rounded bg-zinc-200/50 text-zinc-400 cursor-not-allowed">{'>'}</button>
          </div>
        </div>

      </div>

    </div>
  )
}

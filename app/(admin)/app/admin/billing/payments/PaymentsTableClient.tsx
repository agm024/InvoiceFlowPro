"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Search, RotateCcw, ShieldAlert, Check } from "lucide-react"
import { refundPayment } from "./actions"

interface PaymentRow {
  id: string
  gatewayTransactionId: string | null
  companyId: string
  companyName: string
  planName: string
  originalAmount: number
  originalCurrency: string
  convertedAmountInr: number
  status: string
  createdAt: string
}

interface PaymentsTableClientProps {
  payments: PaymentRow[]
}

export function PaymentsTableClient({ payments }: PaymentsTableClientProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isPending, startTransition] = useTransition()
  const itemsPerPage = 15

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      (p.gatewayTransactionId && p.gatewayTransactionId.toLowerCase().includes(search.toLowerCase())) ||
      p.companyName.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "" || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleRefund = (id: string) => {
    if (confirm("Are you sure you want to issue a full refund for this transaction? This action is immutable.")) {
      startTransition(async () => {
        try {
          await refundPayment(id)
          alert("Refund completed successfully.")
        } catch (err: any) {
          alert(err.message)
        }
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by transaction ID, gateway ID, business..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="REFUNDED">Refunded</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Original Amount</th>
                <th className="px-6 py-4">INR Equivalent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {paginatedPayments.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 font-mono text-zinc-900 dark:text-white">
                    {p.gatewayTransactionId || p.id}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/app/admin/businesses/${p.companyId}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {p.companyName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{p.planName}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {p.originalCurrency === "USD" ? "$" : "₹"}{p.originalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-zinc-900 dark:text-white">
                    ₹{p.convertedAmountInr.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === "SUCCESS" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                        : p.status === "REFUNDED"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status === "SUCCESS" && (
                      <button
                        onClick={() => handleRefund(p.id)}
                        disabled={isPending}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 ml-auto"
                      >
                        <RotateCcw size={12} /> Issue Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {paginatedPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs font-semibold bg-zinc-50/50 dark:bg-zinc-900/20">
            <span className="text-zinc-500">Showing page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

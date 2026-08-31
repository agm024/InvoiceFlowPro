"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Search, Eye, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react"
import { updateTicketDetails } from "./actions"

interface TicketRow {
  id: string
  subject: string
  status: string
  priority: string
  companyId: string
  companyName: string
  createdAt: string
}

interface TicketsTableClientProps {
  tickets: TicketRow[]
}

export function TicketsTableClient({ tickets }: TicketsTableClientProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Drawer / Overlay Detail State
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null)
  const [targetStatus, setTargetStatus] = useState("")
  const [targetPriority, setTargetPriority] = useState("")
  const [commentReason, setCommentReason] = useState("")
  const [isPending, startTransition] = useTransition()
  const itemsPerPage = 15

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.companyName.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "" || t.status === statusFilter
    const matchesPriority = priorityFilter === "" || t.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleOpenDetail = (t: TicketRow) => {
    setSelectedTicket(t)
    setTargetStatus(t.status)
    setTargetPriority(t.priority)
    setCommentReason("")
  }

  const handleSaveDetails = () => {
    if (!selectedTicket) return
    if (!commentReason.trim()) return alert("A comment reason is required to document this ticket update.")

    startTransition(async () => {
      try {
        await updateTicketDetails(selectedTicket.id, targetStatus, targetPriority, commentReason)
        alert("Support ticket updated successfully.")
        
        // Update local selected ticket view
        setSelectedTicket({
          ...selectedTicket,
          status: targetStatus,
          priority: targetPriority
        })
        setCommentReason("")
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input 
            type="text"
            placeholder="Search tickets by subject, company name..."
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
            <option value="OPEN">Open</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select 
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid: list + detail side-by-side if selected */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table list */}
        <div className={`bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm ${
          selectedTicket ? "lg:col-span-2" : "lg:col-span-3"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                {paginatedTickets.map(t => (
                  <tr 
                    key={t.id} 
                    className={`hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition cursor-pointer ${
                      selectedTicket?.id === t.id ? "bg-zinc-50 dark:bg-zinc-900/50" : ""
                    }`}
                    onClick={() => handleOpenDetail(t)}
                  >
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white truncate max-w-xs">{t.subject}</td>
                    <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{t.companyName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "OPEN" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                          : t.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.priority === "HIGH" 
                          ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400" 
                          : t.priority === "MEDIUM"
                          ? "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenDetail(t); }}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedTickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      No support tickets found.
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

        {/* Selected Ticket Drawer Panel */}
        {selectedTicket && (
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit space-y-4 relative animate-fade-in">
            {isPending && (
              <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10">
                <RefreshCw size={24} className="animate-spin text-zinc-500" />
              </div>
            )}
            
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Ticket Resolution Drawer</h3>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs font-bold transition"
              >
                Close ✕
              </button>
            </div>

            <div className="border-t border-b border-zinc-100 dark:border-zinc-900 py-3 space-y-2 text-xs">
              <p className="font-semibold text-zinc-900 dark:text-white">{selectedTicket.subject}</p>
              <div className="flex justify-between mt-1 text-[10px] text-zinc-400">
                <span>Company: <Link href={`/app/admin/businesses/${selectedTicket.companyId}`} className="text-blue-500 hover:underline">{selectedTicket.companyName}</Link></span>
                <span>ID: {selectedTicket.id}</span>
              </div>
            </div>

            {/* Editing settings */}
            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 mb-1">Status</label>
                  <select 
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                    className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5"
                  >
                    <option value="OPEN">Open</option>
                    <option value="PENDING">Pending</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Priority</label>
                  <select 
                    value={targetPriority}
                    onChange={(e) => setTargetPriority(e.target.value)}
                    className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Internal Note / Action Reason</label>
                <textarea 
                  rows={3} 
                  placeholder="e.g. Advised user to clear browser cache for invoice receipts." 
                  value={commentReason}
                  onChange={(e) => setCommentReason(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <button 
                onClick={handleSaveDetails}
                disabled={isPending || !commentReason.trim()}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
              >
                Save Ticket Update <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

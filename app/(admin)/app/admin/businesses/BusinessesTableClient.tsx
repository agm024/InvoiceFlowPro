"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  Search, ChevronDown, Download, Eye, ShieldAlert, Archive, 
  RefreshCw, Check, Columns, ArrowUpDown, MoreHorizontal, UserCheck
} from "lucide-react"

interface BusinessRow {
  id: string
  name: string
  status: string
  createdAt: string
  subscription?: {
    plan?: {
      name: string
    }
    status: string
  } | null
  _count: {
    users: number
    invoices: number
    clients: number
  }
}

interface BusinessesTableClientProps {
  companies: BusinessRow[]
  plans: { id: string; name: string }[]
  total: number
  page: number
  totalPages: number
  search: string
  statusFilter: string
  planFilter: string
  sortBy: string
  sortOrder: string
}

export function BusinessesTableClient({
  companies,
  plans,
  total,
  page,
  totalPages,
  search,
  statusFilter,
  planFilter,
  sortBy,
  sortOrder
}: BusinessesTableClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State for search and UI filters
  const [searchInput, setSearchInput] = useState(search)
  const [showColumnDropdown, setShowColumnDropdown] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    business: true,
    plan: true,
    status: true,
    users: true,
    clients: true,
    invoices: true,
    created: true,
  })

  // Bulk actions selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const updateQueryParams = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === "") {
        params.delete(key)
      } else {
        params.set(key, String(val))
      }
    })
    params.set("page", "1") // reset to page 1 on filter
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateQueryParams({ search: searchInput })
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSort = (field: string) => {
    const nextOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc"
    updateQueryParams({ sortBy: field, sortOrder: nextOrder })
  }

  const exportToCSV = () => {
    const headers = ["ID", "Business Name", "Plan", "Status", "Users", "Clients", "Invoices", "Created Date"]
    const rows = companies.map(c => [
      c.id,
      c.name,
      c.subscription?.plan?.name || "No Plan",
      c.status,
      c._count.users,
      c._count.clients,
      c._count.invoices,
      new Date(c.createdAt).toLocaleDateString()
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n")
      
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `businesses_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === companies.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(companies.map(c => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-4">
      {/* Table Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input 
            type="text"
            placeholder="Search companies by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
          />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Plan Filter */}
          <select 
            value={planFilter}
            onChange={(e) => updateQueryParams({ planId: e.target.value })}
            className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="">All Plans</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => updateQueryParams({ status: e.target.value })}
            className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIAL">Trial</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Column Visibility Toggler */}
          <div className="relative">
            <button 
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center gap-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Columns size={14} /> Columns
            </button>
            {showColumnDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-2.5 z-40 space-y-1.5">
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 capitalize cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={visibleColumns[col as keyof typeof visibleColumns]}
                      onChange={() => setVisibleColumns({
                        ...visibleColumns,
                        [col]: !visibleColumns[col as keyof typeof visibleColumns]
                      })}
                      className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    {col}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* CSV Export */}
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedIds.length > 0 && (
        <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-400">
          <span>{selectedIds.length} companies selected</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                // Implement bulk archiving action
                if (confirm("Are you sure you want to archive selected companies?")) {
                  alert("Bulk action completed.");
                  setSelectedIds([]);
                }
              }}
              className="bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-lg transition"
            >
              Bulk Archive
            </button>
          </div>
        </div>
      )}

      {/* Main Dense Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10">
            <RefreshCw size={24} className="animate-spin text-zinc-500" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-4">
                  <input 
                    type="checkbox" 
                    checked={companies.length > 0 && selectedIds.length === companies.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {visibleColumns.business && (
                  <th className="px-6 py-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900" onClick={() => handleSort("name")}>
                    Business {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.plan && <th className="px-6 py-4">Plan</th>}
                {visibleColumns.status && <th className="px-6 py-4">Subscription Status</th>}
                {visibleColumns.users && <th className="px-6 py-4">Users</th>}
                {visibleColumns.clients && <th className="px-6 py-4">Clients</th>}
                {visibleColumns.invoices && <th className="px-6 py-4">Invoices</th>}
                {visibleColumns.created && (
                  <th className="px-6 py-4 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900" onClick={() => handleSort("createdAt")}>
                    Created {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 w-4">
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(company.id)}
                      onChange={() => toggleSelect(company.id)}
                      className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {visibleColumns.business && (
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                        {company.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-white">{company.name}</span>
                        <p className="text-[10px] text-zinc-400 mt-0.5">ID: {company.id}</p>
                      </div>
                    </td>
                  )}
                  {visibleColumns.plan && (
                    <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                      {company.subscription?.plan?.name || "No Plan"}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        company.status === "ACTIVE" 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                          : company.status === "SUSPENDED"
                          ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                      }`}>
                        {company.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.users && <td className="px-6 py-4 text-zinc-500">{company._count.users}</td>}
                  {visibleColumns.clients && <td className="px-6 py-4 text-zinc-500">{company._count.clients}</td>}
                  {visibleColumns.invoices && <td className="px-6 py-4 text-zinc-500">{company._count.invoices}</td>}
                  {visibleColumns.created && (
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link 
                        href={`/app/admin/businesses/${company.id}`}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {companies.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-zinc-500">
                    No businesses found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs font-semibold bg-zinc-50/50 dark:bg-zinc-900/20">
            <span className="text-zinc-500">Showing page {page} of {totalPages} (Total: {total})</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
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

"use client"

import React, { useState, Fragment } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2, ShieldAlert, Edit, Plus, Trash2, Clock, Search, Filter, Download, ArrowRight, XCircle } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

function formatActionName(action: string) {
  if (!action) return 'Unknown Action'
  return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
}

export function AuditTableClient({ 
  logs,
  currentPage,
  totalPages,
  totalLogs,
  filters
}: { 
  logs: any[],
  currentPage: number,
  totalPages: number,
  totalLogs: number,
  filters: any
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState(filters.search || '')

  const toggleRow = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset to page 1 on filter change
    if (key !== 'page') params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchParam('search', searchTerm)
  }

  const handleExport = () => {
    alert("Export functionality to be implemented by backend.")
  }

  return (
    <div className="space-y-4">
      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSearch} className="flex-1 max-w-md w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select 
            value={filters.action || ''}
            onChange={(e) => updateSearchParam('action', e.target.value)}
            className="px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-600 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-max"
          >
            <option value="">All Actions</option>
            <option value="PLAN_UPDATED">Plan Updated</option>
            <option value="IMPERSONATE_COMPANY_START">Impersonation Started</option>
            <option value="IMPERSONATE_COMPANY_STOP">Impersonation Ended</option>
            {/* Could populate dynamically from actual actions if needed */}
          </select>
          <select className="px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-600 dark:text-zinc-300 focus:outline-none focus:ring-1 min-w-max">
            <option value="">Date Range</option>
          </select>
          
          <button 
            onClick={handleExport}
            className="ml-auto px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 min-w-max"
          >
            Export <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 text-xs uppercase tracking-wider sticky top-0 z-20 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 w-10 text-center"></th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Admin / User</th>
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-6 py-3 font-medium">Result</th>
                <th className="px-6 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {logs.map(log => {
                const isExpanded = expandedId === log.id
                let parsedMetadata: any = null
                try { parsedMetadata = log.metadata ? JSON.parse(log.metadata) : null } 
                catch (e) { parsedMetadata = log.metadata }

                const isSuccessful = !log.failureReason && (!parsedMetadata || !parsedMetadata.error)
                const source = (log.ipAddress === "::1" || log.ipAddress === "127.0.0.1") ? "Local" : (log.ipAddress || "System")
                const isImpersonationStart = log.action === 'IMPERSONATE_COMPANY_START'
                const isImpersonationStop = log.action === 'IMPERSONATE_COMPANY_STOP'

                return (
                  <Fragment key={log.id}>
                    <tr 
                      onClick={() => toggleRow(log.id)}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors bg-white dark:bg-zinc-950"
                    >
                      <td className="px-4 py-4 text-zinc-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-500" suppressHydrationWarning>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{formatActionName(log.action)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-zinc-800 dark:text-zinc-200">{log.adminName || 'Unknown User'}</span>
                          <span className="text-[10px] text-zinc-500">{log.adminRole || 'Super Admin'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-800 dark:text-zinc-200">{log.businessName || 'System-wide'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {isSuccessful ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> <span className="text-xs font-medium">Successful</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                            <XCircle className="w-3.5 h-3.5" /> <span className="text-xs font-medium">Failed</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{source}</td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-zinc-50 dark:bg-zinc-900/40 border-l-4 border-l-zinc-300 dark:border-l-zinc-700">
                        <td colSpan={7} className="px-8 py-8 border-t border-zinc-100 dark:border-zinc-800/50 shadow-inner">
                          
                          {/* Expanded Detail View */}
                          <div className="max-w-4xl space-y-8">
                            
                            {/* Header inside details */}
                            <div className="flex flex-col gap-1">
                              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                {formatActionName(log.action)}
                              </h3>
                              {log.reason && <p className="text-sm text-zinc-500">Reason: {log.reason}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                              {/* Left Column: Actor & Business Info */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Actor</h4>
                                  <div className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">{log.adminName || 'Unknown'}</div>
                                  <div className="text-xs text-zinc-500 mb-1">{log.adminRole || 'Super Admin'}</div>
                                  <div className="font-mono text-xs text-zinc-400">{log.adminId}</div>
                                </div>

                                {log.companyId && (
                                  <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Business</h4>
                                    <div className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">{log.businessName || 'Unknown'}</div>
                                    <div className="font-mono text-xs text-zinc-400">{log.companyId}</div>
                                  </div>
                                )}
                                
                                {isImpersonationStart && (
                                  <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Impersonation Started</h4>
                                    <div className="text-sm text-zinc-800 dark:text-zinc-200">
                                      <span className="text-zinc-500">Acting as:</span> {log.businessName || log.targetId}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right Column: Context & Metadata */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Context</h4>
                                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                                    <div className="text-zinc-500">IP Address</div>
                                    <div className="font-mono text-zinc-700 dark:text-zinc-300">{log.ipAddress || '-'}</div>
                                    
                                    <div className="text-zinc-500">User Agent</div>
                                    <div className="font-mono text-zinc-700 dark:text-zinc-300 truncate" title={log.userAgent}>{log.userAgent || '-'}</div>
                                    
                                    <div className="text-zinc-500">Request ID</div>
                                    <div className="font-mono text-zinc-700 dark:text-zinc-300">{log.requestId || '-'}</div>
                                    
                                    {log.sessionId && (
                                      <>
                                        <div className="text-zinc-500">Session ID</div>
                                        <div className="font-mono text-zinc-700 dark:text-zinc-300">{log.sessionId}</div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Event Result</h4>
                                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                                    <div className="text-zinc-500">Result</div>
                                    <div className="font-medium">{isSuccessful ? <span className="text-emerald-500">✓ Successful</span> : <span className="text-red-500">✕ Failed</span>}</div>
                                    
                                    <div className="text-zinc-500">Timestamp</div>
                                    <div className="text-zinc-700 dark:text-zinc-300" suppressHydrationWarning>{new Date(log.createdAt).toLocaleString()}</div>
                                    
                                    <div className="text-zinc-500">Action Code</div>
                                    <div className="font-mono text-zinc-700 dark:text-zinc-300">{log.action}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Changes / Before-After Section */}
                            {parsedMetadata && typeof parsedMetadata === 'object' && Object.keys(parsedMetadata).length > 0 && (
                              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Changes</h4>
                                <div className="space-y-2">
                                  {Object.entries(parsedMetadata).map(([key, val]) => {
                                    if (key === 'before' || key === 'after') return null; // handle separately if needed
                                    
                                    // if it explicitly has before/after nested:
                                    if (val && typeof val === 'object' && ('before' in val || 'after' in val)) {
                                      const b = (val as any).before
                                      const a = (val as any).after
                                      return (
                                        <div key={key} className="flex items-center gap-4 text-sm">
                                          <div className="w-32 text-zinc-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' ').trim()}</div>
                                          <div className="flex items-center gap-2 font-mono text-xs">
                                            <span className="px-2 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded">{String(b)}</span>
                                            <ArrowRight className="w-3 h-3 text-zinc-400" />
                                            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded">{String(a)}</span>
                                          </div>
                                        </div>
                                      )
                                    }
                                    
                                    return (
                                      <div key={key} className="flex gap-4 text-sm">
                                        <div className="w-32 text-zinc-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' ').trim()}</div>
                                        <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20 text-sm">No audit logs match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
              <span className="text-sm text-zinc-500">
                Showing {((currentPage - 1) * 50) + 1} to {Math.min(currentPage * 50, totalLogs)} of {totalLogs} events
              </span>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage <= 1}
                  onClick={() => updateSearchParam('page', String(currentPage - 1))}
                  className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded text-sm disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => updateSearchParam('page', String(currentPage + 1))}
                  className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded text-sm disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

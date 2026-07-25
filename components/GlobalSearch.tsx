'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, FileSpreadsheet, Users, CreditCard, LayoutDashboard, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const defaultResults = [
    { title: 'Create New Invoice', href: '/invoices/new', icon: FileSpreadsheet },
    { title: 'View All Clients', href: '/clients', icon: Users },
    { title: 'Record an Expense', href: '/expenses', icon: CreditCard },
    { title: 'Go to Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'System Settings', href: '/settings', icon: Settings },
  ]

  const results = query 
    ? defaultResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    : defaultResults

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div 
        className="bg-card-bg w-full max-w-2xl rounded-xl shadow-2xl border border-card-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-card-border">
          <Search size={20} className="text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for anything... (Type 'create invoice')"
            className="flex-1 bg-transparent border-none outline-none text-foreground font-medium placeholder:text-zinc-500"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="text-xs text-zinc-400 font-semibold border border-sidebar-border bg-sidebar-bg px-2 py-1 rounded">ESC</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((result, i) => {
              const Icon = result.icon
              return (
                <button
                  key={i}
                  onClick={() => {
                    router.push(result.href)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-colors text-left"
                >
                  <Icon size={18} className="text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 mr-3" />
                  <span className="text-foreground font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">{result.title}</span>
                </button>
              )
            })
          ) : (
            <div className="py-12 text-center text-zinc-500">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
    </div>
  )
}

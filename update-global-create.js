const fs = require('fs');

const globalCreateComponent = `
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Receipt, FileText, Users, Box, CreditCard, FolderKanban } from 'lucide-react'

export default function GlobalCreateMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="fixed top-6 right-6 z-50 hidden md:block print:hidden" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
      >
        <Plus size={18} /> Create
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Create New</div>
          
          <Link href="/app/invoices/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-200">
            <Receipt size={16} className="text-blue-500" /> Invoice
          </Link>
          <Link href="/app/estimates/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-200">
            <FileText size={16} className="text-purple-500" /> Estimate
          </Link>
          <Link href="/app/clients/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-200">
            <Users size={16} className="text-green-500" /> Client
          </Link>
          <Link href="/app/products/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-200">
            <Box size={16} className="text-amber-500" /> Product
          </Link>
          <Link href="/app/projects/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-200">
            <FolderKanban size={16} className="text-rose-500" /> Project
          </Link>
        </div>
      )}
    </div>
  )
}
`
fs.writeFileSync('components/GlobalCreateMenu.tsx', globalCreateComponent, 'utf8');

let layoutClient = fs.readFileSync('components/AppLayoutClient.tsx', 'utf8');

layoutClient = layoutClient.replace(
  "import { useEffect } from 'react'",
  "import { useEffect } from 'react'\nimport GlobalCreateMenu from './GlobalCreateMenu'"
);

layoutClient = layoutClient.replace(
  "{children}\n      </main>",
  "{children}\n      </main>\n      <GlobalCreateMenu />"
);

fs.writeFileSync('components/AppLayoutClient.tsx', layoutClient, 'utf8');


'use client'

import { useState } from 'react'
import { Plus, FileSpreadsheet, Users, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
      >
        <Plus size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 transition-opacity duration-200">
          <Link href="/app/invoices/new" onClick={() => setIsOpen(false)} className="flex items-center justify-end gap-3 group">
            <span className="bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Create Invoice</span>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground p-3 rounded-full shadow-md hover:text-blue-600 transition-colors">
              <FileSpreadsheet size={20} />
            </div>
          </Link>
          <Link href="/app/clients" onClick={() => setIsOpen(false)} className="flex items-center justify-end gap-3 group">
            <span className="bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Client</span>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground p-3 rounded-full shadow-md hover:text-blue-600 transition-colors">
              <Users size={20} />
            </div>
          </Link>
          <Link href="/app/expenses" onClick={() => setIsOpen(false)} className="flex items-center justify-end gap-3 group">
            <span className="bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Record Expense</span>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-foreground p-3 rounded-full shadow-md hover:text-blue-600 transition-colors">
              <CreditCard size={20} />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}


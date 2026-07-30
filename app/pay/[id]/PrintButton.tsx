'use client'

import { FileText } from 'lucide-react'

export default function PrintButton() {
  return (
    <button 
      type="button" 
      onClick={() => window.print()}
      className="text-sm font-medium text-zinc-900 dark:text-white hover:opacity-70 transition-opacity inline-flex items-center gap-1"
    >
      <FileText size={16} /> Download as PDF
    </button>
  )
}

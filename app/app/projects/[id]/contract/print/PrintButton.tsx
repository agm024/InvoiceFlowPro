'use client'
import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button 
      onClick={() => {
        if (typeof window !== 'undefined') window.print()
      }}
      className="px-6 py-2 bg-primary hover:bg-primary-hover transition-colors text-primary-foreground rounded-lg font-sans font-semibold flex items-center gap-2"
    >
      <Printer size={18} />
      Print to PDF
    </button>
  )
}

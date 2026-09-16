'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

export default function PrintButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = () => {
    window.print()
  }

  return (
    <button 
      type="button" 
      onClick={handleDownload}
      disabled={isExporting}
      className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-50"
    >
      <Download size={16} /> {isExporting ? 'Exporting...' : 'Export as PDF'}
    </button>
  )
}



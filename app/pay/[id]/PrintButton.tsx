'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

export default function PrintButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    try {
      setIsExporting(true)
      const element = document.getElementById('invoice-content')
      if (!element) {
        toast.error('Could not find invoice content')
        return
      }
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      })
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('Invoice.pdf')
      
    } catch (e) {
      toast.error('Failed to generate PDF')
      console.error(e)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button 
      type="button" 
      onClick={handleDownload}
      disabled={isExporting}
      className="text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-50"
    >
      <Download size={16} /> {isExporting ? 'Exporting...' : 'Export as PDF'}
    </button>
  )
}

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
      const element = document.getElementById('statement-content')
      if (!element) {
        toast.error('Could not find statement content')
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
      pdf.save('Account_Statement.pdf')
      
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
      className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
    >
      <Download size={20} />
      {isExporting ? 'Exporting...' : 'Export as PDF'}
    </button>
  )
}

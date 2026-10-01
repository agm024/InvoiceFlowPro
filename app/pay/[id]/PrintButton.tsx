'use client'

import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

export default function PrintButton({ invoiceNumber }: { invoiceNumber?: string }) {
  const [isExporting, setIsExporting] = useState(false)
  const [isAutoDownloading, setIsAutoDownloading] = useState(false)

  const generatePDF = async () => {
    try {
      setIsExporting(true)
      const element = document.getElementById('invoice-content')
      if (!element) {
        toast.error('Could not find invoice content')
        return false
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
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth
      
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = position - pageHeight
        pdf.addPage()
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      const filename = invoiceNumber ? `Invoice_${invoiceNumber}.pdf` : 'Invoice.pdf';
      pdf.save(filename)
      toast.success('Invoice downloaded!')
      return true
    } catch (e) {
      toast.error('Failed to generate PDF')
      console.error(e)
      return false
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        setIsAutoDownloading(true)
        setTimeout(async () => {
          await generatePDF()
          setTimeout(() => {
            window.close()
          }, 2000)
        }, 1500)
      }
    }
  }, [])

  if (isAutoDownloading) {
    return (
      <div className="flex items-center gap-2 text-primary font-medium">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
        Downloading PDF...
      </div>
    )
  }

  return (
    <button 
      type="button" 
      onClick={generatePDF}
      disabled={isExporting}
      className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 disabled:opacity-50"
    >
      <Download size={16} /> {isExporting ? 'Generating PDF...' : 'Download PDF'}
    </button>
  )
}



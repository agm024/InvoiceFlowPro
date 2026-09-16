'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

export default function PrintButton({ invoiceNumber }: { invoiceNumber?: string }) {
  const [isExporting, setIsExporting] = useState(false)

  const generatePDF = async () => {
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
      return true;
    } catch (e) {
      toast.error('Failed to generate PDF')
      console.error(e)
      return false;
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        setTimeout(async () => {
          await generatePDF();
          // Close the tab after download if it was opened for this specific purpose
          window.close();
        }, 800); // Give fonts/images time to load
      }
    }
  }, [])

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



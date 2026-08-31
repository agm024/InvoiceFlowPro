'use client'

import { useState } from 'react'
import { logGstExport } from './actions'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GstExportButton({ 
  exportType, 
  invoices,
  validCount = 0,
  warningCount = 0,
  errorCount = 0
}: { 
  exportType: string, 
  invoices: any[],
  validCount?: number,
  warningCount?: number,
  errorCount?: number
}) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      let csvContent = ''
      
      if (exportType === 'GSTR-1') {
        const headers = ['Invoice Number', 'Invoice Date', 'Client Name', 'Client GSTIN', 'Taxable Value', 'GST Rate (%)', 'CGST', 'SGST', 'IGST', 'Invoice Total']
        const rows = invoices.map(i => [
          i.invoiceNumber,
          new Date(i.date).toLocaleDateString(),
          `"${i.clientName.replace(/"/g, '""')}"`,
          i.clientGstin,
          i.taxableValue.toFixed(2),
          i.rate,
          i.cgst.toFixed(2),
          i.sgst.toFixed(2),
          i.igst.toFixed(2),
          i.invoiceValue.toFixed(2)
        ])
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      } else {
        // GSTR-3B
        const headers = ['Filing Category', 'Taxable Value', 'Integrated Tax (IGST)', 'Central Tax (CGST)', 'State Tax (SGST)', 'Total Tax Amount']
        const item = invoices[0] || { taxableAmount: 0, taxAmount: 0 }
        const rows = [
          [
            '3.1(a) Outward taxable supplies (other than zero rated, nil rated and exempted)',
            item.taxableAmount.toFixed(2),
            '0.00',
            (item.taxAmount / 2).toFixed(2),
            (item.taxAmount / 2).toFixed(2),
            item.taxAmount.toFixed(2)
          ]
        ]
        csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      }

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `${exportType}_export_${Date.now()}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Log event in database
      const period = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      const res = await logGstExport(exportType, period, validCount, warningCount, errorCount)
      if (res?.success) {
        toast.success(`${exportType} compiled and downloaded successfully!`)
      } else {
        toast.error('Compiled downloaded, but failed to log to export history.')
      }
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('GST Export compilation failed.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
    >
      <Download size={14} />
      {isExporting ? 'Compiling...' : `Export ${exportType}`}
    </button>
  )
}

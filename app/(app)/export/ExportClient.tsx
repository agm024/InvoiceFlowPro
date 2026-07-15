'use client'

import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export default function ExportClient({ invoices }: { invoices: any[] }) {
  
  const handleDownload = () => {
    const wb = XLSX.utils.book_new()
    
    // 1. B2B Sheet (Registered Businesses with GSTIN)
    const b2bInvoices = invoices.filter(inv => inv.client.gstin && inv.invoiceType !== 'EXPORT')
    const b2bData = b2bInvoices.map(inv => ({
      'GSTIN/UIN of Recipient': inv.client.gstin,
      'Receiver Name': inv.client.name,
      'Invoice Number': inv.invoiceNumber,
      'Invoice Date': format(new Date(inv.date), 'dd-MMM-yyyy'),
      'Invoice Value': inv.total * inv.exchangeRate,
      'Place of Supply': inv.client.stateCode ? `${inv.client.stateCode}-${inv.client.stateName}` : '',
      'Reverse Charge': 'N',
      'Applicable % of Tax Rate': '',
      'Invoice Type': 'Regular',
      'E-Commerce GSTIN': '',
      'Taxable Value': (inv.total - inv.taxTotal) * inv.exchangeRate,
      'Rate': 18,
      'Cess Amount': 0
    }))
    const wsB2B = XLSX.utils.json_to_sheet(b2bData)
    XLSX.utils.book_append_sheet(wb, wsB2B, 'b2b')

    // 2. B2CS Sheet (Consolidated B2C sales per state)
    const b2cInvoices = invoices.filter(inv => !inv.client.gstin && inv.invoiceType !== 'EXPORT')
    const b2cStateMap: Record<string, number> = {}
    b2cInvoices.forEach(inv => {
      const pos = inv.client.stateCode ? `${inv.client.stateCode}-${inv.client.stateName}` : 'Unknown'
      const taxable = (inv.total - inv.taxTotal) * inv.exchangeRate
      b2cStateMap[pos] = (b2cStateMap[pos] || 0) + taxable
    })
    const b2csData = Object.entries(b2cStateMap).map(([pos, taxable]) => ({
      'Type': 'OE',
      'Place Of Supply': pos,
      'Applicable % of Tax Rate': '',
      'Taxable Value': taxable,
      'Rate': 18,
      'Cess Amount': 0,
      'E-Commerce GSTIN': ''
    }))
    const wsB2CS = XLSX.utils.json_to_sheet(b2csData)
    XLSX.utils.book_append_sheet(wb, wsB2CS, 'b2cs')

    // 3. EXP Sheet (Exports)
    const expInvoices = invoices.filter(inv => inv.invoiceType === 'EXPORT')
    const expData = expInvoices.map(inv => ({
      'Export Type': 'WOPAY',
      'Invoice Number': inv.invoiceNumber,
      'Invoice Date': format(new Date(inv.date), 'dd-MMM-yyyy'),
      'Invoice Value': inv.total * inv.exchangeRate,
      'Port Code': '',
      'Shipping Bill No.': '',
      'Shipping Bill Date': '',
      'Applicable % of Tax Rate': '',
      'Taxable Value': inv.total * inv.exchangeRate,
      'Rate': 0
    }))
    const wsExp = XLSX.utils.json_to_sheet(expData)
    XLSX.utils.book_append_sheet(wb, wsExp, 'exp')

    // 4. CDNR Sheet (Credit/Debit Notes)
    // Blank scaffold for now as requested
    const cdnrData = [{
      'GSTIN/UIN of Recipient': '',
      'Receiver Name': '',
      'Note/Refund Number': '',
      'Note/Refund Date': '',
      'Note Type': '',
      'Place Of Supply': '',
      'Note Value': '',
      'Applicable % of Tax Rate': '',
      'Taxable Value': '',
      'Rate': '',
      'Cess Amount': ''
    }]
    const wsCdnr = XLSX.utils.json_to_sheet(cdnrData)
    XLSX.utils.book_append_sheet(wb, wsCdnr, 'cdnr')

    // Download file
    XLSX.writeFile(wb, `GST_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  return (
    <div className="bg-card-bg border border-card-border p-8 rounded-xl shadow-sm mb-8">
      <h3 className="font-semibold mb-4">Export Paid Invoices (GST Format)</h3>
      <p className="text-sm text-zinc-500 mb-6">Total Invoices to process: {invoices.length}</p>
      
      <button 
        onClick={handleDownload}
        className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium inline-block hover:opacity-90 transition-opacity"
      >
        Download GST Excel (.xlsx)
      </button>
    </div>
  )
}

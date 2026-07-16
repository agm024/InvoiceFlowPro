'use client'

import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export default function ExportClient({ invoices, settings, expenses = [] }: { invoices: any[], settings?: any, expenses?: any[] }) {
  
  const handleDownloadJSON = () => {
    const b2bInvoices = invoices.filter(inv => inv.client.gstin && inv.invoiceType !== 'EXPORT')
    const b2cInvoices = invoices.filter(inv => !inv.client.gstin && inv.invoiceType !== 'EXPORT')
    const expInvoices = invoices.filter(inv => inv.invoiceType === 'EXPORT')

    const homeStateCode = settings?.stateCode || '27' // Default to 27 (MH) if not set

    let totalDomesticTxval = 0
    let totalIamt = 0
    let totalCamt = 0
    let totalSamt = 0
    let totalExpTxval = 0

    // B2B processing
    const b2b = b2bInvoices.map(inv => {
      const isInterState = inv.client.stateCode !== homeStateCode
      const txval = (inv.total - inv.taxTotal) * inv.exchangeRate
      const taxAmt = inv.taxTotal * inv.exchangeRate
      
      let iamt = 0, camt = 0, samt = 0
      if (isInterState) { iamt = taxAmt } else { camt = taxAmt / 2; samt = taxAmt / 2 }
      
      totalDomesticTxval += txval
      totalIamt += iamt; totalCamt += camt; totalSamt += samt

      return {
        ctin: inv.client.gstin,
        inv_num: inv.invoiceNumber,
        inv_dt: format(new Date(inv.date), 'dd-MM-yyyy'),
        val: inv.total * inv.exchangeRate,
        pos: inv.client.stateCode || '',
        rchrg: 'N',
        inv_typ: 'R',
        rt: 18,
        txval,
        iamt,
        camt,
        samt
      }
    })

    // B2CS processing
    const b2cStateMap: Record<string, { txval: number, iamt: number, camt: number, samt: number }> = {}
    b2cInvoices.forEach(inv => {
      const pos = inv.client.stateCode || homeStateCode // Fallback to home state if unknown
      const isInterState = pos !== homeStateCode
      const txval = (inv.total - inv.taxTotal) * inv.exchangeRate
      const taxAmt = inv.taxTotal * inv.exchangeRate
      
      let iamt = 0, camt = 0, samt = 0
      if (isInterState) { iamt = taxAmt } else { camt = taxAmt / 2; samt = taxAmt / 2 }

      totalDomesticTxval += txval
      totalIamt += iamt; totalCamt += camt; totalSamt += samt

      if (!b2cStateMap[pos]) b2cStateMap[pos] = { txval: 0, iamt: 0, camt: 0, samt: 0 }
      b2cStateMap[pos].txval += txval
      b2cStateMap[pos].iamt += iamt
      b2cStateMap[pos].camt += camt
      b2cStateMap[pos].samt += samt
    })
    
    const b2cs = Object.entries(b2cStateMap).map(([pos, data]) => ({
      type: 'OE',
      pos,
      rt: 18,
      txval: data.txval,
      iamt: data.iamt,
      camt: data.camt,
      samt: data.samt
    }))

    // EXP processing
    const exp = expInvoices.map(inv => {
      const txval = inv.total * inv.exchangeRate
      totalExpTxval += txval
      return {
        exp_typ: 'WOPAY',
        inv_num: inv.invoiceNumber,
        inv_dt: format(new Date(inv.date), 'dd-MM-yyyy'),
        val: txval,
        rt: 0,
        txval
      }
    })

    // HSN Summary (hsn_sc)
    const hsnMap: Record<string, { txval: number, iamt: number, camt: number, samt: number }> = {}
    invoices.forEach(inv => {
      const isInterState = (inv.client.stateCode || homeStateCode) !== homeStateCode
      inv.items?.forEach((item: any) => {
        const hsn = item.product?.hsn || '998314'
        const txval = item.price * item.quantity * inv.exchangeRate
        const tax = item.tax * inv.exchangeRate
        let iamt = 0, camt = 0, samt = 0
        if (isInterState) { iamt = tax } else { camt = tax / 2; samt = tax / 2 }

        if (!hsnMap[hsn]) hsnMap[hsn] = { txval: 0, iamt: 0, camt: 0, samt: 0 }
        hsnMap[hsn].txval += txval
        hsnMap[hsn].iamt += iamt
        hsnMap[hsn].camt += camt
        hsnMap[hsn].samt += samt
      })
    })

    const hsn_sc = {
      det: Object.entries(hsnMap).map(([hsn, data]) => ({
        hsn_sc: hsn,
        desc: 'Services',
        uqc: 'OTH',
        qty: 0,
        txval: data.txval,
        rt: 18,
        iamt: data.iamt,
        camt: data.camt,
        samt: data.samt
      }))
    }

    // Document Sequencing (doc_issue)
    const sortedInvoices = [...invoices].sort((a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber))
    const doc_issue = {
      doc_det: [{
        doc_num: 1,
        docs: [{
          num: 1,
          from: sortedInvoices.length > 0 ? sortedInvoices[0].invoiceNumber : '',
          to: sortedInvoices.length > 0 ? sortedInvoices[sortedInvoices.length - 1].invoiceNumber : '',
          totnum: sortedInvoices.length,
          cancel: 0,
          net_issue: sortedInvoices.length
        }]
      }]
    }

    // Expenses / ITC / RCM
    let itcIamt = 0, itcCamt = 0, itcSamt = 0
    let tracked_expenses = 0
    expenses.forEach((e: any) => {
      tracked_expenses += e.totalAmount
      if (e.itcEligible) {
        // Assume Inter-state (iamt) for SaaS unless it's local vendor. Simple approximation.
        // If it's RCM, it's typically import (IGST).
        if (e.isRcm) {
          itcIamt += e.taxAmount
        } else {
          // Put in IGST for simplicity if we don't have vendor state code
          itcIamt += e.taxAmount
        }
      }
    })

    // Gross Receipts (Taxable Value Only)
    const gross_receipts = totalDomesticTxval + totalExpTxval
    const min_profit = gross_receipts * 0.5

    const jsonData = {
      gstr1_offline_tool_tables: {
        b2b,
        exp,
        b2cs,
        hsn: hsn_sc,
        doc_issue
      },
      gstr3b_government_portal_boxes: {
        box_3_1_a_outward_taxable: { txval: totalDomesticTxval, iamt: totalIamt, camt: totalCamt, samt: totalSamt },
        box_3_1_b_exports: { txval: totalExpTxval },
        box_3_1_d_inward_liable_to_rcm: { txval: expenses.filter(e => e.isRcm).reduce((sum, e) => sum + e.totalAmount, 0), iamt: expenses.filter(e => e.isRcm).reduce((sum, e) => sum + e.taxAmount, 0) },
        box_4_a_5_eligible_itc: { iamt: itcIamt, camt: itcCamt, samt: itcSamt }
      },
      itr_44ada_summary: {
        gross_receipts,
        minimum_presumptive_profit_50_percent: min_profit,
        actual_tracked_expenses: tracked_expenses,
        ca_notes: "Eligible for Section 44ADA. Presumptive taxation is highly optimized for this profile."
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href",     dataStr)
    downloadAnchorNode.setAttribute("download", `CA_Export_${format(new Date(), 'yyyy-MM-dd')}.json`)
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }
  
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
      
      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium inline-block hover:opacity-90 transition-opacity"
        >
          Download GST Excel (.xlsx)
        </button>
        <button 
          onClick={handleDownloadJSON}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium inline-block hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/20"
        >
          Download CA Package (.json)
        </button>
      </div>
    </div>
  )
}

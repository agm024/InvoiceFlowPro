import prisma from '@/utils/prisma'
import { requireCompany } from '@/lib/auth-context'
import Link from 'next/link'
import { format } from 'date-fns'
import { CheckCircle2, AlertTriangle, Download, ArrowLeft, Calendar, FileSpreadsheet, History } from 'lucide-react'
import GstExportButton from './GstExportButton'

export const dynamic = 'force-dynamic'

export default async function GstValidationPage() {
  const { companyId } = await requireCompany()

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { settings: true }
  })

  const invoices = await prisma.invoice.findMany({
    where: { companyId, invoiceType: 'REGULAR', status: 'paid' },
    include: { client: true }
  })

  const exportsHistory = await prisma.gstExportHistory.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  })

  // GSTIN Validation Regex
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

  // Validate clients
  const clientValidation = invoices.reduce((acc: any[], inv) => {
    const client = inv.client
    const exists = acc.find(c => c.id === client.id)
    if (!exists) {
      const gstin = client.gstin || ''
      const isValid = gstinRegex.test(gstin.toUpperCase())
      acc.push({
        id: client.id,
        name: client.name,
        gstin: client.gstin,
        isValid,
        issue: !client.gstin 
          ? 'Missing GSTIN' 
          : !isValid 
            ? 'Invalid GSTIN format' 
            : null
      })
    }
    return acc;
  }, [])

  const companyGstin = company?.settings?.gstin || ''
  const companyGstinValid = gstinRegex.test(companyGstin.toUpperCase())

  // Compile GSTR-1 Summary Data (B2B invoices)
  const gstr1Invoices = invoices.map(inv => {
    const cgst = inv.taxTotal / 2
    const sgst = inv.taxTotal / 2
    const igst = 0 // Simulating intra-state by default, or compute based on state code matching if desired
    return {
      invoiceNumber: inv.invoiceNumber,
      date: inv.date,
      clientName: inv.client.name,
      clientGstin: inv.client.gstin || 'N/A',
      taxableValue: inv.subTotal,
      rate: 18, // Assume standard 18% for matching
      cgst,
      sgst,
      igst,
      totalTax: inv.taxTotal,
      invoiceValue: inv.total
    }
  })

  const totalTaxable = gstr1Invoices.reduce((sum, i) => sum + i.taxableValue, 0)
  const totalTax = gstr1Invoices.reduce((sum, i) => sum + i.totalTax, 0)
  const totalInvoiceVal = gstr1Invoices.reduce((sum, i) => sum + i.invoiceValue, 0)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full text-zinc-950 dark:text-zinc-50 space-y-8 animate-in fade-in duration-500">
      
      <div>
        <Link href="/app/reports" className="text-xs font-semibold text-zinc-500 hover:text-foreground mb-4 inline-flex items-center gap-1">
          <ArrowLeft size={12} /> Back to Reports
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">GST Validation & Exporter</h1>
        <p className="text-sm text-zinc-500 mt-1">Audit GSTIN compliance and compile GSTR-1 & GSTR-3B filings.</p>
      </div>

      {/* Audit compliance results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Company Settings Audit */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Company GST Compliance</h3>
          
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-xl ${companyGstinValid ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-red-50 dark:bg-red-950/20 text-red-500'}`}>
              {companyGstinValid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div>
              <p className="font-bold text-sm">Company GSTIN Status</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {companyGstin ? `GSTIN: ${companyGstin.toUpperCase()}` : 'No GSTIN registered in Settings'}
              </p>
              {!companyGstinValid && (
                <p className="text-xs text-red-500 mt-1.5 font-semibold">
                  ⚠️ Please update your GSTIN format in Settings to pass GST compilation requirements.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Customer Compliance Audit */}
        <div className="bg-white dark:bg-zinc-955 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 max-h-80 overflow-y-auto">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Customer Compliance Audit</h3>
          <div className="space-y-3">
            {clientValidation.map(c => (
              <div key={c.id} className="flex justify-between items-center text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
                <div>
                  <span className="font-bold">{c.name}</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{c.gstin || 'No GSTIN Provided'}</p>
                </div>
                <div>
                  {c.isValid ? (
                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">Valid</span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">{c.issue}</span>
                  )}
                </div>
              </div>
            ))}
            {clientValidation.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-6">No client transaction data.</p>
            )}
          </div>
        </div>

      </div>

      {/* Compiled GST Filings Summaries */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">GSTR-1 Summary (Paid Invoices)</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Ready for filing compilation export.</p>
          </div>
          <GstExportButton 
            exportType="GSTR-1"
            invoices={gstr1Invoices}
            validCount={clientValidation.filter(c => c.isValid).length}
            errorCount={clientValidation.filter(c => !c.isValid).length}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Client GSTIN</th>
                <th className="px-6 py-4 text-right">Taxable Value</th>
                <th className="px-6 py-4 text-right">CGST (9%)</th>
                <th className="px-6 py-4 text-right">SGST (9%)</th>
                <th className="px-6 py-4 text-right">Total Tax</th>
                <th className="px-6 py-4 text-right">Invoice Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {gstr1Invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                  <td className="px-6 py-4 font-bold">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-zinc-500 uppercase">{inv.clientGstin}</td>
                  <td className="px-6 py-4 text-right">₹{inv.taxableValue.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">₹{inv.cgst.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">₹{inv.sgst.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-emerald-600">₹{inv.totalTax.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-bold">₹{inv.invoiceValue.toFixed(2)}</td>
                </tr>
              ))}
              {gstr1Invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">No matching paid invoice data.</td>
                </tr>
              ) : (
                <tr className="bg-zinc-50 dark:bg-zinc-900/40 font-bold border-t border-zinc-300 dark:border-zinc-700">
                  <td colSpan={2} className="px-6 py-4">Total Compiled</td>
                  <td className="px-6 py-4 text-right">₹{totalTaxable.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">₹{(totalTax / 2).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">₹{(totalTax / 2).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-emerald-600">₹{totalTax.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">₹{totalInvoiceVal.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GSTR-3B Summary Card */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">GSTR-3B Summary Filing</h3>
          <p className="text-xs text-zinc-500 mt-1">Aggregated net tax summary report for monthly returns.</p>
        </div>
        <GstExportButton 
          exportType="GSTR-3B"
          invoices={[{ taxableAmount: totalTaxable, taxAmount: totalTax }]}
          validCount={companyGstinValid ? 1 : 0}
          errorCount={companyGstinValid ? 0 : 1}
        />
      </div>

      {/* Export log history */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <History size={16} /> Export Audit Log
        </h3>
        
        <div className="space-y-3 text-xs">
          {exportsHistory.map(h => {
            const meta = h.metadata ? JSON.parse(h.metadata) : {};
            return (
              <div key={h.id} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-900 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold">{h.type}</span>
                  <span className="text-zinc-500">Period: {h.period} • Format: {meta.format || 'CSV'}</span>
                </div>
                <div className="text-right flex items-center gap-4">
                  <span className="text-[10px] text-zinc-400">
                    Audit: {h.validCount} valid, {h.errorCount} warning/error
                  </span>
                  <span className="text-emerald-600 font-semibold">SUCCESS</span>
                  <span className="text-zinc-400">{format(new Date(h.createdAt), 'MMM dd, hh:mm a')}</span>
                </div>
              </div>
            )
          })}
          {exportsHistory.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-4">No export logs recorded.</p>
          )}
        </div>
      </div>

    </div>
  )
}

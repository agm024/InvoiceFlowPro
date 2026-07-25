import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import PrintButton from './PrintButton'

export const metadata = {
  title: 'Statement of Account',
}

export default async function StatementPage({ params }: { params: Promise<{ clientId: string }> }) {
  const resolvedParams = await params
  
  const client = await prisma.client.findUnique({
    where: { id: resolvedParams.clientId },
    include: {
      invoices: {
        orderBy: { date: 'asc' }
      }
    }
  })

  if (!client) notFound()

  const companySettings = await prisma.companySettings.findFirst()

  // Calculate ledger
  let runningBalance = 0
  const ledgerEntries: any[] = []

  client.invoices.forEach(inv => {
    // Invoice Entry
    if (inv.status !== 'cancelled' && inv.status !== 'draft') {
      runningBalance += inv.total
      ledgerEntries.push({
        date: inv.date,
        type: 'INVOICE',
        ref: inv.invoiceNumber,
        debit: inv.total,
        credit: 0,
        balance: runningBalance,
        currency: inv.currency
      })
    }

    // Payment Entry (if any paid)
    if (inv.amountPaid > 0) {
      runningBalance -= inv.amountPaid
      ledgerEntries.push({
        date: inv.updatedAt > inv.date ? inv.updatedAt : inv.date, // Approximate payment date
        type: 'PAYMENT',
        ref: `Payment for ${inv.invoiceNumber}`,
        debit: 0,
        credit: inv.amountPaid,
        balance: runningBalance,
        currency: inv.currency
      })
    }
  })

  // Sort by date
  ledgerEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Recalculate exact running balance after sort
  let finalBalance = 0
  ledgerEntries.forEach(entry => {
    finalBalance += entry.debit
    finalBalance -= entry.credit
    entry.balance = finalBalance
  })

  const currency = client.invoices[0]?.currency || 'INR'

  return (
    <div className="bg-white min-h-screen p-8 text-black font-sans print:p-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">STATEMENT OF ACCOUNT</h1>
            <p className="text-zinc-600">Generated on {format(new Date(), 'MMM dd, yyyy')}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">{companySettings?.companyName || 'Your Company'}</h2>
            {companySettings?.email && <p className="text-sm text-zinc-600 mt-1">{companySettings.email}</p>}
            {companySettings?.phone && <p className="text-sm text-zinc-600">{companySettings.phone}</p>}
            {companySettings?.gstin && <p className="text-sm text-zinc-600">GSTIN: {companySettings.gstin}</p>}
          </div>
        </div>

        <div className="flex justify-between mb-12">
          <div>
            <p className="text-sm font-bold text-zinc-500 mb-1">TO:</p>
            <h3 className="text-lg font-bold">{client.name}</h3>
            {client.address && <p className="text-sm mt-1 whitespace-pre-wrap max-w-xs">{client.address}</p>}
            {client.gstin && <p className="text-sm mt-1">GSTIN: {client.gstin}</p>}
            {client.email && <p className="text-sm mt-1">{client.email}</p>}
          </div>
          <div className="bg-zinc-50 p-6 rounded-lg text-right min-w-[250px]">
            <p className="text-sm font-bold text-zinc-500 mb-1">TOTAL OUTSTANDING</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {currency} {finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        <table className="w-full text-left text-sm mb-12 border-collapse">
          <thead>
            <tr className="border-b-2 border-zinc-900">
              <th className="py-3 px-2 font-bold text-zinc-600">Date</th>
              <th className="py-3 px-2 font-bold text-zinc-600">Details</th>
              <th className="py-3 px-2 font-bold text-zinc-600 text-right">Debit (Inv)</th>
              <th className="py-3 px-2 font-bold text-zinc-600 text-right">Credit (Pay)</th>
              <th className="py-3 px-2 font-bold text-zinc-600 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {ledgerEntries.map((entry, idx) => (
              <tr key={idx} className="group hover:bg-zinc-50">
                <td className="py-3 px-2 text-zinc-600">{format(new Date(entry.date), 'dd/MM/yyyy')}</td>
                <td className="py-3 px-2 font-medium">
                  {entry.type === 'INVOICE' ? `Invoice #${entry.ref}` : entry.ref}
                </td>
                <td className="py-3 px-2 text-right text-zinc-600">
                  {entry.debit > 0 ? entry.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                </td>
                <td className="py-3 px-2 text-right text-green-600">
                  {entry.credit > 0 ? entry.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                </td>
                <td className="py-3 px-2 text-right font-bold">
                  {entry.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {ledgerEntries.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No transactions found for this client.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Print Button (hidden when printing) */}
        <div className="flex justify-center print:hidden mt-12 pb-12">
          <PrintButton />
        </div>
      </div>
    </div>
  )
}

import prisma from '@/utils/prisma'
import { TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react'
import ExportCSVButton from './ExportCSVButton'

export const metadata = {
  title: 'Reports | InvoiceFlowPro',
}

export default async function ReportsPage() {
  const invoices = await prisma.invoice.findMany({
    where: { invoiceType: 'REGULAR', status: 'paid' }
  })
  
  const expenses = await prisma.expense.findMany()

  const totalRevenue = invoices.reduce((acc, inv) => acc + ((inv.total - inv.taxTotal) * (inv.exchangeRate || 1.0)), 0)
  const totalTaxCollected = invoices.reduce((acc, inv) => acc + (inv.taxTotal * (inv.exchangeRate || 1.0)), 0)

  const operatingExpenses = expenses.filter(exp => exp.category !== 'GST_PAYMENT')
  const totalExpenses = operatingExpenses.reduce((acc, exp) => acc + exp.totalAmount, 0)
  const totalTaxPaid = operatingExpenses.reduce((acc, exp) => acc + (exp.taxAmount || 0), 0)

  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  const netTaxLiability = Math.max(0, totalTaxCollected - totalTaxPaid)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Financial Reports</h1>
          <p className="text-zinc-500 text-sm mt-1">Profit & Loss and Tax Summary</p>
        </div>
        <ExportCSVButton 
          data={{
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin,
            totalTaxCollected,
            totalTaxPaid,
            netTaxLiability
          }} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-sm text-zinc-500 mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center mb-4">
            <TrendingDown size={20} />
          </div>
          <p className="text-sm text-zinc-500 mb-1">Total Expenses</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg flex items-center justify-center mb-4">
            <DollarSign size={20} />
          </div>
          <p className="text-sm text-zinc-500 mb-1">Net Profit</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">₹{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
            <FileText size={20} />
          </div>
          <p className="text-sm text-zinc-500 mb-1">Profit Margin</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{profitMargin.toFixed(1)}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Tax Summary (GST)</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">Tax Collected on Sales</p>
                <p className="text-sm text-zinc-500">From all paid invoices</p>
              </div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">₹{totalTaxCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">Input Tax Credit (ITC)</p>
                <p className="text-sm text-zinc-500">From eligible expenses</p>
              </div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">₹{totalTaxPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">Net Tax Liability</p>
              </div>
              <p className="text-xl font-black text-zinc-900 dark:text-white">
                ₹{Math.max(0, totalTaxCollected - totalTaxPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

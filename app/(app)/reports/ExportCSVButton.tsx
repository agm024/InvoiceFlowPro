'use client'

import { Download } from 'lucide-react'

type ReportData = {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  totalTaxCollected: number
  totalTaxPaid: number
  netTaxLiability: number
}

export default function ExportCSVButton({ data }: { data: ReportData }) {
  const handleExport = () => {
    const headers = ['Metric', 'Amount/Value']
    
    const rows = [
      ['Total Revenue', data.totalRevenue.toFixed(2)],
      ['Total Expenses', data.totalExpenses.toFixed(2)],
      ['Net Profit', data.netProfit.toFixed(2)],
      ['Profit Margin (%)', data.profitMargin.toFixed(2)],
      ['Tax Collected on Sales', data.totalTaxCollected.toFixed(2)],
      ['Input Tax Credit (ITC)', data.totalTaxPaid.toFixed(2)],
      ['Net Tax Liability', data.netTaxLiability.toFixed(2)]
    ]

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <Download size={16} />
      Export to CSV
    </button>
  )
}

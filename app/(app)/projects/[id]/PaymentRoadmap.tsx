'use client'

import Link from 'next/link'
import { Banknote, FileText, CheckCircle2, Circle } from 'lucide-react'

export default function PaymentRoadmap({ project }: { project: any }) {
  if (!project.milestones || project.milestones.length === 0) return null

  const currency = project.currency || 'INR'

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
          <Banknote size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">Payment Roadmap</h2>
          <p className="text-sm font-medium text-zinc-500">Track and invoice project milestones</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {project.milestones.map((milestone: any, index: number) => {
          const isBilled = milestone.status === 'BILLED' || milestone.invoiceId
          const isPaid = milestone.status === 'PAID'
          const isUnbilled = !isBilled && !isPaid

          return (
            <div key={milestone.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20">
              <div className="flex items-start sm:items-center gap-4">
                <div className="mt-1 sm:mt-0 shrink-0">
                  {isPaid ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  ) : isBilled ? (
                    <FileText size={24} className="text-blue-500" />
                  ) : (
                    <Circle size={24} className="text-zinc-300 dark:text-zinc-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base">{milestone.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-black text-zinc-700 dark:text-zinc-300">
                      {currency} {milestone.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {milestone.percentage && (
                      <span className="text-xs font-bold text-zinc-500 bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-md">
                        {milestone.percentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {isPaid ? (
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    Paid
                  </span>
                ) : isBilled ? (
                  <Link href={`/invoices/${milestone.invoiceId}`} className="text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-2">
                    <FileText size={16} /> View Invoice
                  </Link>
                ) : (
                  <Link href={`/invoices/new?milestoneId=${milestone.id}`} className="text-sm font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-2">
                    <Banknote size={16} /> Generate Invoice
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

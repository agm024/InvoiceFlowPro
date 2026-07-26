import { getEstimates } from './actions'
import Link from 'next/link'
import { Plus, Search, FileSpreadsheet, Download, CheckCircle, Clock, Copy, XCircle, FileText } from 'lucide-react'
import { format } from 'date-fns'

import DeleteEstimateButton from './DeleteEstimateButton'

export const metadata = {
  title: 'Estimates | InvoiceFlowPro',
}

export default async function EstimatesPage() {
  const estimates = await getEstimates()

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Estimates</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your quotations and estimates.</p>
        </div>
        <Link 
          href="/estimates/new" 
          className="bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5"
        >
          <Plus size={16} /> New Estimate
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {estimates.length > 0 ? (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 font-medium">Estimate #</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/estimates/${estimate.id}`} className="font-medium text-zinc-900 dark:text-white hover:underline">
                      {estimate.estimateNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {format(new Date(estimate.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{estimate.client.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      estimate.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                      estimate.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                      estimate.status === 'invoiced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400'
                    }`}>
                      {estimate.status === 'accepted' ? <CheckCircle size={12} /> :
                       estimate.status === 'rejected' ? <XCircle size={12} /> :
                       estimate.status === 'invoiced' ? <Copy size={12} /> :
                       <FileText size={12} />
                      }
                      {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-100">
                    {estimate.currency} {estimate.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <Link href={`/estimates/${estimate.id}`} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1" title="View">
                        <FileText size={18} />
                      </Link>
                      <DeleteEstimateButton id={estimate.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-zinc-500">
            <FileSpreadsheet size={48} className="mx-auto mb-4 text-zinc-400" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No estimates yet</h3>
            <p className="mb-6">Create your first estimate to send to a client.</p>
            <Link 
              href="/estimates/new"
              className="bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} /> New Estimate
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

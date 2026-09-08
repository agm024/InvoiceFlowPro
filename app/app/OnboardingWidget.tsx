'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function OnboardingWidget({ hasBusinessInfo, hasGst, hasClient, hasInvoice }: { hasBusinessInfo: boolean, hasGst: boolean, hasClient: boolean, hasInvoice: boolean }) {
  const [expanded, setExpanded] = useState(!hasInvoice)
  
  const stepsCompleted = 1 + (hasBusinessInfo ? 1 : 0) + (hasGst ? 1 : 0) + (hasClient ? 1 : 0) + (hasInvoice ? 1 : 0);
  const totalSteps = 5;

  if (stepsCompleted === totalSteps) return null; // Fully completed

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm mb-8 overflow-hidden transition-all">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
            🚀
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Get your account ready</h3>
            <p className="text-xs text-zinc-500">Complete these steps to start invoicing</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <div className="w-32 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${(stepsCompleted/totalSteps)*100}%` }}></div>
            </div>
            <span className="text-blue-600 dark:text-blue-400">{stepsCompleted}/{totalSteps} completed</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
          <ul className="space-y-4 max-w-2xl mx-auto">
            <li className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-medium">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</div>
              Create account
            </li>
            <li className={`flex items-center gap-3 ${hasBusinessInfo ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${hasBusinessInfo ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}`}>{hasBusinessInfo ? '✓' : ''}</div>
              {hasBusinessInfo ? <span>Add business information</span> : <Link href="/app/settings" className="hover:underline">Add business information</Link>}
            </li>
            <li className={`flex items-center gap-3 ${hasGst ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${hasGst ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}`}>{hasGst ? '✓' : ''}</div>
              {hasGst ? <span>Configure GST/Tax settings</span> : <Link href="/app/settings" className="hover:underline">Configure GST/Tax settings</Link>}
            </li>
            <li className={`flex items-center gap-3 ${hasClient ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${hasClient ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}`}>{hasClient ? '✓' : ''}</div>
              {hasClient ? <span>Add your first client</span> : <Link href="/app/clients/new" className="hover:underline">Add your first client</Link>}
            </li>
            <li className={`flex items-center gap-3 ${hasInvoice ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${hasInvoice ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}`}>{hasInvoice ? '✓' : ''}</div>
              {hasInvoice ? <span>Create your first invoice</span> : <Link href="/app/invoices/new" className="hover:underline text-blue-600 dark:text-blue-400 font-semibold">Create your first invoice ➔</Link>}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

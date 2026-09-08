const fs = require('fs');

const newBadge = `import { CheckCircle2, Send, Clock, AlertCircle, FileEdit, CircleDashed } from 'lucide-react'

export default function StatusBadge({ status, className = '' }: { status: string, className?: string }) {
  const normalizedStatus = status.toLowerCase()
  
  const getBadgeContent = () => {
    switch(normalizedStatus) {
      case 'paid':
        return { color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900', icon: CheckCircle2, text: 'Paid' }
      case 'partially_paid':
        return { color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-900', icon: CircleDashed, text: 'Partially Paid' }
      case 'sent':
        return { color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900', icon: Send, text: 'Sent' }
      case 'overdue':
        return { color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900', icon: AlertCircle, text: 'Overdue' }
      case 'pending':
        return { color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900', icon: Clock, text: 'Pending' }
      default: // draft
        return { color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700', icon: FileEdit, text: 'Draft' }
    }
  }

  const { color, icon: Icon, text } = getBadgeContent()

  return (
    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border \${color} \${className}\`}>
      <Icon size={14} />
      {text}
    </span>
  )
}
`

fs.writeFileSync('app/app/invoices/[id]/StatusBadge.tsx', newBadge, 'utf8');


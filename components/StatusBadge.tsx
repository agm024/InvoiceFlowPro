export default function StatusBadge({ status }: { status: string }) {
  const getBadgeStyle = () => {
    switch(status.toLowerCase()) {
      case 'paid':
        return { color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', dot: '🟢' }
      case 'sent':
        return { color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20', dot: '🔵' }
      case 'overdue':
        return { color: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20', dot: '🔴' }
      case 'pending':
      case 'draft':
      case 'unbilled':
        return { color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20', dot: '🟠' }
      case 'cancelled':
        return { color: 'text-zinc-700 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700', dot: '⚫' }
      default:
        return { color: 'text-zinc-700 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700', dot: '⚪' }
    }
  }

  const { color, dot } = getBadgeStyle()

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase border ${color}`}>
      <span className="text-[10px]">{dot}</span>
      {status}
    </span>
  )
}

export default function StatusBadge({ status }: { status: string }) {
  const getBadgeStyle = () => {
    switch(status.toLowerCase()) {
      case 'paid':
        return 'text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400'
      case 'sent':
      case 'pending':
        return 'text-blue-700 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400'
      case 'overdue':
        return 'text-red-700 bg-red-100 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30'
      case 'draft':
      case 'unbilled':
        return 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'
      case 'cancelled':
        return 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800 line-through dark:text-zinc-500'
      default:
        return 'text-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getBadgeStyle()}`}>
      {status}
    </span>
  )
}

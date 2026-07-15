export default function StatusBadge({ status, invoiceId }: { status: string, invoiceId: string }) {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'paid':
        return 'bg-green-500/10 text-green-500'
      case 'sent':
        return 'bg-blue-500/10 text-blue-500'
      case 'overdue':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
    }
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor()}`}>
      {status}
    </span>
  )
}

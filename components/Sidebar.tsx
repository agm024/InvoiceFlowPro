import Link from 'next/link'

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Clients', href: '/clients' },
    { name: 'Products', href: '/products' },
    { name: 'Invoices', href: '/invoices' },
    { name: 'Export', href: '/export' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar-bg flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold tracking-tighter">InvoiceFlowPro</h1>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

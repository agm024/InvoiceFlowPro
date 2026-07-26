import Link from 'next/link'
import { LayoutDashboard, Users, FolderKanban, Box, FileText, Receipt, CreditCard, ArrowRightLeft, PieChart, Download, Settings } from 'lucide-react'

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Products', href: '/products', icon: Box },
    { name: 'Estimates', href: '/estimates', icon: FileText },
    { name: 'Invoices', href: '/invoices', icon: Receipt },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
    { name: 'Transfers', href: '/transfers', icon: ArrowRightLeft },
    { name: 'Reports', href: '/reports', icon: PieChart },
    { name: 'Export', href: '/export', icon: Download },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar-bg flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold tracking-tighter">InvoiceFlowPro</h1>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <Icon size={18} className="text-zinc-500 shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

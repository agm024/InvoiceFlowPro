'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FolderKanban, Box, FileText, Receipt, CreditCard, ArrowRightLeft, PieChart, Download, Settings, Plus, LogOut, MessageSquare } from 'lucide-react'
import { signOutAction } from '@/app/sign-out-action'

export default function Sidebar() {
  const pathname = usePathname()

  const navGroups = [
    {
      label: 'Insights',
      items: [
        { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
        { name: 'Reports', href: '/app/reports', icon: PieChart },
      ]
    },
    {
      label: 'Money',
      items: [
        { name: 'Invoices & Payments', href: '/app/invoices', icon: Receipt },
        { name: 'Estimates', href: '/app/estimates', icon: FileText },
        { name: 'Expenses', href: '/app/expenses', icon: CreditCard },
        { name: 'Transfers', href: '/app/transfers', icon: ArrowRightLeft },
      ]
    },
    {
      label: 'Work',
      items: [
        { name: 'Clients', href: '/app/clients', icon: Users },
        { name: 'Projects', href: '/app/projects', icon: FolderKanban },
        { name: 'Products', href: '/app/products', icon: Box },
      ]
    },
    {
      label: 'System',
      items: [
        { name: 'Billing & Plans', href: '/app/billing', icon: CreditCard },
        { name: 'Export Data', href: '/app/export', icon: Download },
        { name: 'Settings', href: '/app/settings', icon: Settings },
        { name: 'Help & Support', href: '/app/support', icon: MessageSquare },
      ]
    }
  ]

  return (
    <div className="w-64 border-r border-sidebar-border bg-sidebar-bg flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <Receipt className="w-4 h-4 text-primary-foreground" />
          </div>
          InvoiceFlow
        </h1>
      </div>
      
      <div className="p-4 shrink-0">
        <Link href="/app/invoices/new" className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-primary/20 hover:-translate-y-0.5">
          <Plus size={18} />
          <span>New Invoice</span>
        </Link>
      </div>

      <div className="px-4 pb-4 flex-1 overflow-y-auto space-y-6">
        {navGroups.map((group, i) => (
          <div key={i} className="space-y-1">
            <p className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/app' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground'
                  }`}
                >
                  <Icon size={18} className={`shrink-0 ${isActive ? 'text-accent-foreground' : 'text-zinc-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <form action={signOutAction}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
            <LogOut size={18} className="shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}

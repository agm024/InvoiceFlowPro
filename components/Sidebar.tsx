import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Sidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-500">
          <div className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-foreground font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="truncate">
            <p className="font-medium text-foreground truncate">{user?.email}</p>
            <form action="/auth/signout" method="post">
              <button className="text-xs text-zinc-500 hover:text-foreground">Sign out</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Building2, Users, CreditCard, LayoutDashboard, Settings, Activity, ReceiptText, ShieldAlert, History, LifeBuoy, Mails, ArrowLeftRight } from "lucide-react"

export function AdminSidebar() {
  const menuItems = [
    { title: "Dashboard", href: "/app/admin", icon: LayoutDashboard },
    {
      title: "Platform",
      items: [
        { title: "Businesses", href: "/app/admin/businesses", icon: Building2 },
        { title: "Global Users", href: "/app/admin/users", icon: Users },
      ],
    },
    {
      title: "Billing & Revenue",
      items: [
        { title: "Revenue", href: "/app/admin/billing/revenue", icon: Activity },
        { title: "Payments", href: "/app/admin/billing/payments", icon: ReceiptText },
        { title: "Subscriptions", href: "/app/admin/billing/subscriptions", icon: ArrowLeftRight },
        { title: "Plans", href: "/app/admin/billing/plans", icon: CreditCard },
      ],
    },
    {
      title: "System & Health",
      items: [
        { title: "Support Tickets", href: "/app/admin/support", icon: LifeBuoy },
        { title: "Email Templates", href: "/app/admin/system/emails", icon: Mails },
        { title: "System Health", href: "/app/admin/system/health", icon: ShieldAlert },
        { title: "Audit Logs", href: "/app/admin/audit", icon: History },
        { title: "Settings", href: "/app/admin/system/settings", icon: Settings },
      ],
    },
  ]

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-shrink-0 hidden md:flex flex-col h-screen overflow-y-auto">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="font-bold text-xl tracking-tight">Super Admin</h2>
        <p className="text-xs text-zinc-500">InvoiceFlowPro</p>
      </div>

      <nav className="p-4 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            {section.items ? (
              <>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
                      >
                        <item.icon size={18} />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link
                href={section.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
              >
                <section.icon size={18} />
                {section.title}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  Building2, Users, CreditCard, LayoutDashboard, Settings, Activity, 
  ReceiptText, ShieldAlert, History, LifeBuoy, Mails, ArrowLeftRight, 
  ChevronLeft, ChevronRight, Terminal, Globe, Key, HelpCircle, 
  PanelLeftClose, PanelLeftOpen, ShieldCheck, MailWarning, 
  Webhook, HelpCircle as HelpIcon, Lock, Users2
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load collapse state from localStorage on client side
  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed")
    if (saved === "true") {
      setIsCollapsed(true)
    }
  }, [])

  const toggleCollapse = () => {
    const nextState = !isCollapsed
    setIsCollapsed(nextState)
    localStorage.setItem("admin_sidebar_collapsed", String(nextState))
  }

  const menuSections = [
    {
      group: "Overview",
      items: [
        { title: "Dashboard", href: "/app/admin", icon: LayoutDashboard }
      ]
    },
    {
      group: "Tenants",
      items: [
        { title: "Businesses", href: "/app/admin/businesses", icon: Building2 },
        { title: "Global Users", href: "/app/admin/users", icon: Users2 }
      ]
    },
    {
      group: "Billing",
      items: [
        { title: "Revenue", href: "/app/admin/billing/revenue", icon: Activity },
        { title: "Payments", href: "/app/admin/billing/payments", icon: ReceiptText },
        { title: "Subscriptions", href: "/app/admin/billing/subscriptions", icon: ArrowLeftRight },
        { title: "Plans", href: "/app/admin/billing/plans", icon: CreditCard }
      ]
    },
    {
      group: "Support",
      items: [
        { title: "Support Tickets", href: "/app/admin/support", icon: LifeBuoy }
      ]
    },
    {
      group: "Communications",
      items: [
        { title: "Email Templates", href: "/app/admin/system/emails", icon: Mails }
      ]
    },
    {
      group: "System",
      items: [
        { title: "System Health", href: "/app/admin/system/health", icon: ShieldAlert },
        { title: "Webhooks", href: "/app/admin/system/webhooks", icon: Webhook },
        { title: "Background Jobs", href: "/app/admin/system/jobs", icon: Terminal }
      ]
    },
    {
      group: "Security",
      items: [
        { title: "Audit Logs", href: "/app/admin/audit", icon: History }
      ]
    },
    {
      group: "Settings",
      items: [
        { title: "Platform Settings", href: "/app/admin/system/settings", icon: Settings }
      ]
    }
  ]

  return (
    <aside 
      className={`h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex-shrink-0 z-30`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white">InvoiceFlowPro</span>
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Super Admin Panel</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center font-bold text-white dark:text-zinc-900 text-xs mx-auto">
            IF
          </div>
        )}
        {!isCollapsed && (
          <button 
            onClick={toggleCollapse}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-zinc-100 dark:border-zinc-900">
          <button 
            onClick={toggleCollapse}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <PanelLeftOpen size={16} />
          </button>
        </div>
      )}

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-1">
                {section.group}
              </h4>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item, i) => {
                const isActive = pathname === item.href
                return (
                  <li key={i}>
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.title : undefined}
                      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        isActive 
                          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white" 
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <item.icon size={18} className={isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

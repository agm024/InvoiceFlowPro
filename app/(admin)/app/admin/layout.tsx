import { requireSuperAdmin } from '@/lib/auth-context'
import Link from 'next/link'
import {
  Building2,
  Users,
  CreditCard,
  FileText,
  PieChart,
  LifeBuoy,
  Settings,
  Bell,
  LogOut
} from 'lucide-react'
import { signOutAction } from '@/app/sign-out-action'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure only super admins can access this entire route group
  await requireSuperAdmin()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 flex flex-col fixed inset-y-0 z-10">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-zinc-900 font-bold text-xl">A</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Super Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">

          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">ADMIN</div>
            <div className="space-y-1">
              <Link href="/app/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <PieChart size={18} />
                Dashboard
              </Link>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">Businesses</div>
            <div className="space-y-1">
              <Link href="/app/admin/businesses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Building2 size={18} />
                All Businesses
              </Link>
              <Link href="/app/admin/businesses/active" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Building2 size={18} />
                Active
              </Link>
              <Link href="/app/admin/businesses/trial" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Building2 size={18} />
                Trial
              </Link>
              <Link href="/app/admin/businesses/suspended" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Building2 size={18} />
                Suspended
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">Users</div>
            <div className="space-y-1">
              <Link href="/app/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Users size={18} />
                All Users
              </Link>
              <Link href="/app/admin/users/roles" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Users size={18} />
                Roles
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">Billing</div>
            <div className="space-y-1">
              <Link href="/app/admin/billing/plans" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <CreditCard size={18} />
                Plans
              </Link>
              <Link href="/app/admin/billing/subscriptions" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <CreditCard size={18} />
                Subscriptions
              </Link>
              <Link href="/app/admin/billing/payments" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <CreditCard size={18} />
                Payments
              </Link>
              <Link href="/app/admin/billing/coupons" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <CreditCard size={18} />
                Coupons
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">Invoicing</div>
            <div className="space-y-1">
              <Link href="/app/admin/invoices" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <FileText size={18} />
                All Invoices
              </Link>
              <Link href="/app/admin/invoices/estimates" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <FileText size={18} />
                Estimates
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">Analytics</div>
            <div className="space-y-1">
              <Link href="/app/admin/analytics/revenue" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <PieChart size={18} />
                Revenue
              </Link>
              <Link href="/app/admin/analytics/growth" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <PieChart size={18} />
                Growth
              </Link>
              <Link href="/app/admin/analytics/usage" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <PieChart size={18} />
                Usage
              </Link>
              <Link href="/app/admin/analytics/reports" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <FileText size={18} />
                Reports
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">Support</div>
            <div className="space-y-1">
              <Link href="/app/admin/support/tickets" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <FileText size={18} />
                Tickets
              </Link>
              <Link href="/app/admin/support/announcements" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <FileText size={18} />
                Announcements
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3 px-3">System</div>
            <div className="space-y-1">
              <Link href="/app/admin/audit" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <FileText size={18} />
                Audit Logs
              </Link>
              <Link href="/app/admin/system/integrations" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Settings size={18} />
                Integrations
              </Link>
              <Link href="/app/admin/system/api" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Settings size={18} />
                API
              </Link>
              <Link href="/app/admin/system/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300">
                <Settings size={18} />
                Settings
              </Link>
            </div>
          </div>

        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <form action={signOutAction}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-red-600 dark:text-red-400">
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

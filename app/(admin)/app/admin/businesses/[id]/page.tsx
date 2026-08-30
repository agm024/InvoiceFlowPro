import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Building2, Users, FileText, Activity } from 'lucide-react'
import { getCurrencySymbol } from '@/utils/currency'

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireSuperAdmin()
  const { id } = await params

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      users: true,
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      _count: {
        select: { users: true, invoices: true, clients: true }
      }
    }
  })

  if (!company) {
    notFound()
  }

  const cannotImpersonate = !company.supportAccessGranted || admin.isImpersonating

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <Link href="/app/admin/businesses" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 text-sm font-medium mb-4 transition">
            <ArrowLeft size={16} /> Back to Businesses
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-2xl font-bold shadow-sm">
              {company.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  company.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                }`}>
                  {company.status}
                </span>
                <span className="text-sm text-zinc-500">
                  Created {company.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <form action={async () => {
          'use server'
          const adminUser = await requireSuperAdmin()
          if (adminUser.isImpersonating) throw new Error('Cannot impersonate while already impersonating')
          const { impersonateCompany } = await import('@/app/(admin)/app/admin/impersonate-actions')
          await impersonateCompany(company.id)
        }}>
          <button 
            type="submit" 
            disabled={cannotImpersonate}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2 ${
              !cannotImpersonate 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90' 
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
            }`}
            title={admin.isImpersonating ? 'Already impersonating a tenant' : !company.supportAccessGranted ? 'Customer has not granted support access' : ''}
          >
            {!company.supportAccessGranted && <span className="text-xs">🔒</span>}
            View as Company
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col gap-2">
          <div className="text-zinc-500 flex items-center gap-2 text-sm font-medium"><Users size={16}/> Total Users</div>
          <div className="text-3xl font-bold">{company._count.users}</div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col gap-2">
          <div className="text-zinc-500 flex items-center gap-2 text-sm font-medium"><Building2 size={16}/> Total Clients</div>
          <div className="text-3xl font-bold">{company._count.clients}</div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col gap-2">
          <div className="text-zinc-500 flex items-center gap-2 text-sm font-medium"><FileText size={16}/> Invoices Sent</div>
          <div className="text-3xl font-bold">{company._count.invoices}</div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm flex flex-col gap-2">
          <div className="text-zinc-500 flex items-center gap-2 text-sm font-medium"><Activity size={16}/> Status</div>
          <div className="text-xl font-bold">{company.status === 'ACTIVE' ? 'Healthy' : 'Needs Attention'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="font-semibold">Company Users</h3>
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {company.users.map(user => (
              <li key={user.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.name || 'No Name'}</p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
                <span className="text-xs font-medium text-zinc-500 uppercase">{user.role}</span>
              </li>
            ))}
            {company.users.length === 0 && (
              <li className="p-4 text-zinc-500 text-sm">No users found.</li>
            )}
          </ul>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="font-semibold">Recent Invoices</h3>
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {company.invoices.map(invoice => (
              <li key={invoice.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-zinc-500">{invoice.date.toLocaleDateString()}</p>
                </div>
                <span className="font-medium">{getCurrencySymbol(invoice.currency)}{invoice.total.toFixed(2)}</span>
              </li>
            ))}
            {company.invoices.length === 0 && (
              <li className="p-4 text-zinc-500 text-sm">No invoices found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

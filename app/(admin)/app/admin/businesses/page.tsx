import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { MoreHorizontal, Plus, Shield } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function BusinessesPage() {
  await requireSuperAdmin()

  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: { users: true, invoices: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
          <p className="text-zinc-500 mt-2">Manage all tenant companies on your platform.</p>
        </div>
        <Link href="/app/admin/businesses/new" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition flex items-center gap-2">
          <Plus size={18} /> Add Company
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="whitespace-nowrap w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-900">
            <tr>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Users</th>
              <th className="px-6 py-4">Invoices</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {companies.map(company => (
              <tr key={company.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                    {company.name.substring(0, 2).toUpperCase()}
                  </div>
                  {company.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    company.status === 'ACTIVE' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{company._count.users}</td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{company._count.invoices}</td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {company.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/app/admin/businesses/${company.id}`} className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-md transition">
                      View
                    </Link>
                    <form action={async () => {
                      'use server'
                      await requireSuperAdmin()
                      await prisma.company.delete({ where: { id: company.id } })
                      revalidatePath('/app/admin/businesses')
                    }}>
                      <button type="submit" className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-md transition">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
        {companies.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            No businesses found.
          </div>
        )}
      </div>
    </div>
  )
}

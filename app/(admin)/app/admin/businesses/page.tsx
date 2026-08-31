import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { BusinessesTableClient } from './BusinessesTableClient'

export const dynamic = 'force-dynamic'

export default async function BusinessesPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const admin = await requireSuperAdmin()
  const resolvedSearchParams = await searchParams
  
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : ''
  const statusFilter = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : ''
  const planFilter = typeof resolvedSearchParams.planId === 'string' ? resolvedSearchParams.planId : ''
  
  const sortBy = typeof resolvedSearchParams.sortBy === 'string' ? resolvedSearchParams.sortBy : 'createdAt'
  const sortOrder = typeof resolvedSearchParams.sortOrder === 'string' && ['asc', 'desc'].includes(resolvedSearchParams.sortOrder) 
    ? resolvedSearchParams.sortOrder 
    : 'desc'

  const limit = 20
  const skip = (page - 1) * limit

  // Construct filters
  const where: any = {}
  
  if (search) {
    where.name = { contains: search, mode: 'insensitive' as const }
  }
  
  if (statusFilter) {
    where.status = statusFilter
  }
  
  if (planFilter) {
    where.subscription = { planId: planFilter }
  }

  // Fetch Companies, Total and available Plans for filter
  const [companies, total, plans] = await Promise.all([
    prisma.company.findMany({
      where,
      include: {
        subscription: { include: { plan: true } },
        _count: {
          select: { users: true, invoices: true, clients: true }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip
    }),
    prisma.company.count({ where }),
    prisma.plan.findMany({ select: { id: true, name: true } })
  ])

  const totalPages = Math.ceil(total / limit)

  // Map to fit BusinessRow interface in BusinessesTableClient
  const formattedCompanies = companies.map(c => ({
    id: c.id,
    name: c.name,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    subscription: c.subscription ? {
      plan: c.subscription.plan ? { name: c.subscription.plan.name } : undefined,
      status: c.subscription.status
    } : null,
    _count: {
      users: c._count.users,
      invoices: c._count.invoices,
      clients: c._count.clients
    }
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Businesses</h1>
          <p className="text-xs text-zinc-500 mt-1">Directory of all tenant companies registered on InvoiceFlowPro.</p>
        </div>
        <Link 
          href="/app/admin/businesses/new" 
          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={14} /> Register Business
        </Link>
      </div>

      <BusinessesTableClient 
        companies={formattedCompanies}
        plans={plans}
        total={total}
        page={page}
        totalPages={totalPages}
        search={search}
        statusFilter={statusFilter}
        planFilter={planFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  )
}

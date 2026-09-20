import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { AuditTableClient } from "./AuditTableClient"

export const dynamic = 'force-dynamic'

export default async function AuditLogsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await requireSuperAdmin()
  const resolvedParams = await searchParams

  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const pageSize = 50
  
  // Basic filters
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : ''
  const actionFilter = typeof resolvedParams.action === 'string' ? resolvedParams.action : ''
  const adminFilter = typeof resolvedParams.admin === 'string' ? resolvedParams.admin : ''
  const companyFilter = typeof resolvedParams.company === 'string' ? resolvedParams.company : ''
  
  const where: any = {}
  
  if (search) {
    where.OR = [
      { action: { contains: search, mode: 'insensitive' } },
      { adminId: { contains: search, mode: 'insensitive' } },
      { companyId: { contains: search, mode: 'insensitive' } },
      { targetId: { contains: search, mode: 'insensitive' } },
      { ipAddress: { contains: search, mode: 'insensitive' } },
      { requestId: { contains: search, mode: 'insensitive' } },
      { reason: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (actionFilter) where.action = actionFilter
  if (adminFilter) where.adminId = adminFilter
  if (companyFilter) where.companyId = companyFilter

  const [totalLogs, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  ])

  const totalPages = Math.ceil(totalLogs / pageSize)

  // Map Admin IDs to Names
  const adminIds = [...new Set(logs.map(l => l.adminId).filter(Boolean))]
  const admins = await prisma.user.findMany({
    where: { id: { in: adminIds } },
    select: { id: true, name: true, role: true }
  })
  const adminMap = admins.reduce((acc: any, a) => ({ ...acc, [a.id]: { name: a.name, role: a.role } }), {})

  // Map Company IDs to Names
  const companyIds = [...new Set(logs.map(l => l.companyId).filter(Boolean))]
  const companies = await prisma.company.findMany({
    where: { id: { in: companyIds as string[] } },
    select: { id: true, name: true }
  })
  const companyMap = companies.reduce((acc: any, c) => ({ ...acc, [c.id]: c.name }), {})

  const enrichedLogs = logs.map(log => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
    adminName: adminMap[log.adminId]?.name || null,
    adminRole: adminMap[log.adminId]?.role || 'Super Admin',
    businessName: log.companyId ? (companyMap[log.companyId] || null) : null
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Audit Logs</h1>
        <p className="text-sm text-zinc-500">A complete, immutable record of administrative and sensitive platform activity.</p>
      </div>
      
      <AuditTableClient 
        logs={enrichedLogs} 
        currentPage={page} 
        totalPages={totalPages}
        totalLogs={totalLogs}
        filters={{ search, action: actionFilter, admin: adminFilter, company: companyFilter }}
      />
    </div>
  )
}

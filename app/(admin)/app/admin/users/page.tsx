import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { UsersTableClient } from './UsersTableClient'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  await requireSuperAdmin()

  const users = await prisma.user.findMany({
    include: {
      company: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Format to client-ready rows
  const formattedUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isSuperAdmin: u.isSuperAdmin,
    createdAt: u.createdAt.toISOString(),
    companyName: u.company?.name || "No Company"
  }))

  const platformRoles = await prisma.platformRole.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const adminInvitations = await prisma.invitation.findMany({
    where: { platformRoleId: { not: null }, status: 'PENDING' },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Platform Users</h1>
        <p className="text-xs text-zinc-500 mt-1">Directory of all registered user accounts on InvoiceFlowPro.</p>
      </div>

      <UsersTableClient users={formattedUsers} roles={platformRoles} invitations={adminInvitations} />
    </div>
  )
}

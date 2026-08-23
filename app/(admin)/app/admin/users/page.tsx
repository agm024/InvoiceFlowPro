import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

function getInitials(name?: string | null) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function UsersPage() {
  await requireSuperAdmin()

  const users = await prisma.user.findMany({
    include: {
      company: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Platform Users</h1>
        <p className="text-zinc-500 mt-2">Manage all user accounts across every tenant company.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-900">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-semibold text-zinc-600 dark:text-zinc-300">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-white">{user.name || 'No Name'}</div>
                      <div className="text-zinc-500 text-xs">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 capitalize">
                        {user.role.toLowerCase()}
                      </span>
                      {user.isSuperAdmin && (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                          Super Admin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">
                    {user.company?.name || <span className="text-zinc-400 italic font-normal">No Company</span>}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <form action={async () => {
                        'use server'
                        await requireSuperAdmin()
                        await prisma.user.delete({ where: { id: user.id } })
                        revalidatePath('/app/admin/users')
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
      </div>
    </div>
  )
}

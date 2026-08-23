import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { createAnnouncement, deleteAnnouncement } from './actions'

export default async function AnnouncementsPage() {
  await requireSuperAdmin()

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Announcements</h1>
          <p className="text-zinc-500 mt-2">Manage global announcements across the platform.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Create New Announcement</h2>
        <form action={createAnnouncement} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" required className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm" placeholder="Announcement Title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea name="content" required rows={4} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm" placeholder="Message content..." />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Target</label>
              <select name="target" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm">
                <option value="ALL">All Users</option>
                <option value="SPECIFIC_PLANS">Specific Plans</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="published" id="published" className="rounded border-zinc-300" defaultChecked />
              <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-md hover:opacity-90 transition text-sm">
            Create Announcement
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="whitespace-nowrap w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-900">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {announcements.map(announcement => (
              <tr key={announcement.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-900 dark:text-white">{announcement.title}</div>
                  <div className="text-zinc-500 truncate max-w-xs">{announcement.content}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                    {announcement.target}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {announcement.published ? (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">Published</span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">Draft</span>
                  )}
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {announcement.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteAnnouncement}>
                    <input type="hidden" name="id" value={announcement.id} />
                    <button type="submit" className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-md transition">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {announcements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No announcements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

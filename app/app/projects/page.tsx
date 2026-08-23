import prisma from '@/utils/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { Briefcase, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: true,
      milestones: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage project ceilings and milestone pipelines.</p>
        </div>
        <Link href="/app/projects/new" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors w-full sm:w-auto text-center">
          + New Project
        </Link>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-sm text-left">
          <thead className="bg-sidebar-bg text-zinc-500 border-b border-sidebar-border uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Project Name</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Ceiling Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sidebar-border">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">No active projects</h3>
                  <p className="text-zinc-500 mb-6">Create your first project to start mapping milestones and ceilings.</p>
                  <Link href="/app/projects/new" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                    <Plus size={18} /> Create Project
                  </Link>
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const billedSum = project.milestones.filter(m => m.status !== 'UNBILLED').reduce((sum, m) => sum + m.amount, 0)
                const isCompleted = billedSum >= project.totalValue && project.totalValue > 0
                return (
                  <tr key={project.id} className="hover:bg-sidebar-bg/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">
                        <Link href={`/app/projects/${project.id}`} className="hover:underline text-zinc-900 dark:text-white">{project.name}</Link>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{project.milestones.length} Phases</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 font-medium">
                      <Link href={`/app/clients/${project.client.slug}`} className="hover:underline">{project.client.name}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isCompleted ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-8000/10 text-zinc-900 dark:text-white'}`}>
                        {isCompleted ? 'COMPLETED' : project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-foreground tabular-nums">₹ {project.totalValue.toLocaleString()}</div>
                      <div className="text-xs text-zinc-500 mt-1 tabular-nums">₹ {billedSum.toLocaleString()} Billed</div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

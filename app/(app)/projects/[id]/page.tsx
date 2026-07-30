import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import KanbanBoard from './KanbanBoard'
import ContractEditor from './ContractEditor'
import { ArrowLeft } from 'lucide-react'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: {
      client: true,
      milestones: { orderBy: { orderIndex: 'asc' } },
      tasks: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!project) notFound()

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <Link href="/projects" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">{project.name}</h1>
          <p className="text-zinc-500">Client: <Link href={`/clients/${project.client.slug}`} className="hover:underline font-medium text-zinc-900 dark:text-white">{project.client.name}</Link></p>
        </div>
        <a 
          href={`/projects/${project.id}/contract/print`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          {project.contractApprovedAt ? 'Download Signed Contract' : 'Preview Contract PDF'}
        </a>
      </div>

      {/* Contract Editor Component */}
      <ContractEditor projectId={project.id} initialContract={project.contractText} isSigned={!!project.contractApprovedAt} />

      {/* Kanban Board Component */}
      <KanbanBoard project={project} />
    </div>
  )
}

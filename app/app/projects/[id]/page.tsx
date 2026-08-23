export const dynamic = 'force-dynamic'

import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import KanbanBoard from './KanbanBoard'
import ContractEditor from './ContractEditor'
import PaymentRoadmap from './PaymentRoadmap'
import { ArrowLeft, Briefcase, FileSignature, CheckCircle, ExternalLink, Download } from 'lucide-react'

export default async function ProjectDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const tab = typeof resolvedSearchParams.tab === 'string' ? resolvedSearchParams.tab : 'roadmap'
  
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
    <div className="max-w-7xl mx-auto w-full space-y-8 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div>
        <Link href="/app/projects" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>
      </div>
      
      {/* Premium Header */}
      <div className="relative bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm backdrop-blur-xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -mr-16 -mt-16"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 shrink-0">
              <Briefcase size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">{project.name}</h1>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <span>Client:</span>
                <Link href={`/app/clients/${project.client.slug}`} className="inline-flex items-center gap-1 text-zinc-900 dark:text-zinc-200 hover:text-blue-600 transition-colors font-bold bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-md">
                  {project.client.name} <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 self-start md:self-auto w-full md:w-auto">
            <a 
              href={`/app/projects/${project.id}/contract/print`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-all border ${
                project.contractApprovedAt 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-lg' 
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {project.contractApprovedAt ? (
                <>
                  <Download size={16} /> Download Signed PDF
                </>
              ) : (
                <>
                  <FileSignature size={16} /> Preview Contract PDF
                </>
              )}
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-6 mt-8 border-b border-zinc-200 dark:border-zinc-800 relative z-10">
          <Link 
            href={`?tab=roadmap`}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
              tab === 'roadmap' 
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' 
                : 'text-zinc-500 border-transparent hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300'
            }`}
          >
            Project Roadmap
          </Link>
          <Link 
            href={`?tab=contract`}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              tab === 'contract' 
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400' 
                : 'text-zinc-500 border-transparent hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300'
            }`}
          >
            Legal & Contract
            {project.contractApprovedAt && (
              <CheckCircle size={14} className="text-green-500" />
            )}
          </Link>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {tab === 'roadmap' ? (
          <div className="space-y-8">
            <PaymentRoadmap project={project} />
            <KanbanBoard project={project} />
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
             <ContractEditor projectId={project.id} initialContract={project.contractText} isSigned={!!project.contractApprovedAt} />
          </div>
        )}
      </div>
    </div>
  )
}


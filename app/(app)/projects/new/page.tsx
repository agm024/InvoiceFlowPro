import prisma from '@/utils/prisma'
import ProjectForm from './ProjectForm'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' }
  })
  
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">New Contract</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Smart Scoping Canvas</h1>
          <p className="text-base text-zinc-500 mt-2 max-w-2xl">Define project ceilings and chronologically map phase milestones with our live smart-balance ledger.</p>
        </div>
      </div>
      
      <ProjectForm clients={clients} />
    </div>
  )
}

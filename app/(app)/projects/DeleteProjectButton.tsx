'use client'

import { useState } from 'react'
import { deleteProject } from './actions'
import { Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DeleteProjectButton({ projectId, projectName }: { projectId: string, projectName: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteProject(projectId)
    if (res.error) {
      toast.error(res.error)
      setIsDeleting(false)
      setShowConfirm(false)
    } else {
      toast.success('Project deleted successfully')
      // Let the page revalidate naturally
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50">
        <AlertTriangle size={14} className="text-red-500" />
        <span className="text-xs font-medium text-red-700 dark:text-red-400">Delete {projectName}?</span>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold"
        >
          {isDeleting ? '...' : 'Yes'}
        </button>
        <button 
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-xs px-2 py-1 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      title="Delete Project"
      className="text-zinc-400 hover:text-red-500 bg-sidebar-border hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-md transition-all flex items-center justify-center border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
    >
      <Trash2 size={16} />
    </button>
  )
}

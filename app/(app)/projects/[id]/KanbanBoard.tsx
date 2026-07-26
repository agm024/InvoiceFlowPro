'use client'

import { useState } from 'react'
import { updateProjectTaskStatus, createProjectTask, deleteProjectTask, updateProjectStage } from './actions'
import { Plus, Trash2, GripVertical, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function KanbanBoard({ project }: { project: any }) {
  const router = useRouter()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isUpdatingStage, setIsUpdatingStage] = useState(false)

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    setIsAdding(true)
    const res = await createProjectTask(project.id, newTaskTitle)
    if (res.success) {
      setNewTaskTitle('')
      toast.success('Task added')
    } else {
      toast.error(res.error || 'Failed to add task')
    }
    setIsAdding(false)
  }

  const handleMoveTask = async (taskId: string, newStatus: string) => {
    const res = await updateProjectTaskStatus(taskId, newStatus, project.id)
    if (!res.success) toast.error('Failed to move task')
  }

  const handleDeleteTask = async (taskId: string) => {
    const res = await deleteProjectTask(taskId, project.id)
    if (!res.success) toast.error('Failed to delete task')
  }

  const handleUpdateStage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdatingStage(true)
    const res = await updateProjectStage(project.id, e.target.value)
    if (res.success) {
      toast.success('Project stage updated')
    } else {
      toast.error('Failed to update stage')
    }
    setIsUpdatingStage(false)
  }

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-zinc-200 dark:border-zinc-700 dark:border-zinc-900/50 bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-900/10' },
    { id: 'DONE', title: 'Done', color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10' }
  ]

  const stages = ['PLANNING', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'REVIEW', 'CLOSED']

  return (
    <div className="space-y-8">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Project Stage</h2>
          <p className="text-sm text-zinc-500">Update the current stage to reflect on the client portal.</p>
        </div>
        <div className="flex items-center gap-3">
          {isUpdatingStage && <Loader2 size={16} className="animate-spin text-zinc-400" />}
          <select 
            value={project.stage} 
            onChange={handleUpdateStage}
            disabled={isUpdatingStage}
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white font-medium"
          >
            {stages.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <input 
          type="text" 
          placeholder="New task title..." 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
        />
        <button 
          type="submit" 
          disabled={isAdding || !newTaskTitle.trim()}
          className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-zinc-200 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Add Task
        </button>
      </form>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.id} className={`rounded-2xl border ${col.color} p-4 min-h-[400px] flex flex-col`}>
            <h3 className="font-bold text-zinc-700 dark:text-zinc-300 mb-4 px-2">{col.title} <span className="text-xs font-normal text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full ml-2">{project.tasks.filter((t: any) => t.status === col.id).length}</span></h3>
            
            <div className="flex flex-col gap-3 flex-1">
              {project.tasks.filter((t: any) => t.status === col.id).map((task: any) => (
                <div key={task.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm group">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white leading-tight">{task.title}</p>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {/* Actions to move */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    {col.id !== 'TODO' && (
                      <button onClick={() => handleMoveTask(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 flex items-center gap-1">
                        ← Move back
                      </button>
                    )}
                    <div className="flex-1"></div>
                    {col.id !== 'DONE' && (
                      <button onClick={() => handleMoveTask(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')} className="text-xs font-medium text-zinc-900 dark:text-white hover:text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white flex items-center gap-1">
                        Move forward →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {project.tasks.filter((t: any) => t.status === col.id).length === 0 && (
                <div className="flex-1 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl flex items-center justify-center p-6 text-center text-zinc-400 text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

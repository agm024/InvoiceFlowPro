'use client'

import { useState } from 'react'
import { updateProjectTaskStatus, createProjectTask, deleteProjectTask, updateProjectStage } from './actions'
import { Plus, Trash2, CheckCircle, ArrowRight, Loader2, GripVertical, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function KanbanBoard({ project }: { project: any }) {
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

  // Define Web Agency specific columns
  const columns = [
    { id: 'TODO', title: 'Planning', color: 'border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400 badge-bg-purple-100' },
    { id: 'DESIGN', title: 'Design', color: 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 badge-bg-blue-100' },
    { id: 'DEVELOPMENT', title: 'Development', color: 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 badge-bg-amber-100' },
    { id: 'REVIEW', title: 'Review', color: 'border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400 badge-bg-orange-100' },
    { id: 'DONE', title: 'Launch', color: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 badge-bg-emerald-100' }
  ]

  const stages = ['PLANNING', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'REVIEW', 'CLOSED']

  // Map legacy tasks to new agency statuses if they somehow end up with old string names
  const normalizedTasks = project.tasks.map((t: any) => {
    let s = t.status;
    if (s === 'IN_PROGRESS') s = 'DEVELOPMENT'; // Backwards compatibility for old tasks
    return { ...t, status: s };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Controls: Stage and Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 pl-6 rounded-2xl shadow-sm items-center">
        <div className="lg:col-span-3 py-4 lg:py-0">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Current Stage</p>
          <div className="flex items-center gap-3">
            <select 
              value={project.stage} 
              onChange={handleUpdateStage}
              disabled={isUpdatingStage}
              className="bg-transparent text-sm font-bold text-zinc-900 dark:text-white focus:outline-none cursor-pointer appearance-none pr-8"
            >
              {stages.map(s => (
                <option key={s} value={s} className="bg-white dark:bg-zinc-900 text-black dark:text-white">{s}</option>
              ))}
            </select>
            {isUpdatingStage && <Loader2 size={14} className="animate-spin text-blue-500" />}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1 h-12 w-px bg-zinc-100 dark:bg-zinc-800"></div>

        <div className="lg:col-span-8 flex-1">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input 
              type="text" 
              placeholder="What needs to be done next? (e.g. Wireframe homepage...)" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none font-medium placeholder:text-zinc-400"
            />
            <button 
              type="submit" 
              disabled={isAdding || !newTaskTitle.trim()}
              className="m-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Task
            </button>
          </form>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col, colIndex) => {
          const colTasks = normalizedTasks.filter((t: any) => t.status === col.id);
          const prevCol = columns[colIndex - 1];
          const nextCol = columns[colIndex + 1];

          return (
            <div key={col.id} className={`rounded-3xl border ${col.color} p-2 flex flex-col min-h-[500px] min-w-[280px]`}>
              {/* Column Header */}
              <div className="flex items-center justify-between p-3 mb-2">
                <h3 className={`font-black text-sm tracking-wide ${col.title.includes('Done') || col.id === 'DONE' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {col.title}
                </h3>
                <span className="text-xs font-bold bg-white/50 dark:bg-black/20 px-2.5 py-1 rounded-full text-zinc-600 dark:text-zinc-400 shadow-sm backdrop-blur-md">
                  {colTasks.length}
                </span>
              </div>
              
              {/* Task List */}
              <div className="flex flex-col gap-3 flex-1 px-1 pb-2">
                {colTasks.map((task: any) => (
                  <div key={task.id} className="bg-white dark:bg-zinc-900/90 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group backdrop-blur-xl relative">
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteTask(task.id)} className="text-zinc-300 hover:text-red-500 bg-white dark:bg-zinc-900 rounded-full p-1 shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="pr-6">
                      <p className={`text-sm font-bold leading-snug ${col.id === 'DONE' ? 'text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-300' : 'text-zinc-900 dark:text-white'}`}>
                        {task.title}
                      </p>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                      <div>
                        {prevCol ? (
                          <button 
                            onClick={() => handleMoveTask(task.id, prevCol.id)} 
                            className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 flex items-center gap-1 uppercase tracking-wider transition-colors"
                          >
                            ← Prev
                          </button>
                        ) : <span className="w-10"></span>}
                      </div>

                      {col.id === 'DONE' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <GripVertical size={14} className="text-zinc-300 dark:text-zinc-600 opacity-50" />
                      )}

                      <div>
                        {nextCol ? (
                          <button 
                            onClick={() => handleMoveTask(task.id, nextCol.id)} 
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 uppercase tracking-wider transition-colors"
                          >
                            Next →
                          </button>
                        ) : <span className="w-10"></span>}
                      </div>
                    </div>
                  </div>
                ))}
                
                {colTasks.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-50">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center mb-2">
                      <Plus size={16} className="text-zinc-400" />
                    </div>
                    <p className="text-xs font-medium text-zinc-500">Empty phase</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

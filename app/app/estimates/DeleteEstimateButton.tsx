'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteEstimate } from './actions'

export default function DeleteEstimateButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this estimate?')) return
    
    setIsDeleting(true)
    const res = await deleteEstimate(id)
    if (res.success) {
      toast.success('Estimate deleted successfully')
    } else {
      toast.error('Failed to delete estimate')
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-zinc-400 hover:text-red-600 transition-colors p-1"
      title="Delete Estimate"
    >
      <Trash2 size={18} />
    </button>
  )
}

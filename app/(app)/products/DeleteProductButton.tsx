'use client'

import { useState } from 'react'
import { deleteProduct } from './actions'
import toast from 'react-hot-toast'

export default function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true)
      const res = await deleteProduct(id)
      if (res.success) {
        toast.success('Product deleted successfully')
      } else {
        toast.error('Failed to delete product')
        setIsDeleting(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-red-500 hover:text-red-600 text-xs font-medium bg-red-500/10 px-2 py-1 rounded disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, AlertCircle } from 'lucide-react'

export default function TrialExpiredPopup({ isExpired }: { isExpired: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isExpired) {
      const hasSeenPopup = localStorage.getItem('hasSeenTrialExpiredPopup')
      if (!hasSeenPopup) {
        setIsOpen(true)
        localStorage.setItem('hasSeenTrialExpiredPopup', 'true')
      }
    }
  }, [isExpired])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X size={20} />
        </button>
        
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center mb-2">Your Trial Has Ended</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-center mb-6 text-sm">
          Your 14-day free trial has expired. To continue using premium features uninterrupted, please select a subscription plan.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              setIsOpen(false)
              router.push('/app/billing')
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            View Plans & Renew
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium py-2 text-sm transition-colors"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  )
}

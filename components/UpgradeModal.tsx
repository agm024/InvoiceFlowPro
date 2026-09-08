
'use client'

import { AlertTriangle, X, ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

export default function UpgradeModal({
  isOpen,
  onClose,
  title,
  message
}: UpgradeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 text-center pt-10 pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/20">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 id="modal-title" className="text-xl font-bold text-foreground mb-3">{title}</h2>
          <p className="text-zinc-500 mb-8">{message}</p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/app/billing" 
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold shadow-md hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
            >
              Upgrade Plan <ArrowRight size={18} />
            </Link>
            <button 
              onClick={onClose}
              className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

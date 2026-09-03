'use client'

import { useState } from 'react'
import { Loader2, Save, Trash2, AlertTriangle, Key } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { changePasswordAction, deleteAccountAction } from './profile-actions'
import ConfirmationModal from '@/components/ConfirmationModal'

export default function MyProfileClient({ currentUser, subscription }: { currentUser: any, subscription: any }) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match')
    }
    if (newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters')
    }

    setLoading(true)
    const res = await changePasswordAction(currentPassword, newPassword)
    setLoading(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Password changed successfully')
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const handleDeleteAccount = () => {
    if (subscription?.status === 'active') {
      return toast.error('Please cancel your active subscription before deleting your account.')
    }
    setShowDeleteModal(true)
  }

  const confirmDeleteAccount = async () => {
    setDeleting(true)
    const res = await deleteAccountAction()
    if (res.error) {
      toast.error(res.error)
      setDeleting(false)
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Profile Info */}
      <section className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-card-border">
          <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
          <p className="text-sm text-zinc-500 mt-1">Your personal account details.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-full md:w-48 shrink-0">
              Full Name :
            </label>
            <input 
              type="text" disabled value={currentUser.name || ''}
              className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors opacity-70 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-full md:w-48 shrink-0">
              Email Address :
            </label>
            <input 
              type="email" disabled value={currentUser.email || ''}
              className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors opacity-70 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-zinc-500">Note: To change your name or email, please contact support.</p>
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-card border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-card-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Key size={18} className="text-blue-500" />
            Change Password
          </h3>
          <p className="text-sm text-zinc-500 mt-1">Update your password to keep your account secure.</p>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-full md:w-48 shrink-0">
              Current Password :
            </label>
            <input 
              type="password" name="currentPassword" required
              className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-full md:w-48 shrink-0">
              New Password :
            </label>
            <input 
              type="password" name="newPassword" required minLength={8}
              className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-full md:w-48 shrink-0">
              Confirm New Password :
            </label>
            <input 
              type="password" name="confirmPassword" required minLength={8}
              className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit" disabled={loading}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-sm shadow-zinc-900/20 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-200 dark:border-red-900/50">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle size={18} />
            Danger Zone
          </h3>
          <p className="text-sm text-red-500/80 dark:text-red-400/80 mt-1">Permanently delete your account and all associated data.</p>
        </div>
        <div className="p-6">
          {subscription?.status === 'active' ? (
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 rounded-lg text-sm mb-4 border border-orange-200 dark:border-orange-900/50">
              <strong>Active Subscription:</strong> You currently have an active subscription. Please cancel your subscription from the billing dashboard before you can delete your account.
            </div>
          ) : null}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Once you delete your account, there is no going back. Please be certain. All your invoices, clients, and company data will be permanently wiped.
          </p>
          <button 
            onClick={handleDeleteAccount} 
            disabled={deleting || subscription?.status === 'active'}
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Delete Account
          </button>
        </div>
      </section>


      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure? This action cannot be undone and will permanently delete all your invoices, clients, and company data."
        confirmText="Yes, Delete My Account"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  )
}

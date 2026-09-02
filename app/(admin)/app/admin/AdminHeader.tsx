"use client"

import { useState } from "react"
import { Search, Bell, HelpCircle, LogOut, ArrowLeft, ArrowUpRight, ShieldCheck, User, Settings } from "lucide-react"
import Link from "next/link"
import { stopImpersonation } from "./impersonate-actions"

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    isImpersonating?: boolean
  }
  signOutAction: () => Promise<void>
}

export function AdminHeader({ user, signOutAction }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "A"

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-20 shrink-0 select-none">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
        <input
          type="text"
          placeholder="Search businesses, users, invoices, audit logs..."
          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Help & Documentation */}
        <Link 
          href="/app/support"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          title="Admin Help Desk"
        >
          <HelpCircle size={18} />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors relative"
            title="System alerts"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">Admin Notifications</span>
                <span className="text-[10px] text-blue-500 hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900">
                <div className="p-3 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">ZeptoMail Connection Warning</p>
                  <p className="text-zinc-500 mt-1">Provider is reporting missing environment variables.</p>
                </div>
                <div className="p-3 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer">
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">Razorpay Webhook Fired</p>
                  <p className="text-zinc-500 mt-1">Mock transaction simulation was registered.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Impersonation Banner Button if in progress */}
        {user?.isImpersonating && (
          <form action={stopImpersonation}>
            <button 
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <ShieldCheck size={14} /> Exit Tenant View
            </button>
          </form>
        )}

        {/* Admin Identity Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold flex items-center justify-center text-xs shadow-sm border border-zinc-200 dark:border-zinc-800">
              {initials}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-900">
                <p className="font-semibold text-zinc-900 dark:text-white">{user?.name || "System Admin"}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
              </div>
              <ul className="py-1">
                <li>
                  <Link 
                    href="/app" 
                    className="flex items-center justify-between px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span>Switch to App Dashboard</span>
                    <ArrowUpRight size={14} className="text-zinc-400" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/app/admin/system/settings" 
                    className="flex items-center justify-between px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span>Platform Settings</span>
                    <Settings size={14} className="text-zinc-400" />
                  </Link>
                </li>
              </ul>
              <div className="border-t border-zinc-100 dark:border-zinc-900 mt-1 pt-1">
                <button
                  onClick={() => signOutAction()}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

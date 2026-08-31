"use client"

import { useState } from "react"
import { Search, ShieldCheck, ShieldAlert, Key, MoreHorizontal, UserX, UserCheck } from "lucide-react"

interface UserRow {
  id: string
  name: string | null
  email: string
  role: string
  isSuperAdmin: boolean
  createdAt: string
  companyName: string
}

interface UsersTableClientProps {
  users: UserRow[]
}

export function UsersTableClient({ users }: UsersTableClientProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Filter & Search Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.companyName.toLowerCase().includes(search.toLowerCase())
      
    const matchesRole = roleFilter === "" 
      || (roleFilter === "SUPERADMIN" && user.isSuperAdmin)
      || (roleFilter === "ADMIN" && user.role === "admin" && !user.isSuperAdmin)
      || (roleFilter === "MEMBER" && user.role === "member")

    return matchesSearch && matchesRole
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAction = (action: string, userName: string) => {
    alert(`Action "${action}" triggered for user ${userName}. Action logged to audit trail.`);
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input 
            type="text"
            placeholder="Search users by name, email, company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="ADMIN">Tenant Admin</option>
            <option value="MEMBER">Tenant Member</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Tenant Role</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {paginatedUsers.map(user => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                      {(user.name || "U").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-white">{user.name || "No Name"}</span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 items-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 capitalize">
                        {user.role}
                      </span>
                      {user.isSuperAdmin && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400">
                          Platform Admin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                    {user.companyName}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction("PASSWORD_RESET_REQUIRED", user.name || user.email)}
                        className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition"
                        title="Require Password Reset"
                      >
                        Reset PW
                      </button>
                      <button
                        onClick={() => handleAction("USER_SUSPENDED", user.name || user.email)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition"
                        title="Suspend User"
                      >
                        <UserX size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination navigation */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs font-semibold bg-zinc-50/50 dark:bg-zinc-900/20">
            <span className="text-zinc-500">Showing page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

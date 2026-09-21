"use client"

import { useState } from "react"
import { Users, Mail, X, Check, Trash2, ShieldAlert } from "lucide-react"
import { toast } from "react-hot-toast"
import { inviteTeamMember, revokeInvitation, removeTeamMember, updateTeamMemberRole } from "./team-actions"

export default function TeamMembersClient({ users, invitations, roles, isLimitReached, currentUser }: { users: any[], invitations: any[], roles: any[], isLimitReached?: boolean, currentUser?: any }) {
  const [isInviting, setIsInviting] = useState(false)
  const [email, setEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingRoleId, setEditingRoleId] = useState("")

  const permissions = currentUser?.permissions || []
  const hasManageSettings = permissions.includes('ALL') || permissions.includes('MANAGE_SETTINGS')

  const handleUpdateRole = async (userId: string) => {
    toast.promise(updateTeamMemberRole(userId, editingRoleId || null), {
      loading: "Updating role...",
      success: () => {
        setEditingUserId(null)
        return "Role updated"
      },
      error: "Failed to update role"
    })
  }

  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email")
      return
    }
    
    toast.promise(inviteTeamMember(email, selectedRole), {
      loading: "Sending invitation...",
      success: (res) => {
        if (res.error) throw new Error(res.error)
        setIsInviting(false)
        setEmail("")
        setSelectedRole("")
        return "Invitation sent via email!"
      },
      error: (err) => err.message
    })
  }

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this invitation?")) return
    toast.promise(revokeInvitation(id), {
      loading: "Revoking...",
      success: "Invitation revoked",
      error: "Failed to revoke invitation"
    })
  }

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this team member? They will lose access immediately.")) return
    toast.promise(removeTeamMember(id), {
      loading: "Removing...",
      success: "Team member removed",
      error: "Failed to remove member"
    })
  }

  return (
    <section className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Users size={20} className="text-zinc-400" />
              Team Members
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Manage who has access to your company account.</p>
          </div>
          {hasManageSettings && (
            isInviting ? (
              <button 
                onClick={() => setIsInviting(false)}
                className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
            ) : isLimitReached ? (
              <button 
                disabled
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity cursor-not-allowed"
                title="Team member limit reached"
              >
                Invite Member
              </button>
            ) : (
              <button 
                onClick={() => setIsInviting(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Invite Member
              </button>
            )
          )}
        </div>
        
        {isInviting && hasManageSettings && (
          <div className="bg-sidebar-bg border border-card-border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-3">
            <input 
              type="email"
              placeholder="Email address"
              className="flex-1 bg-background border rounded-lg px-3 py-2 text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <select
              className="bg-background border rounded-lg px-3 py-2 text-sm"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
            >
              <option value="">Standard Member</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <button 
              onClick={handleInvite}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
            >
              Send Invite
            </button>
          </div>
        )}

        <div className="divide-y divide-card-border">
          {users.map((user) => (
            <div key={user.id} className="p-4 px-6 flex items-center justify-between hover:bg-sidebar-bg/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                  {user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{user.name || "Unnamed User"}</p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {user.role === 'admin' ? (
                  <span 
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800"
                    title="Account Owner"
                  >
                    Admin
                  </span>
                ) : editingUserId === user.id && hasManageSettings ? (
                  <div className="flex items-center gap-2">
                    <select 
                      className="bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-2 py-1 text-sm"
                      value={editingRoleId}
                      onChange={e => setEditingRoleId(e.target.value)}
                    >
                      <option value="">Standard Member</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <button onClick={() => handleUpdateRole(user.id)} className="text-emerald-500 p-1">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingUserId(null)} className="text-zinc-400 p-1">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <span 
                    className={`text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-sidebar-bg px-3 py-1 rounded-full border border-card-border ${hasManageSettings ? 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors' : ''}`}
                    onClick={() => {
                      if (hasManageSettings) {
                        setEditingUserId(user.id)
                        setEditingRoleId(user.customRoleId || "")
                      }
                    }}
                    title={hasManageSettings ? "Click to edit role" : "Role"}
                  >
                    {user.customRole?.name || "Standard Member"}
                  </span>
                )}
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600">
                  Active
                </span>
                {user.role !== 'admin' && hasManageSettings && (
                  <button onClick={() => handleRemove(user.id)} className="text-zinc-400 hover:text-red-500 p-2">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {invitations.map((inv) => (
            <div key={inv.id} className="p-4 px-6 flex items-center justify-between hover:bg-sidebar-bg/50 transition-colors opacity-70">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{inv.email}</p>
                  <p className="text-sm text-zinc-500">Invited Member</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-600">
                  Pending
                </span>
                {hasManageSettings && (
                  <button onClick={() => handleRevoke(inv.id)} className="text-zinc-400 hover:text-red-500 p-2" title="Revoke invitation">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {users.length === 0 && invitations.length === 0 && (
            <div className="p-8 text-center text-zinc-500">
              No team members found.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

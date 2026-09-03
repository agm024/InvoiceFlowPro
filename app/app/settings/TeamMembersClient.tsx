"use client"

import { useState } from "react"
import { Users, Mail, X, Check, Trash2, ShieldAlert } from "lucide-react"
import { toast } from "react-hot-toast"
import { inviteTeamMember, revokeInvitation, removeTeamMember } from "./team-actions"

export default function TeamMembersClient({ users, invitations, roles }: { users: any[], invitations: any[], roles: any[] }) {
  const [isInviting, setIsInviting] = useState(false)
  const [email, setEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

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
      error: "Failed to revoke"
    })
  }

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this user's roles?")) return
    toast.promise(removeTeamMember(id), {
      loading: "Removing...",
      success: "User role removed",
      error: "Failed to remove user"
    })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Team Management</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage accountants and team members.</p>
      </div>

      {isInviting && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Email address"
              className="flex-1 bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-4 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <select 
              className="md:w-48 bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-4 py-2"
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
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium"
            >
              Send Invite
            </button>
            <button 
              onClick={() => setIsInviting(false)}
              className="text-zinc-500 hover:text-zinc-900 px-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-card-border flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Active & Pending Members</h3>
          {!isInviting && (
            <button 
              onClick={() => setIsInviting(true)}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Invite Member
            </button>
          )}
        </div>
        
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
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-sidebar-bg px-3 py-1 rounded-full border border-card-border">
                  {user.customRole?.name || "Standard Member"}
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600">
                  Active
                </span>
                <button onClick={() => handleRemove(user.id)} className="text-zinc-400 hover:text-red-500 p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {invitations.map((inv) => (
            <div key={inv.id} className="p-4 px-6 flex items-center justify-between hover:bg-sidebar-bg/50 transition-colors opacity-70">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-dashed">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="font-semibold text-foreground italic">{inv.email}</p>
                  <p className="text-sm text-zinc-500">Invited by {inv.invitedBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-500 bg-sidebar-bg px-3 py-1 rounded-full border border-dashed">
                  {roles.find(r => r.id === inv.customRoleId)?.name || "Standard Member"}
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-orange-500/10 text-orange-600">
                  Pending
                </span>
                <button onClick={() => handleRevoke(inv.id)} className="text-zinc-400 hover:text-red-500 p-2" title="Revoke Invite">
                  <X size={16} />
                </button>
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
    </div>
  )
}

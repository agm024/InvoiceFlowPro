"use client"

import { useState } from "react"
import { Shield, Plus, Edit, Trash2, Save, X, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import { createRole, updateRole, deleteRole } from "./role-actions"

const AVAILABLE_PERMISSIONS = [
  { id: "MANAGE_INVOICES", label: "Manage Invoices" },
  { id: "MANAGE_CLIENTS", label: "Manage Clients" },
  { id: "MANAGE_PRODUCTS", label: "Manage Products" },
  { id: "VIEW_REPORTS", label: "View Reports" },
  { id: "MANAGE_SETTINGS", label: "Manage Settings" }
]

export default function RolesClient({ initialRoles }: { initialRoles: any[] }) {
  const [roles, setRoles] = useState(initialRoles)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "", permissions: [] as string[] })

  const handleEdit = (role: any) => {
    setEditingRole(role.id)
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: JSON.parse(role.permissions || "[]")
    })
    setIsCreating(false)
  }

  const handleCreateNew = () => {
    setEditingRole(null)
    setFormData({ name: "", description: "", permissions: [] })
    setIsCreating(true)
  }

  const handleCancel = () => {
    setEditingRole(null)
    setIsCreating(false)
  }

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }))
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Role name is required")
      return
    }

    const savePromise = isCreating 
      ? createRole(formData)
      : updateRole(editingRole, formData)

    toast.promise(savePromise, {
      loading: "Saving role...",
      success: (res) => {
        if (res.error) throw new Error(res.error)
        
        if (isCreating) {
          setRoles([...roles, res.role])
        } else {
          setRoles(roles.map(r => r.id === editingRole ? res.role : r))
        }
        
        handleCancel()
        return "Role saved successfully"
      },
      error: (err) => err.message
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role? Users with this role will lose their custom permissions.")) return
    
    toast.promise(deleteRole(id), {
      loading: "Deleting role...",
      success: (res) => {
        if (res.error) throw new Error(res.error)
        setRoles(roles.filter(r => r.id !== id))
        return "Role deleted"
      },
      error: (err) => err.message
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Custom Roles
        </h2>
        {!isCreating && !editingRole && (
          <button 
            onClick={handleCreateNew}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2 transition-opacity"
          >
            <Plus size={16} /> Create Role
          </button>
        )}
      </div>

      {(isCreating || editingRole) && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{isCreating ? "Create New Role" : "Edit Role"}</h3>
          
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Account Manager"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description (Optional)</label>
              <input 
                type="text" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_PERMISSIONS.map(perm => {
                  const isSelected = formData.permissions.includes(perm.id)
                  return (
                    <div 
                      key={perm.id}
                      onClick={() => togglePermission(perm.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-primary border-primary' : 'border-zinc-300 dark:border-zinc-600'
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {perm.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 flex items-center gap-2 transition-opacity shadow-sm"
              >
                <Save size={16} /> Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {!isCreating && !editingRole && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center text-zinc-500 shadow-sm">
              <Shield className="mx-auto mb-4 opacity-50" size={32} />
              <p>No custom roles created yet.</p>
            </div>
          ) : roles.map((role: any) => {
            const perms = JSON.parse(role.permissions || "[]")
            return (
              <div key={role.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{role.name}</h3>
                  </div>
                  {role.description && <p className="text-sm text-zinc-500 mb-4">{role.description}</p>}
                  
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Permissions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {perms.length > 0 ? perms.map((p: string) => (
                        <span key={p} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2 py-1 rounded-md">
                          {p.replace(/_/g, ' ')}
                        </span>
                      )) : <span className="text-sm text-zinc-500 italic">No permissions</span>}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-3 flex justify-end gap-2">
                  <button onClick={() => handleEdit(role)} className="p-2 text-zinc-400 hover:text-primary transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(role.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

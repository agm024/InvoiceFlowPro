const fs = require('fs');
let content = fs.readFileSync('app/app/settings/TeamMembersClient.tsx', 'utf8');

content = content.replace(
  'import { inviteTeamMember, revokeInvitation, removeTeamMember } from "./team-actions"',
  'import { inviteTeamMember, revokeInvitation, removeTeamMember, updateTeamMemberRole } from "./team-actions"'
);

// We need to add state for editing a role
const stateToAdd = `  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingRoleId, setEditingRoleId] = useState("")

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
`;

content = content.replace('  const handleInvite = async () => {', stateToAdd + '\n  const handleInvite = async () => {');

const userRowOriginal = `<span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-sidebar-bg px-3 py-1 rounded-full border border-card-border">
                  {user.customRole?.name || "Standard Member"}
                </span>`;

const userRowNew = `{editingUserId === user.id ? (
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
                    className="text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-sidebar-bg px-3 py-1 rounded-full border border-card-border cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => {
                      setEditingUserId(user.id)
                      setEditingRoleId(user.customRoleId || "")
                    }}
                    title="Click to edit role"
                  >
                    {user.customRole?.name || "Standard Member"}
                  </span>
                )}`;

content = content.replace(userRowOriginal, userRowNew);

fs.writeFileSync('app/app/settings/TeamMembersClient.tsx', content, 'utf8');

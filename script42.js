const fs = require('fs');
let content = fs.readFileSync('app/app/settings/TeamMembersClient.tsx', 'utf8');

content = content.replace(
  'export default function TeamMembersClient({ users, invitations, roles }: { users: any[], invitations: any[], roles: any[] }) {',
  'export default function TeamMembersClient({ users, invitations, roles, isLimitReached }: { users: any[], invitations: any[], roles: any[], isLimitReached?: boolean }) {'
);

const searchButton = `{!isInviting && (
            <button 
              onClick={() => setIsInviting(true)}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Invite Member
            </button>
          )}`;

const replacementButton = `{!isInviting && (
            isLimitReached ? (
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
                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Invite Member
              </button>
            )
          )}`;

content = content.replace(searchButton, replacementButton);
fs.writeFileSync('app/app/settings/TeamMembersClient.tsx', content, 'utf8');

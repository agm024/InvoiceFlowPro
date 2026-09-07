const fs = require('fs');
let content = fs.readFileSync('app/app/settings/TeamMembersClient.tsx', 'utf8');

// Imports
if (!content.includes('UpgradeModal')) {
  content = content.replace(
    `import { Copy, Plus, MoreVertical, X, Shield, Send } from 'lucide-react'`,
    `import { Copy, Plus, MoreVertical, X, Shield, Send } from 'lucide-react'\nimport UpgradeModal from '@/components/UpgradeModal'`
  );
}

// State
if (!content.includes('showUpgradeModal')) {
  content = content.replace(
    `const [inviteRole, setInviteRole] = useState('')`,
    `const [inviteRole, setInviteRole] = useState('')\n  const [showUpgradeModal, setShowUpgradeModal] = useState(false)`
  );
}

// Replace button in header
const searchTopBtn = `isLimitReached ? (
              <button 
                disabled
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity cursor-not-allowed"
                title="Team member limit reached"
              >
                Limit Reached
              </button>
            ) : (`;

const replaceTopBtn = `isLimitReached ? (
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
              >
                Upgrade Plan
              </button>
            ) : (`;

content = content.replace(searchTopBtn, replaceTopBtn);

// Render modal
if (!content.includes('Team Limit Reached')) {
  content = content.replace(
    /\{isInviteModalOpen && \(/,
    `<UpgradeModal \n        isOpen={showUpgradeModal} \n        onClose={() => setShowUpgradeModal(false)} \n        title="Team Limit Reached" \n        message="You have reached the maximum number of team members allowed on your current plan. Upgrade your plan to invite more." \n      />\n\n      {isInviteModalOpen && (`
  );
}

fs.writeFileSync('app/app/settings/TeamMembersClient.tsx', content, 'utf8');

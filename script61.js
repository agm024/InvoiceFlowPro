const fs = require('fs');
let content = fs.readFileSync('app/app/settings/TeamMembersClient.tsx', 'utf8');

const search = `return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">`;

const replacement = `return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {isLimitReached && (
        <div className="mb-6 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center justify-between font-medium text-sm w-full">
          <span>You have reached your plan's team member limit. Please upgrade your subscription to invite more members.</span>
          <a href="/app/settings?tab=pricing" className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-700 transition-colors font-semibold">
            Upgrade Plan
          </a>
        </div>
      )}
      <div className="mb-6">`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/settings/TeamMembersClient.tsx', content, 'utf8');

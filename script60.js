const fs = require('fs');
let content = fs.readFileSync('app/app/clients/ClientsClient.tsx', 'utf8');

const search = `return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">`;

const replacement = `return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full font-sans">
      {isLimitReached && (
        <div className="mb-6 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center justify-between font-medium text-sm w-full">
          <span>You have reached your plan's client limit. Please upgrade your subscription to add more clients.</span>
          <Link href="/app/settings?tab=pricing" className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-700 transition-colors font-semibold">
            Upgrade Plan
          </Link>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 w-full">`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/clients/ClientsClient.tsx', content, 'utf8');

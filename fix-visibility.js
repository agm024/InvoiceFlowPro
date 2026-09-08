const fs = require('fs');

let widget = fs.readFileSync('app/app/OnboardingWidget.tsx', 'utf8');

// Update to 5 steps
widget = widget.replace(
  /const stepsCompleted = 1 \+ \(hasBusinessInfo \? 1 : 0\) \+ \(hasGst \? 1 : 0\) \+ \(hasClient \? 1 : 0\);/,
  `const stepsCompleted = 1 + (hasBusinessInfo ? 1 : 0) + (hasGst ? 1 : 0) + (hasClient ? 1 : 0) + (hasInvoice ? 1 : 0);`
);

// Remove early return if hasInvoice
widget = widget.replace(
  /if \(hasInvoice\) return null; \/\/ Fully completed/,
  `if (stepsCompleted === totalSteps) return null; // Fully completed`
);

// Add checkmark to Invoice step
widget = widget.replace(
  /<li className="flex items-center gap-3 text-zinc-500">\s*<div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"><\/div>\s*<Link href="\/app\/invoices\/new" className="hover:underline text-blue-600 dark:text-blue-400 font-semibold">Create your first invoice ➔<\/Link>\s*<\/li>/,
  `<li className={\`flex items-center gap-3 \${hasInvoice ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}\`}>
              <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs \${hasInvoice ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}\`}>{hasInvoice ? '✓' : ''}</div>
              {hasInvoice ? <span>Create your first invoice</span> : <Link href="/app/invoices/new" className="hover:underline text-blue-600 dark:text-blue-400 font-semibold">Create your first invoice ➔</Link>}
            </li>`
);

fs.writeFileSync('app/app/OnboardingWidget.tsx', widget, 'utf8');

let page = fs.readFileSync('app/app/page.tsx', 'utf8');

page = page.replace(
  /\{\!hasInvoice && <OnboardingWidget/,
  `{!(hasBusinessInfo && hasGst && hasClient && hasInvoice) && <OnboardingWidget`
);

fs.writeFileSync('app/app/page.tsx', page, 'utf8');

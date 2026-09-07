const fs = require('fs');
let text = fs.readFileSync('app/page.tsx', 'utf8');

text = text.replace(
    'Everything you need to create beautiful invoices, track expenses, and manage clients in one unified platform. Built for scale.',
    'Everything you need to create beautiful invoices, track expenses, and manage clients in one unified platform. Start completely free with unlimited invoices and clients.'
);

text = text.replace(
    'Start your free trial',
    'Start for free'
);

text = text.replace(
    /<h3 className="font-bold text-lg mb-2">Beautiful Invoices<\/h3>[\s\S]*?<\/div>/,
    `<h3 className="font-bold text-lg mb-2">Unlimited Invoices & Estimates</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Create professional, customized invoices in seconds. No limits on how many you can send on our generous free tier.</p>
          </div>`
);

text = text.replace(
    /<h3 className="font-bold text-lg mb-2">Client Portal<\/h3>[\s\S]*?<\/div>/,
    `<h3 className="font-bold text-lg mb-2">Team & Role Management</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Invite team members with custom role-based access. Collaborate securely without sharing credentials.</p>
          </div>`
);

text = text.replace(
    /<h3 className="font-bold text-lg mb-2">Expense Tracking<\/h3>[\s\S]*?<\/div>/,
    `<h3 className="font-bold text-lg mb-2">Multi-Currency & Expenses</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Bill international clients in their local currency. Log business expenses and attach receipts directly to projects.</p>
          </div>`
);

fs.writeFileSync('app/page.tsx', text, 'utf8');

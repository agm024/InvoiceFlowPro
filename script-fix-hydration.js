const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // We only care if it's a client component or if we just want to standardize
    // Let's standardise it for all files that use it.

    if (content.includes('toLocaleDateString')) {
        if (!content.includes('import { format }')) {
            // Find the last import and add it after
            if (content.includes('import ')) {
                content = content.replace(/(import .*?\n)(?!import)/, `$1import { format } from 'date-fns'\n`);
            } else {
                content = `import { format } from 'date-fns'\n` + content;
            }
        }

        // new Date(xxx).toLocaleDateString(...)
        content = content.replace(/new Date\(([^)]+)\)\.toLocaleDateString\([^)]*\)/g, `format(new Date($1), 'MMM dd, yyyy')`);
        
        // xxx.toLocaleDateString(...) where xxx is a variable
        content = content.replace(/([a-zA-Z0-9_.]+)\.toLocaleDateString\([^)]*\)/g, (match, p1) => {
            if (p1.endsWith('Date')) return match; // just to be safe if it's not a direct match
            return `format(new Date(${p1}), 'MMM dd, yyyy')`;
        });

        fs.writeFileSync(filePath, content, 'utf8');
        changed = true;
        console.log('Fixed', filePath);
    }
}

const files = [
    'app/(admin)/app/admin/billing/revenue/page.tsx',
    'app/(admin)/app/admin/billing/subscriptions/page.tsx',
    'app/(admin)/app/admin/businesses/[id]/BusinessDetailsClient.tsx',
    'app/(admin)/app/admin/support/announcements/page.tsx',
    'app/(admin)/app/admin/support/tickets/TicketsTableClient.tsx',
    'app/(admin)/app/admin/support/page.tsx',
    'app/(admin)/app/admin/users/UsersTableClient.tsx',
    'app/app/billing/page.tsx',
    'app/app/products/[slug]/ProductTransactionsClient.tsx',
    'app/app/reports/gst-validation/GstExportButton.tsx',
    'app/app/support/page.tsx'
];

files.forEach(f => {
    try {
        replaceInFile(f);
    } catch (e) {
        console.log('Error in', f, e.message);
    }
});

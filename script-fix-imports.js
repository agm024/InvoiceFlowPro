const fs = require('fs');
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
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('import { \nimport { format } from \'date-fns\'')) {
        content = content.replace('import { \nimport { format } from \'date-fns\'', 'import { format } from \'date-fns\'\nimport { ');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Fixed', f);
    }
});

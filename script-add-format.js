const fs = require('fs');

const missing = [
    'app/(admin)/app/admin/support/announcements/page.tsx',
    'app/app/products/[slug]/ProductTransactionsClient.tsx',
    'app/app/reports/gst-validation/GstExportButton.tsx',
    'app/app/support/page.tsx'
];

missing.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('import { format } from')) {
        content = `import { format } from 'date-fns'\n` + content;
        fs.writeFileSync(f, content, 'utf8');
        console.log('Added format to', f);
    }
});

const fs = require('fs');

const files = [
    'app/app/products/[slug]/ProductTransactionsClient.tsx',
    'app/app/reports/gst-validation/GstExportButton.tsx'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let text = fs.readFileSync(file, 'utf8');
        text = text.replace("import { format } from 'date-fns'\n'use client'", "'use client'\nimport { format } from 'date-fns'");
        text = text.replace("import { format } from 'date-fns'\n\"use client\"", "\"use client\"\nimport { format } from 'date-fns'");
        fs.writeFileSync(file, text, 'utf8');
    }
}

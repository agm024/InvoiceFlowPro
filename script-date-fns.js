const fs = require('fs');
let file = 'app/(admin)/app/admin/businesses/BusinessesTableClient.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { format } from "date-fns"')) {
    content = content.replace(
        /"use client"\r?\n/,
        `"use client"\nimport { format } from "date-fns"\n`
    );
}

content = content.replace(
    /new Date\(c\.createdAt\)\.toLocaleDateString\(\)/g,
    `format(new Date(c.createdAt), 'MMM dd, yyyy')`
);

content = content.replace(
    /new Date\(company\.createdAt\)\.toLocaleDateString\(\)/g,
    `format(new Date(company.createdAt), 'MMM dd, yyyy')`
);

fs.writeFileSync(file, content, 'utf8');

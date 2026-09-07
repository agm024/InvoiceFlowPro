const fs = require('fs');

function addImport(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import UpgradeModal')) {
    content = content.replace(
      /'use client'\r?\n/,
      `'use client'\nimport UpgradeModal from '@/components/UpgradeModal'\n`
    );
    fs.writeFileSync(file, content, 'utf8');
  }
}

addImport('app/app/invoices/InvoiceListClient.tsx');
addImport('app/app/clients/ClientsClient.tsx');
addImport('app/app/settings/TeamMembersClient.tsx');

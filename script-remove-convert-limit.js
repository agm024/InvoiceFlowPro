const fs = require('fs');

function removeConvertToInvoiceLimit(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /if \(currentInvoiceCount >= company\.subscription\.plan\.invoiceLimits\) \{\s*return \{ error: `You have reached your limit of \$\{company\.subscription\.plan\.invoiceLimits\} invoices\. Please upgrade your plan\.` \}\s*\}/g,
    `if (currentInvoiceCount >= company.subscription.plan.invoiceLimits) {\n      // return { error: ... } // Unlimited invoices!\n    }`
  );
  fs.writeFileSync(file, content, 'utf8');
}

removeConvertToInvoiceLimit('app/app/invoices/[id]/actions.ts');
removeConvertToInvoiceLimit('app/app/estimates/actions.ts');

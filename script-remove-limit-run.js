const fs = require('fs');

function removeLimit(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the limit reached logic to always be false
  content = content.replace(
    /if \(currentCount >= company\.subscription\.plan\.invoiceLimits\) \{\s*isLimitReached = true;\s*\}/g,
    `if (currentCount >= company.subscription.plan.invoiceLimits) {\n      isLimitReached = false; // Unlimited invoices\n    }`
  );
  
  // Also remove it from createInvoice in actions.ts
  content = content.replace(
    /if \(currentInvoiceCount >= company\.subscription\.plan\.invoiceLimits\) \{\s*return \{ error: `You have reached your limit of \$\{company\.subscription\.plan\.invoiceLimits\} invoices\. Please upgrade your plan\.` \}\s*\}/g,
    `if (currentInvoiceCount >= company.subscription.plan.invoiceLimits) {\n      // return { error: ... } // Unlimited invoices!\n    }`
  );

  fs.writeFileSync(file, content, 'utf8');
}

removeLimit('app/app/invoices/page.tsx');
removeLimit('app/app/invoices/actions.ts');

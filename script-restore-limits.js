const fs = require('fs');

const filesToRestore = [
    'app/app/invoices/actions.ts',
    'app/app/invoices/page.tsx',
    'app/app/clients/actions.ts',
    'app/app/clients/page.tsx',
    'app/app/estimates/actions.ts',
    'app/app/estimates/page.tsx'
];

filesToRestore.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Restore isLimitReached = false; // Unlimited invoices -> isLimitReached = true;
    content = content.replace(/isLimitReached\s*=\s*false;\s*\/\/\s*Unlimited invoices/g, 'isLimitReached = true;');
    content = content.replace(/isLimitReached\s*=\s*false;\s*\/\/\s*Unlimited/g, 'isLimitReached = true;');

    // Restore // return { error: ... } // Unlimited invoices! -> return { error: `You have reached your limit of ${company.subscription.plan.invoiceLimits} invoices. Please upgrade your plan.` }
    content = content.replace(/\/\/\s*return\s*\{.*?\};\s*\/\/\s*Unlimited.*?!/g, 'return { error: `You have reached your limit. Please upgrade your plan.` }');

    // If it was commented out with exactly // return { error: `You have reached your limit of ${company.subscription.plan.invoiceLimits} invoices. Please upgrade your plan.` }
    content = content.replace(/\/\/\s*return\s*\{\s*error:\s*`You have reached your limit of \$\{company\.subscription\.plan\.invoiceLimits\} invoices\. Please upgrade your plan\.`\s*\}\s*\/\/\s*Unlimited invoices!/g, 'return { error: `You have reached your limit of ${company.subscription.plan.invoiceLimits} invoices. Please upgrade your plan.` }');

    fs.writeFileSync(file, content, 'utf8');
});

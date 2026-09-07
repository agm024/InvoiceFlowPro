const fs = require('fs');
let text = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

if (!text.includes('checkFeatureLimit')) {
    text = text.replace(
        "import { requireCompany, requireWriteAccess } from '@/lib/auth-context'",
        "import { requireCompany, requireWriteAccess } from '@/lib/auth-context'\nimport { checkFeatureLimit } from '@/lib/billing'"
    );

    // Get limits in getInvoiceFormData
    text = text.replace(
        /if \(company\?\.subscription\?\.plan\?\.invoiceLimits\) \{[\s\S]*?isLimitReached = true;[\s\S]*?\}/g,
        `const { allowed } = await checkFeatureLimit(companyId, 'invoice');\n    if (!allowed) {\n      isLimitReached = true;\n    }`
    );

    // Create limits in createInvoice
    text = text.replace(
        /if \(company\.subscription\?\.plan\?\.invoiceLimits\) \{[\s\S]*?return \{ error: `You have reached your limit\. Please upgrade your plan\.` \}\}/g,
        `const { allowed } = await checkFeatureLimit(companyId, 'invoice');\n    if (!allowed) {\n      return { error: 'You have reached your limit. Please upgrade your plan.' };\n    }`
    );

    fs.writeFileSync('app/app/invoices/actions.ts', text, 'utf8');
}

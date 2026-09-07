const fs = require('fs');
let text = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

text = text.replace(
    /const \{ allowed \} = await checkFeatureLimit\(companyId, 'invoice'\);\n    if \(!allowed\) \{\n      isLimitReached = true;\n    \}\n  \}/g,
    `const { allowed } = await checkFeatureLimit(companyId, 'invoice');\n  if (!allowed) {\n    isLimitReached = true;\n  }`
);

text = text.replace(
    /const \{ allowed \} = await checkFeatureLimit\(companyId, 'invoice'\);\n    if \(!allowed\) \{\n      return \{ error: 'You have reached your limit\. Please upgrade your plan\.' \};\n    \}\n  \}/g,
    `const { allowed } = await checkFeatureLimit(companyId, 'invoice');\n  if (!allowed) {\n    return { error: 'You have reached your limit. Please upgrade your plan.' };\n  }`
);

fs.writeFileSync('app/app/invoices/actions.ts', text, 'utf8');

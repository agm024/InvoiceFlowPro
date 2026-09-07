const fs = require('fs');
const files = [
    'app/app/invoices/actions.ts',
    'app/app/clients/actions.ts',
    'app/app/estimates/actions.ts',
    'app/app/settings/team-actions.ts'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace the specific patterns with the correct braces
    
    // Pattern 1:
    content = content.replace(
        /const \{ allowed \} = await checkFeatureLimit\(companyId, '([a-z_]+)'\);\s*if \(!allowed\) \{\s*isLimitReached = true;\s*\}\s*\}/g,
        "const { allowed } = await checkFeatureLimit(companyId, '$1');\n  if (!allowed) {\n    isLimitReached = true;\n  }"
    );

    // Pattern 2:
    content = content.replace(
        /const \{ allowed \} = await checkFeatureLimit\(companyId, '([a-z_]+)'\);\s*if \(!allowed\) \{\s*return \{ error: 'You have reached your limit. Please upgrade your plan.' \};\s*\}\s*\}/g,
        "const { allowed } = await checkFeatureLimit(companyId, '$1');\n  if (!allowed) {\n    return { error: 'You have reached your limit. Please upgrade your plan.' };\n  }"
    );

    fs.writeFileSync(file, content, 'utf8');
});

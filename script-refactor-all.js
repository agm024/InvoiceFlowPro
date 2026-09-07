const fs = require('fs');

function refactorFile(file, featureType) {
    if (!fs.existsSync(file)) return;
    let text = fs.readFileSync(file, 'utf8');

    if (!text.includes('checkFeatureLimit')) {
        text = text.replace(
            "import { requireCompany } from '@/lib/auth-context'",
            "import { requireCompany } from '@/lib/auth-context'\nimport { checkFeatureLimit } from '@/lib/billing'"
        );
        text = text.replace(
            "import { requireCompany, requireWriteAccess } from '@/lib/auth-context'",
            "import { requireCompany, requireWriteAccess } from '@/lib/auth-context'\nimport { checkFeatureLimit } from '@/lib/billing'"
        );

        // Client / Estimate Limit replace for getFormData / etc where isLimitReached is set
        // Find: if (company?.subscription?.plan?.{type}Limits) { ... isLimitReached = true; }
        const regex1 = new RegExp(`if \\(company\\?\\.subscription\\?\\.plan\\?\\.${featureType}Limits\\) \\{[\\s\\S]*?isLimitReached = true;\\s*\\n\\s*\\}`, 'g');
        text = text.replace(regex1, `const { allowed } = await checkFeatureLimit(companyId, '${featureType}');\n  if (!allowed) {\n    isLimitReached = true;\n  }`);
        
        // Alternative without ?
        const regex1b = new RegExp(`if \\(company\\.subscription\\?\\.plan\\?\\.${featureType}Limits\\) \\{[\\s\\S]*?isLimitReached = true;\\s*\\n\\s*\\}`, 'g');
        text = text.replace(regex1b, `const { allowed } = await checkFeatureLimit(companyId, '${featureType}');\n  if (!allowed) {\n    isLimitReached = true;\n  }`);

        // Create action replace
        const regex2 = new RegExp(`if \\(company\\.subscription\\?\\.plan\\?\\.${featureType}Limits\\) \\{[\\s\\S]*?return \\{ error: [\\s\\S]*? \\}\\s*\\n\\s*\\}`, 'g');
        text = text.replace(regex2, `const { allowed } = await checkFeatureLimit(companyId, '${featureType}');\n  if (!allowed) {\n    return { error: 'You have reached your limit. Please upgrade your plan.' };\n  }`);
        
        const regex2b = new RegExp(`if \\(company\\?\\.subscription\\?\\.plan\\?\\.${featureType}Limits\\) \\{[\\s\\S]*?return \\{ error: [\\s\\S]*? \\}\\s*\\n\\s*\\}`, 'g');
        text = text.replace(regex2b, `const { allowed } = await checkFeatureLimit(companyId, '${featureType}');\n  if (!allowed) {\n    return { error: 'You have reached your limit. Please upgrade your plan.' };\n  }`);

        fs.writeFileSync(file, text, 'utf8');
    }
}

refactorFile('app/app/clients/actions.ts', 'client');
refactorFile('app/app/estimates/actions.ts', 'invoice'); // Estimates use invoiceLimits ? or estimate limits? I defined it as 'estimate' feature type
refactorFile('app/app/settings/team-actions.ts', 'user');


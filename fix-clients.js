const fs = require('fs');

let text = fs.readFileSync('app/app/clients/actions.ts', 'utf8');

text = text.replace(
    "import { requireCompany } from '@/lib/auth-context'",
    "import { requireCompany } from '@/lib/auth-context'\nimport { checkFeatureLimit } from '@/lib/billing'"
);

// We need to replace the entire if block
const oldBlock = `  if (company.subscription?.plan?.clientLimits) {
    const currentClientCount = await prisma.client.count({
      where: { companyId }
    })
    
    if (currentClientCount >= company.subscription.plan.clientLimits) {
      return { error: \`You have reached your limit of \${company.subscription.plan.clientLimits} clients. Please upgrade your plan.\` }
    }
  }`;
  
const newBlock = `  const { allowed } = await checkFeatureLimit(companyId, 'client');
  if (!allowed) {
    return { error: 'You have reached your limit. Please upgrade your plan.' };
  }`;

text = text.replace(oldBlock, newBlock);

fs.writeFileSync('app/app/clients/actions.ts', text, 'utf8');

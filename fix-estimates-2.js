const fs = require('fs');

let text = fs.readFileSync('app/app/estimates/actions.ts', 'utf8');

text = text.replace(
    "import { requireCompany } from '@/lib/auth-context'",
    "import { requireCompany } from '@/lib/auth-context'\nimport { checkFeatureLimit } from '@/lib/billing'"
);

const oldBlock = `  if (company.subscription?.plan?.invoiceLimits) {
    const currentInvoiceCount = await prisma.invoice.count({
      where: { companyId }
    })
    
    if (currentInvoiceCount >= company.subscription.plan.invoiceLimits) {
      return { error: \`You have reached your limit of \${company.subscription.plan.invoiceLimits} invoices. Please upgrade your plan.\` }
    }
  }`;
  
const newBlock = `  const { allowed } = await checkFeatureLimit(companyId, 'estimate');
  if (!allowed) {
    return { error: 'You have reached your limit. Please upgrade your plan.' };
  }`;

text = text.replace(oldBlock, newBlock);

fs.writeFileSync('app/app/estimates/actions.ts', text, 'utf8');

const fs = require('fs');
let text = fs.readFileSync('app/app/estimates/actions.ts', 'utf8');

text = text.replace(
    /const \{ allowed \} = await checkFeatureLimit\(companyId, 'estimate'\);\n  if \(!allowed\) \{\n    return \{ error: 'You have reached your limit\. Please upgrade your plan\.' \};\n  \}\);\n    if \(!estimate\) return \{ error: 'Estimate not found' \};/g,
    `const { allowed } = await checkFeatureLimit(companyId, 'invoice'); // converting to invoice checks invoice limit!
  if (!allowed) {
    return { error: 'You have reached your limit. Please upgrade your plan.' };
  }
  const estimate = await prisma.invoice.findFirst({
    where: { id: estimateId, companyId, invoiceType: 'ESTIMATE' },
    include: { items: true, client: true }
  });
  if (!estimate) return { error: 'Estimate not found' };`
);

fs.writeFileSync('app/app/estimates/actions.ts', text, 'utf8');

const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

// The limit is checked during createInvoice
// const subscription = await prisma.subscription.findUnique({ where: { companyId } })
// const isFree = !subscription || subscription.plan === 'FREE'
// if (isFree && invoiceCount >= 10) return { error: 'Invoice limit reached on Free plan.' }
// Let's replace the whole block or comment it out

// Wait, the limit logic might be different. Let's find it.
content = content.replace(
  /const invoiceCount = await prisma.invoice.count\(\{[\s\S]*?if \(invoiceCount >= limit\) \{[\s\S]*?return \{ error: 'Invoice limit reached on Free plan\.' \}[\s\S]*?\}/g,
  `// Invoice limits removed as per user request (unlimited invoices with watermark for free users)`
);

// wait, let's just do a manual replace or find the exact text

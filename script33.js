const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

const search = `  const { companyId } = await requireCompany()

  // Server-side validation of totals`;

const replacement = `  const { companyId } = await requireCompany()

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  if (!company) return { error: "Company not found" }

  if (company.subscription?.plan?.invoiceLimits) {
    const currentInvoiceCount = await prisma.invoice.count({
      where: { companyId }
    })
    
    if (currentInvoiceCount >= company.subscription.plan.invoiceLimits) {
      return { error: \`You have reached your limit of \${company.subscription.plan.invoiceLimits} invoices. Please upgrade your plan.\` }
    }
  }

  // Server-side validation of totals`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/invoices/actions.ts', content, 'utf8');

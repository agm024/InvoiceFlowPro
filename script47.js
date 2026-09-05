const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

const search = `  const companySettings = await prisma.companySettings.findFirst({ where: { companyId } })

  return { clients, products, banks, exchangeRates, nextInvoiceNumber, nextQuotationNumber, companySettings }
}`;

const replacement = `  const companySettings = await prisma.companySettings.findFirst({ where: { companyId } })

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  
  let isLimitReached = false;
  if (company?.subscription?.plan?.invoiceLimits) {
    const currentCount = await prisma.invoice.count({ where: { companyId } })
    if (currentCount >= company.subscription.plan.invoiceLimits) {
      isLimitReached = true;
    }
  }

  return { clients, products, banks, exchangeRates, nextInvoiceNumber, nextQuotationNumber, companySettings, isLimitReached }
}`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/invoices/actions.ts', content, 'utf8');

const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/page.tsx', 'utf8');

const search = `  const settings = await getCompanySettings()`;
const replacement = `  const { requireCompany } = await import('@/lib/auth-context')
  const prisma = (await import('@/utils/prisma')).default
  const { companyId } = await requireCompany()
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

  const settings = await getCompanySettings()`;

content = content.replace(search, replacement);

const searchProps = `settings={settings}
        banks={banks}
      />`;
const replacementProps = `settings={settings}
        banks={banks}
        isLimitReached={isLimitReached}
      />`;

content = content.replace(searchProps, replacementProps);
fs.writeFileSync('app/app/invoices/page.tsx', content, 'utf8');

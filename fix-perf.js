const fs = require('fs');

let page = fs.readFileSync('app/app/page.tsx', 'utf8');

// Replace massive include with specific fields where possible
page = page.replace(
  /const allInvoices = await prisma\.invoice\.findMany\(\{\s*where: \{ companyId, invoiceType: \{ not: 'QUOTATION' \} \},\s*include: \{ client: true \}\s*\}\)/,
  `const allInvoices = await prisma.invoice.findMany({
    where: { companyId, invoiceType: { not: 'QUOTATION' } },
    select: {
      id: true,
      status: true,
      date: true,
      dueDate: true,
      total: true,
      taxTotal: true,
      exchangeRate: true,
      invoiceNumber: true,
      updatedAt: true,
      client: { select: { id: true, name: true } }
    }
  })`
);

page = page.replace(
  /const allExpenses = await prisma\.expense\.findMany\(\{\s*where: \{ companyId \}\s*\}\)/,
  `const allExpenses = await prisma.expense.findMany({
    where: { companyId },
    select: {
      id: true,
      category: true,
      date: true,
      totalAmount: true,
      taxAmount: true,
      itcEligible: true,
      vendorName: true,
      createdAt: true
    }
  })`
);

fs.writeFileSync('app/app/page.tsx', page, 'utf8');

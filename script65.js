const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/[id]/actions.ts', 'utf8');

const search = `export async function updateInvoiceStatus(id: string, status: string) {
  const { companyId } = await requireCompany()
  try {
    // Prisma extended where allows filtering by companyId
    await prisma.invoice.updateMany({
      where: { id, companyId },
      data: { status }
    })`;

const replacement = `export async function updateInvoiceStatus(id: string, status: string) {
  const { companyId } = await requireCompany()
  try {
    const invoice = await prisma.invoice.findFirst({ where: { id, companyId } })
    if (!invoice) return { error: 'Invoice not found' }
    
    if (invoice.status === 'paid' && status !== 'paid') {
      return { error: 'Cannot change status of a paid invoice' }
    }
    if (invoice.status === 'cancelled') {
      return { error: 'Cannot change status of a cancelled invoice' }
    }

    // Prisma extended where allows filtering by companyId
    await prisma.invoice.updateMany({
      where: { id, companyId },
      data: { status }
    })`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/invoices/[id]/actions.ts', content, 'utf8');

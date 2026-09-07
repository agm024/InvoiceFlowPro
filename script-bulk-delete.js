const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

if (!content.includes('deleteInvoices')) {
  content += `\n
export async function deleteInvoices(ids: string[]) {
  const { requireCompany } = await import('@/lib/auth-context')
  const { requireWriteAccess } = await import('@/lib/auth-context')
  
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  try {
    await prisma.invoice.deleteMany({
      where: {
        id: { in: ids },
        companyId
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to delete invoices', error)
    return { error: 'Failed to delete invoices' }
  }
}
`;
  fs.writeFileSync('app/app/invoices/actions.ts', content, 'utf8');
}

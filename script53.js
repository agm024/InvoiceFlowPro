const fs = require('fs');
function addLimitCheck(filePath, functionName) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const search = `export async function ${functionName}(`;
  
  // Find where the function starts
  const index = content.indexOf(search);
  if (index === -1) return;
  
  // Find where `const { companyId } = await requireCompany()` is inside this function
  const companyIdSearch = `const { companyId } = await requireCompany()`;
  const companyIdIndex = content.indexOf(companyIdSearch, index);
  
  if (companyIdIndex !== -1) {
    const replacement = `const { companyId } = await requireCompany()

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
  }`;

    // Only replace the FIRST occurrence after the function declaration
    content = content.substring(0, companyIdIndex) + 
              content.substring(companyIdIndex).replace(companyIdSearch, replacement);
              
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

addLimitCheck('app/app/estimates/actions.ts', 'convertToInvoice');
addLimitCheck('app/app/invoices/[id]/actions.ts', 'convertToInvoice');

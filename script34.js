const fs = require('fs');
let content = fs.readFileSync('app/app/clients/actions.ts', 'utf8');

const search = `export async function createClient(formData: FormData) {
  const { companyId } = await requireCompany()`;

const replacement = `export async function createClient(formData: FormData) {
  const { companyId } = await requireCompany()

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  if (!company) return { error: "Company not found" }

  if (company.subscription?.plan?.clientLimits) {
    const currentClientCount = await prisma.client.count({
      where: { companyId }
    })
    
    if (currentClientCount >= company.subscription.plan.clientLimits) {
      return { error: \`You have reached your limit of \${company.subscription.plan.clientLimits} clients. Please upgrade your plan.\` }
    }
  }`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/clients/actions.ts', content, 'utf8');

const fs = require('fs');
let content = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');

const search = `export async function inviteTeamMember(email: string, customRoleId: string) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()`;

const replacement = `export async function inviteTeamMember(email: string, customRoleId: string) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  if (!company) return { error: "Company not found" }

  if (company.subscription?.plan?.userLimits) {
    const currentUserCount = await prisma.user.count({ where: { companyId } })
    const pendingInvites = await prisma.invitation.count({ where: { companyId, status: "PENDING" } })
    
    if ((currentUserCount + pendingInvites) >= company.subscription.plan.userLimits) {
      return { error: \`You have reached your limit of \${company.subscription.plan.userLimits} team members. Please upgrade your plan.\` }
    }
  }`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/settings/team-actions.ts', content, 'utf8');

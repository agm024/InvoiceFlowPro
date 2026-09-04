const fs = require('fs');
let content = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');

const newAction = `
export async function updateTeamMemberRole(userId: string, customRoleId: string | null) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  await prisma.user.update({
    where: { id: userId, companyId },
    data: { customRoleId }
  })

  await logAudit({ action: "TEAM_ROLE_UPDATED", targetId: userId, metadata: { customRoleId } })
  revalidatePath("/app/settings")
  return { success: true }
}
`;

content += newAction;
fs.writeFileSync('app/app/settings/team-actions.ts', content, 'utf8');

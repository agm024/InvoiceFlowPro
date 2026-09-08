const fs = require('fs');

let actions = fs.readFileSync('app/app/billing/actions.ts', 'utf8');

if (!actions.includes('downgradeToFree')) {
  actions += `
export async function downgradeToFree() {
  const { companyId } = await requireCompany();
  
  const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
  if (!freePlan) throw new Error("Free plan not found");
  
  await prisma.subscription.update({
    where: { companyId },
    data: { planId: freePlan.id, status: 'active', currentPeriodEnd: null }
  });
  
  revalidatePath('/app/billing');
  return { success: true };
}
`;
  fs.writeFileSync('app/app/billing/actions.ts', actions, 'utf8');
}

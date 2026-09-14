"use server"

import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



export async function cancelSubscription() {
  const { companyId } = await requireCompany()
  
  await prisma.subscription.update({
    where: { companyId },
    data: { status: "canceled" }
  })
  
  revalidatePath('/app/billing')
  redirect('/app/billing')
}

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
export async function adminBypassSubscribe(planId: string, interval: 'month' | 'year') {
  const { companyId, user } = await requireCompany()
  if (!user.isSuperAdmin) {
    throw new Error('Unauthorized: Only Super Admins can bypass billing')
  }

  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  })
  if (!plan) throw new Error("Plan not found");

  const days = interval === 'year' ? 365 : 30;
  
  await prisma.subscription.upsert({
    where: { companyId },
    update: {
      planId,
      status: "active",
      billingInterval: interval,
      currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      rzpSubscriptionId: "bypass_admin_" + Date.now()
    },
    create: {
      companyId,
      planId,
      status: "active",
      billingInterval: interval,
      currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      rzpSubscriptionId: "bypass_admin_" + Date.now()
    }
  });

  revalidatePath('/app/billing')
  return { success: true };
}

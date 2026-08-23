"use server"

import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(planId: string) {
  const { companyId } = await requireCompany()

  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  })

  if (!plan) {
    throw new Error("Plan not found")
  }

  // Here we would normally create a Razorpay checkout session/order
  // For now, let's just simulate subscribing them to the plan.
  
  await prisma.subscription.upsert({
    where: { companyId },
    update: {
      planId,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    create: {
      companyId,
      planId,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })

  revalidatePath('/app/billing')
  redirect('/app/billing')
}

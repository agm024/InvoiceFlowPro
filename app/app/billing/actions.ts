"use server"

import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(planId: string, interval: 'month' | 'year') {
  const { companyId } = await requireCompany()

  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  })

  if (!plan) {
    throw new Error("Plan not found")
  }

  // Here we would normally create a Razorpay checkout session/order
  // For now, let's just simulate subscribing them to the plan.
  const days = interval === 'year' ? 365 : 30;
  
  const sub = await prisma.subscription.upsert({
    where: { companyId },
    update: {
      planId,
      status: "active",
      billingInterval: interval,
      currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    },
    create: {
      companyId,
      planId,
      status: "active",
      billingInterval: interval,
      currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    }
  })

  // SIMULATE PAYMENT FOR SUPER ADMIN STATS
  const amount = interval === 'year' ? plan.yearlyPrice : plan.monthlyPrice;
  if (amount > 0) {
    await prisma.platformPayment.create({
      data: {
        companyId,
        subscriptionId: sub.id,
        originalAmount: amount,
        originalCurrency: plan.currency,
        convertedAmountInr: plan.currency === 'INR' ? amount : amount * 83.5,
        exchangeRate: plan.currency === 'INR' ? 1.0 : 83.5,
        gatewayTransactionId: "pay_" + Math.random().toString(36).substring(2, 9),
        status: "SUCCESS",
      }
    });
  }

  revalidatePath('/app/billing')
  redirect('/app/billing')
}

export async function cancelSubscription() {
  const { companyId } = await requireCompany()
  
  await prisma.subscription.update({
    where: { companyId },
    data: { status: "canceled" }
  })
  
  revalidatePath('/app/billing')
  redirect('/app/billing')
}

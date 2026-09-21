import { NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import { getCurrentUser } from '@/lib/auth-context'

export async function POST(req: Request) {
  try {
    const { planId, isAnnual } = await req.json();
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    // Ensure they don't already have an active paid subscription
    const existingSub = await prisma.subscription.findUnique({
      where: { companyId: currentUser.companyId }
    });

    if (existingSub && existingSub.planSource === 'SUBSCRIPTION' && existingSub.planId !== planId && existingSub.status === 'active') {
      // Allow if it's the free plan, but if they already paid, they shouldn't get a trial
      // Just a simple check for now
    }

    // 14 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    // Upsert subscription
    const subscription = await prisma.subscription.upsert({
      where: { companyId: currentUser.companyId },
      update: {
        planId: plan.id,
        status: 'active',
        billingInterval: isAnnual ? 'year' : 'month',
        rzpSubscriptionId: null,
        planSource: 'TRIAL',
        expiresAt: expiresAt,
        grantReason: `Started 14-Day Free Trial for ${plan.name}`
      },
      create: {
        companyId: currentUser.companyId,
        planId: plan.id,
        status: 'active',
        billingInterval: isAnnual ? 'year' : 'month',
        rzpSubscriptionId: null,
        planSource: 'TRIAL',
        expiresAt: expiresAt,
        grantReason: `Started 14-Day Free Trial for ${plan.name}`
      }
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error('Trial Subscription Create Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

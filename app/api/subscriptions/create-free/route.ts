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

    const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
    if (price !== 0) {
      return NextResponse.json({ error: 'This plan is not free' }, { status: 400 });
    }

    // Upsert subscription
    const subscription = await prisma.subscription.upsert({
      where: { companyId: currentUser.companyId },
      update: {
        planId: plan.id,
        status: 'active',
        billingInterval: isAnnual ? 'year' : 'month',
        rzpSubscriptionId: 'free',
        planSource: 'SUBSCRIPTION',
        currentPeriodEnd: null // Free plans don't really end unless changed
      },
      create: {
        companyId: currentUser.companyId,
        planId: plan.id,
        status: 'active',
        billingInterval: isAnnual ? 'year' : 'month',
        rzpSubscriptionId: 'free',
        planSource: 'SUBSCRIPTION',
        currentPeriodEnd: null
      }
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error('Free Subscription Create Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

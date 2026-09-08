import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import prisma from '@/utils/prisma'
import { getCurrentUser } from '@/lib/auth-context'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { newPlanId, isAnnual } = body;
    
    const currentUser = await getCurrentUser();
    const companyId = currentUser.companyId;

    const subscription = await prisma.subscription.findUnique({ where: { id, companyId } });
    if (!subscription || !subscription.rzpSubscriptionId) {
      return NextResponse.json({ error: 'Valid active subscription not found' }, { status: 404 });
    }

    const newPlan = await prisma.plan.findUnique({ where: { id: newPlanId } });
    if (!newPlan) return NextResponse.json({ error: 'New plan not found' }, { status: 404 });

    const rzpPlanId = isAnnual ? newPlan.rzpPlanIdYearly : newPlan.rzpPlanIdMonthly;
    if (!rzpPlanId) return NextResponse.json({ error: 'Razorpay Plan missing' }, { status: 500 });

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const instance = new Razorpay({ key_id, key_secret });
    
    // Update Razorpay subscription plan
    await instance.subscriptions.update(subscription.rzpSubscriptionId, {
      plan_id: rzpPlanId,
      schedule_change_at: 'now'
    });
    
    // DB updated locally
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { planId: newPlan.id, billingInterval: isAnnual ? 'year' : 'month' }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Subscription PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

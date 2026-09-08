import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import prisma from '@/utils/prisma'
import { getCurrentUser } from '@/lib/auth-context'

export async function POST(req: Request) {
  try {
    const { planId, isAnnual } = await req.json();
    const currentUser = await getCurrentUser();
    const user = { companyId: currentUser.companyId };

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    const rzpPlanId = isAnnual ? plan.rzpPlanIdYearly : plan.rzpPlanIdMonthly;
    if (!rzpPlanId) return NextResponse.json({ error: 'Razorpay plan ID missing' }, { status: 500 });

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) return NextResponse.json({ error: 'Razorpay keys missing' }, { status: 500 });

    const instance = new Razorpay({ key_id, key_secret });
    
    // Create Razorpay Subscription
    // Create a Razorpay Customer first
    const company = await prisma.company.findUnique({ where: { id: user.companyId } });
    let rzpCustomerId = company?.rzpCustomerId;

    if (!rzpCustomerId) {
      const rzpCustomer: any = await instance.customers.create({
        name: currentUser.name || (currentUser.email || 'guest@example.com').split('@')[0],
        email: currentUser.email || 'guest@example.com',
        contact: '9999999999',
        fail_existing: '0' as any
      });
      rzpCustomerId = rzpCustomer.id;
      await prisma.company.update({
        where: { id: user.companyId },
        data: { rzpCustomerId }
      });
    }
    
    // Create Razorpay Subscription
    const subscription = await instance.subscriptions.create({
      plan_id: rzpPlanId,
      total_count: isAnnual ? 10 : 120, // max iterations (e.g., 10 years or 10 years of months)
      customer_notify: 0,
      notes: { companyId: user.companyId }
    });
    
    return NextResponse.json({ subscription, customer_id: rzpCustomerId, user, amount: isAnnual ? plan.yearlyPrice : plan.monthlyPrice });
  } catch (error: any) {
    console.error('Subscription Create Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const amount = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
    if (amount <= 0) return NextResponse.json({ error: 'Free plan does not require payment' }, { status: 400 });

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) return NextResponse.json({ error: 'Razorpay keys missing' }, { status: 500 });

    const instance = new Razorpay({ key_id, key_secret });
    
    // Create Razorpay order
    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: plan.currency,
      receipt: `upgrade_${user.companyId}_${Date.now()}`
    });

    // Create a pending subscription or payment record if needed, but we can also just return the order 
    // and handle the DB update in the verify route.
    
    return NextResponse.json({ order, user, amount });
  } catch (error: any) {
    console.error('Subscription Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

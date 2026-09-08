import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import prisma from '@/utils/prisma'
import { requireSuperAdmin } from '@/lib/auth-context'

export async function POST(req: Request) {
  try {
    await requireSuperAdmin();
    const { id, action } = await req.json();

    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!sub || !sub.rzpSubscriptionId) {
      return NextResponse.json({ error: 'Subscription or Razorpay ID not found' }, { status: 404 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const instance = new Razorpay({ key_id, key_secret });

    if (action === 'pause') {
      await instance.subscriptions.pause(sub.rzpSubscriptionId, { pause_at: 'now' });
      const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
      await prisma.subscription.update({
        where: { id },
        data: { status: 'paused', planId: freePlan?.id || sub.planId }
      });
    } else if (action === 'resume') {
      await instance.subscriptions.resume(sub.rzpSubscriptionId, { resume_at: 'now' });
      await prisma.subscription.update({
        where: { id },
        data: { status: 'active' }
      });
    } else if (action === 'cancel') {
      await instance.subscriptions.cancel(sub.rzpSubscriptionId, false);
      const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
      await prisma.subscription.update({
        where: { id },
        data: { status: 'cancelled', planId: freePlan?.id || sub.planId }
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin Sub Action Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

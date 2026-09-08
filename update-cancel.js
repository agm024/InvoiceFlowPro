const fs = require('fs');

const route = `import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import prisma from '@/utils/prisma'
import { getCurrentUser } from '@/lib/auth-context'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const companyId = currentUser.companyId;

    const subscription = await prisma.subscription.findUnique({ where: { companyId } });
    
    // If they have an active Razorpay mandate, cancel it
    if (subscription && subscription.rzpSubscriptionId) {
      const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;
      const instance = new Razorpay({ key_id, key_secret });
      
      try {
        await instance.subscriptions.cancel(subscription.rzpSubscriptionId);
      } catch (err) {
        console.warn('Failed to cancel on Razorpay (might already be canceled)', err);
      }
    }
    
    // Always Fallback to Free Plan locally
    const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
    if (freePlan && subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { planId: freePlan.id, status: 'canceled', rzpSubscriptionId: null }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Subscription Cancel Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;

fs.writeFileSync('app/api/subscriptions/cancel/route.ts', route, 'utf8');

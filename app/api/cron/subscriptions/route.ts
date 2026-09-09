
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendSubscriptionDowngradedEmail } from '@/app/actions/email';

export async function GET(req: Request) {
  // Vercel Cron Authentication
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    
    // Find all expired active subscriptions
    const expiredSubs = await prisma.subscription.findMany({
      where: {
        status: 'active',
        currentPeriodEnd: { lt: now }
      }
    });

    const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
    if (!freePlan) return NextResponse.json({ error: 'Free plan not found' }, { status: 500 });

    for (const sub of expiredSubs) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'active', planId: freePlan.id } // Downgrade to free
      });
      
      // Ensure company remains active
      await prisma.company.update({
        where: { id: sub.companyId },
        data: { status: 'ACTIVE' }
      });
      
      const owner = await prisma.user.findFirst({ where: { companyId: sub.companyId, role: 'owner' } });
      if (owner) {
        // Yes, this email is delivered automatically right here!
        await sendSubscriptionDowngradedEmail(owner.email, owner.name || 'Admin');
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: expiredSubs.length 
    });
  } catch (error) {
    console.error('Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

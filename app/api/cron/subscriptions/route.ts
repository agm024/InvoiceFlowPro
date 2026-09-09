
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendSubscriptionSuspendedEmail } from '@/app/actions/email';

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

    for (const sub of expiredSubs) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'expired' }
      });
      // Also suspend the company to restrict access
      await prisma.company.update({
        where: { id: sub.companyId },
        data: { status: 'SUSPENDED' }
      });
      
      const owner = await prisma.user.findFirst({ where: { companyId: sub.companyId, role: 'owner' } });
      if (owner) {
        await sendSubscriptionSuspendedEmail(owner.email, owner.name || 'Admin');
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

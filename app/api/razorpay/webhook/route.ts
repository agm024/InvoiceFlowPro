import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/utils/prisma'

export async function POST(req: Request) {
  try {
    const textBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!secret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    const expectedSignature = crypto.createHmac('sha256', secret).update(textBody).digest('hex');
    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    
    const event = JSON.parse(textBody)
    const eventId = req.headers.get('x-razorpay-event-id') || event.id || `webhook_${Date.now()}`;

    // Idempotency check: prevent duplicate webhooks from double-crediting
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId }
    });
    if (existingEvent) {
      return NextResponse.json({ success: true, message: 'Event already processed' });
    }

    try {
      await prisma.webhookEvent.create({
        data: {
          eventId,
          type: event.event
        }
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        console.log(`Webhook ${eventId} already processed, skipping gracefully.`);
        return NextResponse.json({ status: 'ok', msg: 'Already processed' })
      }
      throw e;
    }


    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id

      if (orderId) {
        const invoice = await prisma.invoice.findFirst({
          where: { razorpayOrderId: orderId }
        })

        if (invoice) {
          // Update Invoice to PAID
          await prisma.$transaction(async (tx) => {
          await tx.invoice.update({
            where: { id: invoice.id },
            data: {
              status: 'paid',
              paymentId: payment.id,
              amountPaid: payment.amount / 100,
              paymentMethod: 'Razorpay'
            }
          });

          if (invoice.invoiceType === 'MILESTONE') {
            await tx.milestone.updateMany({
              where: { invoiceId: invoice.id },
              data: { status: 'PAID' }
            });
          }
        });
        }
      }
    }

    
    if (event.event === 'subscription.charged') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;

      if (companyId) {
        const subscription = await prisma.subscription.findUnique({ where: { companyId } });
        if (subscription) {
          // Extend by 1 month or year based on billingInterval
          const interval = subscription.billingInterval === 'year' ? 365 : 30;
          const currentEnd = subscription.currentPeriodEnd && subscription.currentPeriodEnd > new Date() 
            ? subscription.currentPeriodEnd 
            : new Date();
          const nextEnd = new Date(currentEnd.getTime() + interval * 24 * 60 * 60 * 1000);

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { currentPeriodEnd: nextEnd, status: 'active' }
          });
          
          await prisma.platformPayment.create({
            data: {
              subscriptionId: subscription.id,
              originalAmount: event.payload.payment.entity.amount / 100,
              convertedAmountInr: event.payload.payment.entity.amount / 100,
              companyId: companyId,
              originalCurrency: event.payload.payment.entity.currency,
              status: 'COMPLETED',
              gatewayTransactionId: event.payload.payment.entity.id
            }
          });
        }
      }
    }

    
    if (event.event === 'subscription.paused') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;
      if (companyId) {
        const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
        if (freePlan) {
          await prisma.subscription.update({
            where: { companyId },
            data: { status: 'paused', planId: freePlan.id }
          });
        }
      }
    }

    if (event.event === 'subscription.resumed') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;
      if (companyId) {
        // Find original plan from Razorpay payload
        const rzpPlanId = subEntity.plan_id;
        const originalPlan = await prisma.plan.findFirst({
          where: { OR: [{ rzpPlanIdMonthly: rzpPlanId }, { rzpPlanIdYearly: rzpPlanId }] }
        });
        
        await prisma.subscription.update({
          where: { companyId },
          data: { 
            status: 'active', 
            ...(originalPlan ? { planId: originalPlan.id } : {})
          }
        });
      }
    }

    if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;

      if (companyId) {
        // Fallback to free plan logic (or mark status as past_due / cancelled)
        const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
        if (freePlan) {
          await prisma.subscription.update({
            where: { companyId },
            data: { planId: freePlan.id, status: event.event === 'subscription.cancelled' ? 'cancelled' : 'past_due' }
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

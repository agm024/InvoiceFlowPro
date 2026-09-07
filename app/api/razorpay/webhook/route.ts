import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/utils/prisma'

export async function POST(req: Request) {
  try {
    const textBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!secret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not set, accepting webhook without validation (UNSAFE)')
    } else if (signature) {
      const expectedSignature = crypto.createHmac('sha256', secret).update(textBody).digest('hex')
      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
    }

    const event = JSON.parse(textBody)

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id

      if (orderId) {
        const invoice = await prisma.invoice.findFirst({
          where: { razorpayOrderId: orderId }
        })

        if (invoice) {
          // Update Invoice to PAID
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              status: 'paid',
              paymentId: payment.id,
              amountPaid: payment.amount / 100, // Convert paise back to standard
              paymentMethod: 'Razorpay'
            }
          })
          
          // Try to update milestone if attached
          if (invoice.invoiceType === 'MILESTONE') {
            await prisma.milestone.updateMany({
              where: { invoiceId: invoice.id },
              data: { status: 'PAID' }
            })
          }
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

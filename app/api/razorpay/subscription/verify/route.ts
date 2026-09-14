import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/utils/prisma'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, isAnnual, companyId, amount, currency } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const rzp = new (require('razorpay'))({ key_id, key_secret });
    const rzpOrder = await rzp.orders.fetch(razorpay_order_id);
    if (!rzpOrder || rzpOrder.receipt !== `upgrade_${companyId}_${rzpOrder.receipt?.split('_').pop()}`) {
      // Actually `receipt` in order creation was `upgrade_${user.companyId}_${Date.now()}`
      if (!rzpOrder?.receipt?.startsWith(`upgrade_${companyId}_`)) {
        return NextResponse.json({ error: 'Order mismatch' }, { status: 400 });
      }
    }


    // Success! Update the subscription
    let subscription = await prisma.subscription.findUnique({
      where: { companyId }
    });

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          companyId,
          planId,
          status: 'active',
          billingInterval: isAnnual ? 'year' : 'month'
        }
      });
    } else {
      subscription = await prisma.subscription.update({
        where: { companyId },
        data: {
          planId,
          status: 'active',
          billingInterval: isAnnual ? 'year' : 'month'
        }
      });
    }

    // Set validity period
    const periodEnd = new Date();
    if (isAnnual) periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    else periodEnd.setMonth(periodEnd.getMonth() + 1);

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { currentPeriodEnd: periodEnd }
    });

    // Log the payment
    await prisma.platformPayment.create({
      data: {
        subscriptionId: subscription.id,
        companyId,
        originalAmount: amount,
        originalCurrency: currency,
        convertedAmountInr: amount,
        gatewayTransactionId: razorpay_payment_id,
        status: 'SUCCESS'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Subscription Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

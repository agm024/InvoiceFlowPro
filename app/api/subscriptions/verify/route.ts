import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/utils/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_subscription_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      planId, 
      isAnnual, 
      companyId, 
      amount, 
      currency 
    } = body;

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !key_id) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_payment_id + '|' + razorpay_subscription_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Verify against Razorpay
    const rzp = new (require('razorpay'))({ key_id, key_secret: secret });
    const rzpSub = await rzp.subscriptions.fetch(razorpay_subscription_id);
    if (!rzpSub || rzpSub.notes?.companyId !== companyId) {
      return NextResponse.json({ error: 'Subscription mismatch' }, { status: 400 });
    }


    const days = isAnnual ? 365 : 30;

    const sub = await prisma.subscription.upsert({
      where: { companyId },
      update: {
        planId,
        status: "active",
        billingInterval: isAnnual ? 'year' : 'month',
        currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        rzpSubscriptionId: razorpay_subscription_id
      },
      create: {
        companyId,
        planId,
        status: "active",
        billingInterval: isAnnual ? 'year' : 'month',
        currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        rzpSubscriptionId: razorpay_subscription_id
      }
    });

    await prisma.platformPayment.create({
      data: {
        companyId,
        subscriptionId: sub.id,
        originalAmount: amount,
        originalCurrency: currency,
        convertedAmountInr: currency === 'INR' ? amount : amount * 83.5,
        exchangeRate: currency === 'INR' ? 1.0 : 83.5,
        gatewayTransactionId: razorpay_payment_id,
        status: "SUCCESS",
      }
    });

    return NextResponse.json({ success: true, subscription: sub });
  } catch (error: any) {
    console.error('Subscription Verify Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

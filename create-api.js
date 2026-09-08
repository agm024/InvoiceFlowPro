const fs = require('fs');
const path = require('path');

const mkdirP = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

mkdirP('app/api/razorpay/subscription/order');
mkdirP('app/api/razorpay/subscription/verify');

const orderRoute = `import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import prisma from '@/utils/prisma'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { planId, isAnnual } = await req.json();
    const token = (await cookies()).get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { sessions: { some: { token } } },
      include: { company: true }
    });

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
      receipt: \`upgrade_\${user.companyId}_\${Date.now()}\`
    });

    // Create a pending subscription or payment record if needed, but we can also just return the order 
    // and handle the DB update in the verify route.
    
    return NextResponse.json({ order, user, amount });
  } catch (error: any) {
    console.error('Subscription Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;

const verifyRoute = `import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/utils/prisma'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, isAnnual, companyId, amount, currency } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
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
`;

fs.writeFileSync('app/api/razorpay/subscription/order/route.ts', orderRoute);
fs.writeFileSync('app/api/razorpay/subscription/verify/route.ts', verifyRoute);
console.log('Created subscription APIs.');

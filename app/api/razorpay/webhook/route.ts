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

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

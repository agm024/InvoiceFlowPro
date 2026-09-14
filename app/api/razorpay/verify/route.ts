import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/utils/prisma'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = await req.json()
    const secret = process.env.RAZORPAY_KEY_SECRET

    if (!secret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Verify invoice order ID matches
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    if (invoice.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json({ error: 'Order ID mismatch' }, { status: 400 })
    }

    // Mark invoice as paid
    const amountPaid = invoice.total // We could verify amount against Razorpay API here if needed
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'paid',
        paymentId: razorpay_payment_id,
        amountPaid: amountPaid,
        paymentMethod: 'Razorpay'
      }
    })

      if (invoice.invoiceType === 'MILESTONE') {
        await prisma.milestone.updateMany({
          where: { invoiceId: invoice.id },
          data: { status: 'PAID' }
        })
      }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}

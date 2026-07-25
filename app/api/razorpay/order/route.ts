import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import prisma from '@/utils/prisma'

export async function POST(req: Request) {
  try {
    const { invoiceId, amount } = await req.json()
    if (!invoiceId) return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 })

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true }
    })

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    const amountDue = invoice.total - (invoice.amountPaid || 0)
    if (amountDue <= 0 || invoice.status === 'paid') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 })
    }
    
    // Use requested amount for partial payment, bounded by amountDue
    const finalAmount = amount && amount > 0 && amount <= amountDue ? amount : amountDue;

    // Check if keys are set
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_id || !key_secret) {
      // Return a mock order if no keys are provided (for demonstration purposes)
      return NextResponse.json({
        id: `mock_order_${Date.now()}`,
        currency: invoice.currency,
        amount: Math.round(finalAmount * 100),
        mock: true
      })
    }

    const instance = new Razorpay({ key_id, key_secret })

    const options = {
      amount: Math.round(finalAmount * 100), // amount in smallest currency unit (paise)
      currency: invoice.currency,
      receipt: invoice.invoiceNumber,
    }

    const order = await instance.orders.create(options)

    // Save razorpayOrderId to Invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { razorpayOrderId: order.id }
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Razorpay Order Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

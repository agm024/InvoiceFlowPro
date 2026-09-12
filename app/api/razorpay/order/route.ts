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

    const companySettings = await prisma.companySettings.findUnique({
      where: { companyId: invoice.companyId }
    })

    if (!companySettings?.razorpayAccountId) {
      return NextResponse.json({ error: 'Payment gateway not configured by the merchant' }, { status: 400 })
    }

    const clientId = process.env.RAZORPAY_CLIENT_ID
    const clientSecret = process.env.RAZORPAY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Platform gateway keys not configured' }, { status: 500 })
    }

    // Create order directly on connected account via Razorpay API (with X-Razorpay-Account header)
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
        'X-Razorpay-Account': companySettings.razorpayAccountId
      },
      body: JSON.stringify({
        amount: Math.round(finalAmount * 100),
        currency: invoice.currency,
        receipt: invoice.invoiceNumber
      })
    })

    const order = await response.json()

    if (!response.ok) {
      console.error('Razorpay Order Error:', order)
      throw new Error(order.error?.description || 'Failed to create order on connected account')
    }

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

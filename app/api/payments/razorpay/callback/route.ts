import { NextResponse } from 'next/navigation'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/app/settings?tab=payment-gateways&error=auth_failed', request.url))
  }

  const clientId = process.env.RAZORPAY_CLIENT_ID || ''
  const clientSecret = process.env.RAZORPAY_CLIENT_SECRET || ''
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://flow.siteradiant.co.in'}/api/payments/razorpay/callback`

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://api.razorpay.com/o/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code
      })
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.razorpay_account_id) {
      console.error('Razorpay OAuth Error:', tokenData)
      return NextResponse.redirect(new URL('/app/settings?tab=payment-gateways&error=exchange_failed', request.url))
    }

    // Get company ID for the user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { companyId: true }
    })

    if (user?.companyId) {
      await prisma.companySettings.upsert({
        where: { companyId: user.companyId },
        update: {
          razorpayAccountId: tokenData.razorpay_account_id,
          razorpayConnectedAt: new Date()
        },
        create: {
          companyId: user.companyId,
          razorpayAccountId: tokenData.razorpay_account_id,
          razorpayConnectedAt: new Date()
        }
      })
    }

    return NextResponse.redirect(new URL('/app/settings?tab=payment-gateways&success=connected', request.url))
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.redirect(new URL('/app/settings?tab=payment-gateways&error=server_error', request.url))
  }
}

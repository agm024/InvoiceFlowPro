import { NextResponse } from 'next/navigation'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientId = process.env.RAZORPAY_CLIENT_ID || ''
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://flow.siteradiant.co.in'}/api/payments/razorpay/callback`
  const state = session.user.id // use user id as state to verify callback, or just use it to track session

  const authUrl = `https://auth.razorpay.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=read_write`

  return NextResponse.redirect(authUrl)
}

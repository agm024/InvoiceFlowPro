import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { companyId: true }
    })

    if (!user?.companyId) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    await prisma.companySettings.update({
      where: { companyId: user.companyId },
      data: {
        razorpayAccountId: null,
        razorpayConnectedAt: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
  }
}

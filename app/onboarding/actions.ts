'use server'

import prisma from '@/utils/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function completeGoogleOnboardingAction(data: any) {
  const session = await auth()
  
  if (!session || !session.user || !session.user.email) {
    return { error: 'Not authenticated' }
  }

  const { companyName, businessType, country, gstin, pan, address, city, state } = data

  if (!companyName) {
    return { error: 'Company Name is required' }
  }

  const userEmail = session.user.email
  const userName = session.user.name || session.user.email.split('@')[0]

  const existingUser = await prisma.user.findUnique({ where: { email: userEmail } })
  if (existingUser) {
    return { error: 'User is already fully registered' }
  }

  await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: { 
        name: companyName,
        businessType: businessType || null,
        country: country || 'India',
        gstin: gstin || null,
        pan: pan || null,
        address: address || null,
        city: city || null,
        state: state || null,
      }
    })

    await tx.companySettings.create({
      data: {
        companyId: company.id,
        companyName: company.name,
        businessType: company.businessType,
        gstin: company.gstin,
        panNo: company.pan,
        address: company.address,
        upiId: 'demo@upi'
      }
    })

    await tx.user.create({
      data: {
        name: userName,
        email: userEmail,
        companyId: company.id,
        role: 'admin',
        isSuperAdmin: false
      }
    })
  })

  return { success: true }
}

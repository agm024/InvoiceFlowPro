'use server'

import prisma from '@/utils/prisma'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function signUpAction(data: any) {
  const { name, email, password, companyName, businessType, country, gstin, pan, address, city, state } = data

  if (!companyName || !name || !email || !password) {
    return { error: 'Required fields missing' }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { error: 'Email is already registered' }
  }

  const passwordHash = await bcrypt.hash(password, 10)

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
        name,
        email,
        passwordHash,
        companyId: company.id,
        role: 'admin',
        isSuperAdmin: false
      }
    })
  })

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/app'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Something went wrong during sign-in.' }
    }
    // Re-throw redirect error
    throw error
  }
}

import { cookies } from 'next/headers'

export async function signUpWithGoogleAction() {
  const cookieStore = await cookies()
  cookieStore.set('isSignUp', 'true', { 
    maxAge: 120,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
  await signIn('google', { redirectTo: '/app' })
}

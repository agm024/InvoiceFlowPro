'use server'

import prisma from '@/utils/prisma'
import { sendEmail } from '@/app/actions/email'
import crypto from 'crypto'

export async function sendOtpAction(email: string, name?: string) {
  if (!email || !email.includes('@')) return { error: 'Invalid email' }
  
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) return { error: 'Email is already registered' }

  // Clean old OTPs
  await prisma.verificationToken.deleteMany({
    where: { email }
  })

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  await prisma.verificationToken.create({
    data: {
      email,
      token: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    }
  })

  // Send email
  const clientName = name || email.split('@')[0];
  const html = `
    <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #18181b; padding: 32px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">InvoiceFlowPro</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #18181b; margin-top: 0; font-size: 20px; font-weight: 600;">Hello ${clientName},</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for choosing InvoiceFlowPro! Please use the following 6-digit verification code to complete your secure sign-up process:
          </p>
          <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; margin-bottom: 32px; text-align: center;">
            <h1 style="letter-spacing: 12px; font-size: 36px; font-weight: 800; color: #18181b; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #52525b; font-size: 14px; line-height: 1.6; margin-bottom: 8px;">
            This verification code will expire securely in 10 minutes. 
          </p>
          <p style="color: #71717a; font-size: 13px;">
            If you did not request this email, you can safely ignore it.
          </p>
        </div>
        <div style="background-color: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
          <p style="color: #a1a1aa; font-size: 13px; margin: 0;">InvoiceFlowPro by SiteRadiant</p>
        </div>
      </div>
    </div>
  `

  await sendEmail({
    to: email,
    toName: clientName,
    subject: "Your InvoiceFlowPro Verification Code",
    html
  })

  return { success: true }
}

export async function verifyOtpAction(email: string, otp: string) {
  const tokenRecord = await prisma.verificationToken.findFirst({
    where: { email, token: otp }
  })

  if (!tokenRecord) return { error: 'Invalid verification code' }
  if (tokenRecord.expiresAt < new Date()) return { error: 'Verification code expired' }

  // We keep it in DB for the final step to re-verify if needed, or we just trust the client state.
  // Actually, we can just delete it now and return success.
  await prisma.verificationToken.delete({ where: { id: tokenRecord.id } })

  return { success: true }
}

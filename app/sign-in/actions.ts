'use server'

import { checkRateLimit, clearRateLimit } from '@/lib/rate-limit'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import prisma from '@/utils/prisma'

export async function signInAction(formData: FormData) {
  const rl = await checkRateLimit('signin', 5, 5 * 60 * 1000); // 5 attempts per 5 mins
  if (!rl.success) return { error: `Too many login attempts. Try again in ${rl.resetInSeconds} seconds.` };

  const email = formData.get('email') as string
  let redirectTo = '/app'
  
  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    // Send everyone to /app initially. They can navigate to /app/admin manually if they are a Super Admin.
    redirectTo = '/app'
  }

  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' }
        default:
          return { error: 'Something went wrong.' }
      }
    }
    throw error
  }
}

export async function signInWithGoogleAction() {
  const rl = await checkRateLimit('signin-google', 10, 5 * 60 * 1000);
  if (!rl.success) throw new Error(`Too many login attempts. Try again in ${rl.resetInSeconds} seconds.`);

  await signIn('google', { redirectTo: '/app' })
}
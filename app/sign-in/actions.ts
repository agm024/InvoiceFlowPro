'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import prisma from '@/utils/prisma'

export async function signInAction(formData: FormData) {
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

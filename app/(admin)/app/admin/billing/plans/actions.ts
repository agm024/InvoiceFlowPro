'use server'

import prisma from '@/utils/prisma'
import { requireSuperAdmin } from '@/lib/auth-context'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPlan(formData: FormData) {
  await requireSuperAdmin()
  
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const currency = formData.get('currency') as string
  const interval = formData.get('interval') as string

  if (!name || isNaN(price)) {
    throw new Error('Invalid plan details')
  }

  await prisma.plan.create({
    data: {
      name,
      price,
      currency: currency || 'USD',
      interval: interval || 'month'
    }
  })

  revalidatePath('/app/admin/billing/plans')
  redirect('/app/admin/billing/plans')
}

export async function deletePlan(id: string) {
  await requireSuperAdmin()
  await prisma.plan.delete({ where: { id } })
  revalidatePath('/app/admin/billing/plans')
}

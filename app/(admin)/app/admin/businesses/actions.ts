'use server'

import prisma from '@/utils/prisma'
import { requireSuperAdmin } from '@/lib/auth-context'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCompany(formData: FormData) {
  await requireSuperAdmin()
  
  const name = formData.get('name') as string

  if (!name) {
    throw new Error('Company name is required')
  }

  const company = await prisma.company.create({
    data: { name }
  })

  await logAudit({
    action: 'COMPANY_CREATED',
    companyId: company.id,
    metadata: { name: company.name }
  })

  revalidatePath('/app/admin/businesses')
  redirect('/app/admin/businesses')
}

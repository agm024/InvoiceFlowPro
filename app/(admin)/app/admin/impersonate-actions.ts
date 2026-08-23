'use server'

import { requireSuperAdmin } from '@/lib/auth-context'
import { logAudit } from '@/lib/audit'
import prisma from '@/utils/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function impersonateCompany(companyId: string) {
  const admin = await requireSuperAdmin()
  
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { supportAccessGranted: true }
  })

  if (!company?.supportAccessGranted) {
    throw new Error('This company has not granted support access.')
  }

  await logAudit({
    action: 'IMPERSONATE_COMPANY_START',
    companyId,
    metadata: { reason: 'Support request' }
  })

  const cookieStore = await cookies()
  cookieStore.set('impersonatedCompanyId', companyId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  redirect('/app')
}

export async function stopImpersonation() {
  const admin = await requireSuperAdmin()
  const cookieStore = await cookies()
  const impersonatedId = cookieStore.get('impersonatedCompanyId')?.value
  
  if (impersonatedId) {
    await logAudit({
      action: 'IMPERSONATE_COMPANY_STOP',
      companyId: impersonatedId
    })
    cookieStore.delete('impersonatedCompanyId')
  }

  redirect('/app/admin/businesses')
}

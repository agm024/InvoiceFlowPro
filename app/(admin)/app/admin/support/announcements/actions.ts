'use server'

import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(formData: FormData) {
  await requireSuperAdmin()
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const target = formData.get('target') as string
  const published = formData.get('published') === 'on'

  if (title && content) {
    await prisma.announcement.create({
      data: {
        title,
        content,
        target: target || 'ALL',
        published
      }
    })
    revalidatePath('/app/admin/support/announcements')
  }
}

export async function deleteAnnouncement(formData: FormData) {
  await requireSuperAdmin()
  const id = formData.get('id') as string
  if (id) {
    await prisma.announcement.delete({ where: { id } })
    revalidatePath('/app/admin/support/announcements')
  }
}

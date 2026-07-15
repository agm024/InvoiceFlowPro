'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function updateInvoiceStatus(id: string, status: string) {
  try {
    await prisma.invoice.update({
      where: { id },
      data: { status }
    })
    revalidatePath(`/invoices/${id}`)
    revalidatePath('/invoices')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to update invoice status:', error)
    return { error: 'Failed to update status' }
  }
}

export async function getInvoiceDetails(id: string) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      bank: true,
      items: {
        include: { product: true }
      }
    }
  })
}

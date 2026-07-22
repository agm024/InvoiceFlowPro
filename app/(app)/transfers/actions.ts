'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function createTransfer(formData: FormData) {
  const fromBankId = formData.get('fromBankId') as string
  const toBankId = formData.get('toBankId') as string
  const amount = parseFloat(formData.get('amount') as string)
  const dateStr = formData.get('date') as string
  const reference = formData.get('reference') as string || null
  const notes = formData.get('notes') as string || null

  if (!fromBankId || !toBankId || isNaN(amount) || amount <= 0) {
    return { error: 'Invalid input parameters' }
  }

  if (fromBankId === toBankId) {
    return { error: 'Cannot transfer to the same bank account' }
  }

  try {
    await prisma.internalTransfer.create({
      data: {
        fromBankId,
        toBankId,
        amount,
        date: dateStr ? new Date(dateStr) : new Date(),
        reference,
        notes
      }
    })
    revalidatePath('/transfers')
    return { success: true }
  } catch (error) {
    console.error('Failed to log transfer:', error)
    return { error: 'Failed to log transfer' }
  }
}

export async function deleteTransfer(id: string) {
  try {
    await prisma.internalTransfer.delete({ where: { id } })
    revalidatePath('/transfers')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete' }
  }
}

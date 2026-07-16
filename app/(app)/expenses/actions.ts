'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  return await prisma.expense.findMany({
    orderBy: { date: 'desc' }
  })
}

export async function createExpense(formData: FormData) {
  const vendorName = formData.get('vendorName') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const totalAmount = parseFloat(formData.get('totalAmount') as string)
  const taxAmount = parseFloat(formData.get('taxAmount') as string)
  const isRcm = formData.get('isRcm') === 'on'
  const itcEligible = formData.get('itcEligible') === 'on'
  const dateStr = formData.get('date') as string

  try {
    await prisma.expense.create({
      data: {
        vendorName,
        category,
        description,
        totalAmount,
        taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
        isRcm,
        itcEligible,
        date: dateStr ? new Date(dateStr) : new Date()
      }
    })
    revalidatePath('/expenses')
    return { success: true }
  } catch (error) {
    console.error('Failed to create expense:', error)
    return { error: 'Failed to log expense' }
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({ where: { id } })
    revalidatePath('/expenses')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete' }
  }
}

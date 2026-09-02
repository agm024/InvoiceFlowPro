'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { requireCompany } from '@/lib/auth-context'

export async function getExpenses() {
  const { companyId } = await requireCompany()
  return await prisma.expense.findMany({
    where: { companyId },
    orderBy: { date: 'desc' }
  })
}

export async function createExpense(formData: FormData) {
  const { companyId } = await requireCompany()
  const vendorName = formData.get('vendorName') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const subTotal = parseFloat(formData.get('subTotal') as string)
  const taxRate = parseFloat(formData.get('taxRate') as string)
  const totalAmount = parseFloat(formData.get('totalAmount') as string)
  const taxAmount = parseFloat(formData.get('taxAmount') as string)
  const isRcm = formData.get('isRcm') === 'on'
  const itcEligible = formData.get('itcEligible') === 'on'
  const dateStr = formData.get('date') as string
  const bankId = formData.get('bankId') as string

  try {
    await prisma.expense.create({
      data: {
        companyId,
        vendorName,
        category,
        description,
        subTotal: isNaN(subTotal) ? totalAmount : subTotal,
        taxRate: isNaN(taxRate) ? 0 : taxRate,
        totalAmount,
        taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
        isRcm,
        itcEligible,
        date: dateStr ? new Date(dateStr) : new Date(),
        bankId: bankId || null
      }
    })
    revalidatePath('/app/expenses')
    return { success: true }
  } catch (error) {
    console.error('Failed to create expense:', error)
    return { error: 'Failed to log expense' }
  }
}

export async function updateExpense(id: string, formData: FormData) {
  const { companyId } = await requireCompany()
  const vendorName = formData.get('vendorName') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const subTotal = parseFloat(formData.get('subTotal') as string)
  const taxRate = parseFloat(formData.get('taxRate') as string)
  const totalAmount = parseFloat(formData.get('totalAmount') as string)
  const taxAmount = parseFloat(formData.get('taxAmount') as string)
  const isRcm = formData.get('isRcm') === 'on'
  const itcEligible = formData.get('itcEligible') === 'on'
  const dateStr = formData.get('date') as string
  const bankId = formData.get('bankId') as string

  try {
    await prisma.expense.update({
      where: { id, companyId },
      data: {
        vendorName,
        category,
        description,
        subTotal: isNaN(subTotal) ? totalAmount : subTotal,
        taxRate: isNaN(taxRate) ? 0 : taxRate,
        totalAmount,
        taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
        isRcm,
        itcEligible,
        date: dateStr ? new Date(dateStr) : new Date(),
        bankId: bankId || null
      }
    })
    revalidatePath('/app/expenses')
    return { success: true }
  } catch (error) {
    console.error('Failed to update expense:', error)
    return { error: 'Failed to update expense' }
  }
}

export async function deleteExpense(id: string) {
  const { companyId } = await requireCompany()
  try {
    await prisma.expense.delete({ where: { id, companyId } })
    revalidatePath('/app/expenses')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete' }
  }
}

'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      invoiceItems: {
        include: {
          invoice: {
            include: { client: true }
          }
        }
      }
    }
  })
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const hsn = formData.get('hsn') as string
  const price = parseFloat(formData.get('price') as string)
  const gstRate = parseFloat(formData.get('gstRate') as string) || 0
  const discount = parseFloat(formData.get('discount') as string) || 0

  if (!name || isNaN(price)) return { error: 'Name and valid price are required' }

  try {
    const product = await prisma.product.create({
      data: { name, description, hsn, price, gstRate, discount }
    })
    revalidatePath('/products')
    return { success: true, product }
  } catch (error) {
    console.error('Failed to create product:', error)
    return { error: 'Failed to create product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { error: 'Failed to delete product' }
  }
}

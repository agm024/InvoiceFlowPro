'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/utils/slugify'

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

async function generateUniqueSlug(name: string, model: any, existingId?: string) {
  const baseSlug = slugify(name) || 'product'
  let slug = baseSlug
  let count = 1
  while (true) {
    const existing = await model.findUnique({ where: { slug } })
    if (!existing || existing.id === existingId) break
    slug = `${baseSlug}-${count}`
    count++
  }
  return slug
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const hsn = formData.get('hsn') as string
  const price = parseFloat(formData.get('price') as string)
  const purchasePrice = parseFloat(formData.get('purchasePrice') as string) || 0
  const gstRate = parseFloat(formData.get('gstRate') as string) || 0
  const discount = parseFloat(formData.get('discount') as string) || 0
  const unit = formData.get('unit') as string || null
  const taxInclusive = formData.get('taxInclusive') === 'true'

  if (!name || isNaN(price)) return { error: 'Name and valid price are required' }

  const slug = await generateUniqueSlug(name, prisma.product)

  try {
    const product = await prisma.product.create({
      data: { name, slug, description, hsn, price, purchasePrice, gstRate, discount, unit, taxInclusive }
    })
    revalidatePath('/products')
    return { success: true, product }
  } catch (error) {
    console.error('Failed to create product:', error)
    return { error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const hsn = formData.get('hsn') as string
  const price = parseFloat(formData.get('price') as string)
  const purchasePrice = parseFloat(formData.get('purchasePrice') as string) || 0
  const gstRate = parseFloat(formData.get('gstRate') as string) || 0
  const discount = parseFloat(formData.get('discount') as string) || 0
  const unit = formData.get('unit') as string || null
  const taxInclusive = formData.get('taxInclusive') === 'true'

  if (!name || isNaN(price)) return { error: 'Name and valid price are required' }

  const slug = await generateUniqueSlug(name, prisma.product, id)

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name, slug, description, hsn, price, purchasePrice, gstRate, discount, unit, taxInclusive }
    })
    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { success: true, product }
  } catch (error) {
    console.error('Failed to update product:', error)
    return { error: 'Failed to update product' }
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

'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/utils/slugify'
import { requireCompany } from '@/lib/auth-context'

export async function getProducts() {
  const { companyId } = await requireCompany()
  return await prisma.product.findMany({
    where: { companyId, isHidden: false },
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

async function generateUniqueSlug(name: string, model: any, companyId: string, existingId?: string) {
  const baseSlug = slugify(name) || 'product'
  let slug = baseSlug
  let count = 1
  while (true) {
    const existing = await model.findFirst({ where: { slug, companyId } })
    if (!existing || existing.id === existingId) break
    slug = `${baseSlug}-${count}`
    count++
  }
  return slug
}

export async function createProduct(formData: FormData) {
  const { companyId } = await requireCompany()
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

  const slug = await generateUniqueSlug(name, prisma.product, companyId)

  try {
    const product = await prisma.product.create({
      data: { companyId, name, slug, description, hsn, price, purchasePrice, gstRate, discount, unit, taxInclusive }
    })
    revalidatePath('/app/products')
    return { success: true, product }
  } catch (error) {
    console.error('Failed to create product:', error)
    return { error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const { companyId } = await requireCompany()
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

  const slug = await generateUniqueSlug(name, prisma.product, companyId, id)

  try {
    const product = await prisma.product.update({
      where: { id, companyId },
      data: { name, slug, description, hsn, price, purchasePrice, gstRate, discount, unit, taxInclusive }
    })
    revalidatePath('/app/products')
    revalidatePath(`/app/products/${id}`)
    return { success: true, product }
  } catch (error) {
    console.error('Failed to update product:', error)
    return { error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  const { companyId } = await requireCompany()
  try {
    await prisma.product.delete({ where: { id, companyId } })
    revalidatePath('/app/products')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { error: 'Failed to delete product' }
  }
}

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
  const category = (formData.get('category') as string) || null
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
      data: { companyId, name, category, slug, description, hsn, price, purchasePrice, gstRate, discount, unit, taxInclusive }
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
  const category = (formData.get('category') as string) || null
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

  const updateDrafts = formData.get('updateDrafts') === 'true'

  try {
    const product = await prisma.product.update({
      where: { id, companyId },
      data: { name, category, slug, description, hsn, price, purchasePrice, gstRate, discount, unit, taxInclusive }
    })
    
    if (updateDrafts) {
      // Find and update items in draft invoices/estimates
      const drafts = await prisma.invoice.findMany({
        where: { status: 'draft', companyId, items: { some: { productId: id } } },
        include: { items: { include: { product: true } } }
      })
      
      for (const inv of drafts) {
        // 1. Calculate base subtotal
        let rawSubTotal = 0
        const itemBases = inv.items.map(item => {
          if (item.productId === id) {
            // The updated product
            let totalWithoutTax = price * item.quantity
            if (taxInclusive) {
              totalWithoutTax = (price * item.quantity * 100) / (100 + gstRate)
            }
            rawSubTotal += totalWithoutTax
            return { ...item, _totalWithoutTax: totalWithoutTax, _gstRate: gstRate, _taxInclusive: taxInclusive, _price: price }
          } else {
            // Other products
            let totalWithoutTax = item.price * item.quantity
            if (item.product?.taxInclusive) {
              totalWithoutTax = (item.price * item.quantity * 100) / (100 + (item.product.gstRate || 0))
            }
            rawSubTotal += totalWithoutTax
            return { ...item, _totalWithoutTax: totalWithoutTax, _gstRate: item.product?.gstRate || 0, _taxInclusive: item.product?.taxInclusive || false, _price: item.price }
          }
        })

        // 2. Calculate invoice discount
        let discountAmount = 0
        if (inv.discountType === 'FLAT') {
          discountAmount = inv.discountValue
        } else if (inv.discountType === 'PERCENTAGE') {
          discountAmount = rawSubTotal * (inv.discountValue / 100)
        }

        const discountRatio = rawSubTotal > 0 ? discountAmount / rawSubTotal : 0

        // 3. Apply prorated tax and update items
        let newTaxTotal = 0
        for (const item of itemBases) {
          const itemDiscount = item._totalWithoutTax * discountRatio
          const itemDiscountedBase = item._totalWithoutTax - itemDiscount
          const taxAmount = itemDiscountedBase * (item._gstRate / 100)
          
          newTaxTotal += taxAmount

          if (item.productId === id) {
            const itemPrice = item._taxInclusive ? Number((item._totalWithoutTax / item.quantity).toFixed(2)) : item._price
            await prisma.invoiceItem.update({
              where: { id: item.id },
              data: { price: itemPrice, tax: taxAmount }
            })
          } else {
            // Update tax on other items too, in case invoice discount ratio changed due to this product price change!
            await prisma.invoiceItem.update({
              where: { id: item.id },
              data: { tax: taxAmount }
            })
          }
        }
        
        const totalBeforeRoundOff = rawSubTotal - discountAmount + newTaxTotal
        const newTotal = inv.roundOff ? Math.round(totalBeforeRoundOff) : totalBeforeRoundOff
        
        await prisma.invoice.update({
          where: { id: inv.id },
          data: { subTotal: rawSubTotal, taxTotal: newTaxTotal, total: newTotal }
        })
      }
    }
    
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
    const product = await prisma.product.findUnique({
      where: { id, companyId },
      include: {
        _count: {
          select: { invoiceItems: true, estimateItems: true }
        }
      }
    })

    if (!product) return { error: 'Product not found' }

    if (product._count.invoiceItems > 0 || product._count.estimateItems > 0) {
      // Soft delete by hiding it if it's already used in invoices/estimates
      await prisma.product.update({
        where: { id, companyId },
        data: { isHidden: true }
      })
    } else {
      // Hard delete if it has never been used
      await prisma.product.delete({ where: { id, companyId } })
    }
    
    revalidatePath('/app/products')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { error: 'Failed to delete product' }
  }
}

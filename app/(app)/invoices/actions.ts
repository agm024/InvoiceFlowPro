'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function getInvoices() {
  return await prisma.invoice.findMany({
    include: { 
      client: true,
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getInvoiceFormData() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  const banks = await prisma.bank.findMany({ orderBy: { bankName: 'asc' } })
  const exchangeRates = await prisma.exchangeRate.findMany()
  
  // Generate a sequential invoice number
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  
  let nextInvoiceNumber = `INV-001`
  if (lastInvoice && lastInvoice.invoiceNumber.startsWith('INV-')) {
    const parts = lastInvoice.invoiceNumber.split('-')
    const lastNumStr = parts[parts.length - 1]
    const num = parseInt(lastNumStr, 10)
    if (!isNaN(num)) {
      // Keep the prefix, just increment the last number part
      const prefix = parts.slice(0, -1).join('-')
      nextInvoiceNumber = `${prefix}-${String(num + 1).padStart(lastNumStr.length > 2 ? lastNumStr.length : 3, '0')}`
    }
  } else if (lastInvoice) {
    // Fallback if they used a weird custom format that didn't start with INV-
    nextInvoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`
  }
  
  return { clients, products, banks, exchangeRates, nextInvoiceNumber }
}

export async function createInvoice(data: {
  clientId: string
  invoiceNumber: string
  dueDate: string
  reference?: string
  notes: string
  invoiceType: string
  currency: string
  paymentMethod: string
  bankId?: string
  discountType: string
  discountValue: number
  roundOff: number
  exchangeRate?: number
  items: Array<{ productId: string, quantity: number, price: number, tax: number }>
  subTotal: number
  taxTotal: number
  total: number
  status?: string
}) {
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        clientId: data.clientId,
        invoiceNumber: data.invoiceNumber,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        reference: data.reference,
        notes: data.notes,
        invoiceType: data.invoiceType,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        bankId: data.bankId,
        discountType: data.discountType,
        discountValue: data.discountValue,
        roundOff: data.roundOff,
        exchangeRate: data.exchangeRate || 1.0,
        subTotal: data.subTotal,
        taxTotal: data.taxTotal,
        total: data.total,
        status: data.status || 'draft',
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            tax: item.tax
          }))
        }
      }
    })
    revalidatePath('/invoices')
    return { success: true, invoice: newInvoice }
  } catch (error) {
    console.error('Failed to create invoice:', error)
    return { error: 'Failed to create invoice' }
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({ where: { id } })
    revalidatePath('/invoices')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete invoice:', error)
    return { error: 'Failed to delete invoice' }
  }
}

export async function updateInvoice(id: string, data: {
  clientId: string
  invoiceNumber: string
  dueDate: string
  reference?: string
  notes: string
  invoiceType: string
  currency: string
  paymentMethod: string
  bankId?: string
  discountType: string
  discountValue: number
  roundOff: number
  exchangeRate: number
  items: Array<{ productId: string, quantity: number, price: number, tax: number }>
  subTotal: number
  taxTotal: number
  total: number
  status?: string
}) {
  try {
    // We use a transaction to delete existing items and insert new ones
    await prisma.$transaction(async (tx) => {
      // 1. Delete existing items
      await tx.invoiceItem.deleteMany({
        where: { invoiceId: id }
      })
      
      // 2. Update invoice and recreate items
      await tx.invoice.update({
        where: { id },
        data: {
          clientId: data.clientId,
          invoiceNumber: data.invoiceNumber,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          reference: data.reference,
          notes: data.notes,
          invoiceType: data.invoiceType,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          bankId: data.bankId,
          discountType: data.discountType,
          discountValue: data.discountValue,
          roundOff: data.roundOff,
          exchangeRate: data.exchangeRate,
          subTotal: data.subTotal,
          taxTotal: data.taxTotal,
          total: data.total,
          ...(data.status ? { status: data.status } : {}),
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              tax: item.tax
            }))
          }
        }
      })
    })

    revalidatePath('/invoices')
    revalidatePath(`/invoices/${id}`)
    revalidatePath('/')
    return { success: true, invoice: { id } }
  } catch (error) {
    console.error('Failed to update invoice:', error)
    return { error: 'Failed to update invoice' }
  }
}


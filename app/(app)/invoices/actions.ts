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
    where: { invoiceType: 'REGULAR' },
    orderBy: { createdAt: 'desc' }
  })
  
  let nextInvoiceNumber = `INV-001`
  if (lastInvoice && lastInvoice.invoiceNumber.startsWith('INV-')) {
    const parts = lastInvoice.invoiceNumber.split('-')
    const lastNumStr = parts[parts.length - 1]
    const num = parseInt(lastNumStr, 10)
    if (!isNaN(num)) {
      const prefix = parts.slice(0, -1).join('-')
      nextInvoiceNumber = `${prefix}-${String(num + 1).padStart(lastNumStr.length > 2 ? lastNumStr.length : 3, '0')}`
    }
  } else if (lastInvoice) {
    nextInvoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`
  }

  // Generate a sequential quotation number
  const lastQuotation = await prisma.invoice.findFirst({
    where: { invoiceType: 'QUOTATION' },
    orderBy: { createdAt: 'desc' }
  })
  
  let nextQuotationNumber = `QT-001`
  if (lastQuotation && lastQuotation.invoiceNumber.startsWith('QT-')) {
    const parts = lastQuotation.invoiceNumber.split('-')
    const lastNumStr = parts[parts.length - 1]
    const num = parseInt(lastNumStr, 10)
    if (!isNaN(num)) {
      const prefix = parts.slice(0, -1).join('-')
      nextQuotationNumber = `${prefix}-${String(num + 1).padStart(lastNumStr.length > 2 ? lastNumStr.length : 3, '0')}`
    }
  } else if (lastQuotation) {
    nextQuotationNumber = `QT-${Math.floor(1000 + Math.random() * 9000)}`
  }
  
  return { clients, products, banks, exchangeRates, nextInvoiceNumber, nextQuotationNumber }
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
  date?: string
}) {
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        clientId: data.clientId,
        invoiceNumber: data.invoiceNumber,
        date: data.date ? new Date(data.date) : undefined,
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
  date?: string
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
          date: data.date ? new Date(data.date) : undefined,
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
    return { success: true, invoice: { id, invoiceNumber: data.invoiceNumber } }
  } catch (error) {
    console.error('Failed to update invoice:', error)
    return { error: 'Failed to update invoice' }
  }
}

export async function markInvoiceAsPaid(id: string) {
  try {
    await prisma.invoice.update({
      where: { id },
      data: { status: 'paid' }
    })
    revalidatePath('/invoices')
    revalidatePath(`/invoices/${id}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark invoice as paid:', error)
    return { error: 'Failed to mark invoice as paid' }
  }
}

export async function recordPayment(id: string, amountReceived: number) {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id } })
    if (!invoice) return { error: 'Invoice not found' }

    const newAmountPaid = invoice.amountPaid + amountReceived
    // Use an epsilon to avoid floating point precision issues
    const isFullyPaid = newAmountPaid >= invoice.total - 0.01

    await prisma.invoice.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        status: isFullyPaid ? 'paid' : 'partially_paid'
      }
    })
    
    revalidatePath(`/invoices/${id}`)
    revalidatePath('/invoices')
    revalidatePath('/')
    return { success: true, isFullyPaid }
  } catch (error) {
    console.error('Failed to record payment:', error)
    return { error: 'Failed to record payment' }
  }
}


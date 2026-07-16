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

export async function convertToInvoice(id: string) {
  try {
    const existing = await prisma.invoice.findUnique({ where: { id }, include: { items: true } })
    if (!existing || existing.invoiceType !== 'QUOTATION') return { error: 'Invalid quotation' }

    // Generate new invoice number
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

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber: nextInvoiceNumber,
        date: new Date(),
        dueDate: existing.dueDate,
        status: 'draft',
        subTotal: existing.subTotal,
        taxTotal: existing.taxTotal,
        total: existing.total,
        notes: existing.notes,
        clientId: existing.clientId,
        bankId: existing.bankId,
        currency: existing.currency,
        discountType: existing.discountType,
        discountValue: existing.discountValue,
        invoiceType: 'REGULAR',
        roundOff: existing.roundOff,
        exchangeRate: existing.exchangeRate,
        paymentMethod: existing.paymentMethod,
        reference: existing.reference,
        items: {
          create: existing.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            tax: item.tax
          }))
        }
      }
    })

    revalidatePath('/invoices')
    revalidatePath('/quotations')
    return { success: true, newInvoiceId: newInvoice.id }
  } catch (error) {
    console.error('Failed to convert to invoice:', error)
    return { error: 'Failed to convert to invoice' }
  }
}

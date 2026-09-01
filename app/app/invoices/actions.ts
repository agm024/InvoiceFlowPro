'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { requireCompany } from '@/lib/auth-context'

export async function getInvoices() {
  const { companyId } = await requireCompany()
  return await prisma.invoice.findMany({
    where: { companyId },
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
  const { companyId } = await requireCompany()
  const clients = await prisma.client.findMany({ where: { companyId }, orderBy: { name: 'asc' } })
  const products = await prisma.product.findMany({ where: { companyId, isHidden: false }, orderBy: { name: 'asc' } })
  const banks = await prisma.bank.findMany({ where: { companyId }, orderBy: { bankName: 'asc' } })
  const exchangeRates = await prisma.exchangeRate.findMany({ where: { companyId } })
  
  // Generate a sequential invoice number
  const lastInvoice = await prisma.invoice.findFirst({
    where: { companyId, invoiceType: 'REGULAR' },
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
    where: { companyId, invoiceType: 'QUOTATION' },
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
  
  const companySettings = await prisma.companySettings.findFirst({ where: { companyId } })

  return { clients, products, banks, exchangeRates, nextInvoiceNumber, nextQuotationNumber, companySettings }
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
  milestoneId?: string
}) {
  const { companyId } = await requireCompany()
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        companyId,
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
        status: data.status === 'paid' ? 'paid' : (data.status || 'draft'),
        amountPaid: data.status === 'paid' ? data.total : 0,
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

    if (data.milestoneId) {
      // First find the milestone to ensure it belongs to the company before updating (for Prisma 4+)
      await prisma.milestone.updateMany({
        where: { id: data.milestoneId },
        data: {
          invoiceId: newInvoice.id,
          status: data.status === 'sent' ? 'SENT' : 'UNBILLED'
        }
      })
      revalidatePath('/app/clients')
    }

    revalidatePath('/app/invoices')
    return { success: true, invoice: newInvoice }
  } catch (error) {
    console.error('Failed to create invoice:', error)
    return { error: 'Failed to create invoice' }
  }
}

export async function deleteInvoice(id: string) {
  const { companyId } = await requireCompany()
  try {
    const invoice = await prisma.invoice.findFirst({ where: { id, companyId } })
    if (!invoice) return { error: 'Invoice not found' }
    // if (invoice.status !== 'draft') {
    //   return { error: 'Issued or paid invoices cannot be deleted. You can cancel or void them instead.' }
    // }
    
    // Unlink any milestones to prevent foreign key constraint violations
    await prisma.milestone.updateMany({
      where: { invoiceId: id },
      data: { invoiceId: null, status: 'UNBILLED' }
    })

    await prisma.invoice.delete({ where: { id } })
    revalidatePath('/app/invoices')
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
  const { companyId } = await requireCompany()
  try {
    // We use a transaction to delete existing items and insert new ones
    await prisma.$transaction(async (tx) => {
      // First verify invoice belongs to company
      const invoice = await tx.invoice.findFirst({ where: { id, companyId } })
      if (!invoice) throw new Error('Invoice not found')

      if (invoice.status !== 'draft') {
        throw new Error('This invoice is already issued/paid and is locked. Please use Credit/Debit Notes for corrections.')
      }

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
          ...(data.status ? { 
            status: data.status,
            ...(data.status === 'paid' ? { amountPaid: data.total } : {}) 
          } : {}),
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

    revalidatePath('/app/invoices')
    revalidatePath(`/app/invoices/${id}`)
    revalidatePath('/')
    return { success: true, invoice: { id, invoiceNumber: data.invoiceNumber } }
  } catch (error) {
    console.error('Failed to update invoice:', error)
    return { error: 'Failed to update invoice' }
  }
}

export async function markInvoiceAsPaid(id: string) {
  const { companyId } = await requireCompany()
  try {
    const invoice = await prisma.invoice.findFirst({ where: { id, companyId }, include: { milestone: true } })
    if (!invoice) return { error: 'Invoice not found' }

    await prisma.invoice.update({
      where: { id },
      data: { status: 'paid' },
    })
    
    if (invoice.milestone) {
      await prisma.milestone.updateMany({
        where: { id: invoice.milestone.id },
        data: { status: 'PAID' }
      })
      revalidatePath('/app/clients')
    }
    
    revalidatePath('/app/invoices')
    revalidatePath(`/app/invoices/${id}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark invoice as paid:', error)
    return { error: 'Failed to mark invoice as paid' }
  }
}

export async function recordPayment(id: string, amountReceived: number, bankId?: string) {
  const { companyId } = await requireCompany()
  try {
    const invoice = await prisma.invoice.findFirst({ 
      where: { id, companyId },
      include: { milestone: true }
    })
    if (!invoice) return { error: 'Invoice not found' }

    const newAmountPaid = invoice.amountPaid + amountReceived
    // Use an epsilon to avoid floating point precision issues
    const isFullyPaid = newAmountPaid >= invoice.total - 0.01

    await prisma.invoice.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        status: isFullyPaid ? 'paid' : 'partially_paid',
        ...(bankId ? { bankId } : {})
      }
    })
    
    if (isFullyPaid && invoice.milestone) {
      await prisma.milestone.updateMany({
        where: { id: invoice.milestone.id },
        data: { status: 'PAID' }
      })
      revalidatePath('/app/clients')
    }
    
    revalidatePath(`/app/invoices/${id}`)
    revalidatePath('/app/invoices')
    revalidatePath('/')
    return { success: true, isFullyPaid }
  } catch (error) {
    console.error('Failed to record payment:', error)
    return { error: 'Failed to record payment' }
  }
}


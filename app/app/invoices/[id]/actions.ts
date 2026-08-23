'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { requireCompany } from '@/lib/auth-context'

export async function updateInvoiceStatus(id: string, status: string) {
  const { companyId } = await requireCompany()
  try {
    // Prisma extended where allows filtering by companyId
    await prisma.invoice.updateMany({
      where: { id, companyId },
      data: { status }
    })
    revalidatePath(`/app/invoices/${id}`)
    revalidatePath('/app/invoices')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to update invoice status:', error)
    return { error: 'Failed to update status' }
  }
}

export async function recordPayment(id: string, amountReceived: number) {
  const { companyId } = await requireCompany()
  try {
    const invoice = await prisma.invoice.findFirst({ 
      where: { id, companyId },
      include: { milestone: { include: { project: { include: { milestones: true } } } } }
    })
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

    // If fully paid and linked to a milestone, update milestone
    if (isFullyPaid && invoice.milestone) {
      const projectId = invoice.milestone.projectId
      
      // Prisma extended where allows filtering by companyId
      await prisma.milestone.updateMany({
        where: { id: invoice.milestone.id },
        data: { status: 'PAID' }
      })

      // Check if all milestones for this project are paid
      const project = invoice.milestone.project
      // Fetch latest milestones since we just updated one
      const allMilestones = await prisma.milestone.findMany({ where: { projectId } })
      
      const allPaid = allMilestones.length > 0 && allMilestones.every(m => m.status === 'PAID')
      
      if (allPaid && project.status !== 'COMPLETED') {
        await prisma.project.updateMany({
          where: { id: projectId, companyId },
          data: { status: 'COMPLETED', stage: 'REVIEW' }
        })
      }
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

export async function getInvoiceDetails(id: string) {
  const { companyId } = await requireCompany()
  return await prisma.invoice.findFirst({
    where: { id, companyId },
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
  const { companyId } = await requireCompany()
  try {
    const existing = await prisma.invoice.findFirst({ where: { id, companyId }, include: { items: true } })
    if (!existing || existing.invoiceType !== 'QUOTATION') return { error: 'Invalid quotation' }

    // Generate new invoice number
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

    const newInvoice = await prisma.invoice.create({
      data: {
        companyId,
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

    revalidatePath('/app/invoices')
    revalidatePath('/app/invoices')
    return { success: true, newInvoiceId: newInvoice.id }
  } catch (error) {
    console.error('Failed to convert to invoice:', error)
    return { error: 'Failed to convert to invoice' }
  }
}



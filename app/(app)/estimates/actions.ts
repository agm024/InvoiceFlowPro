'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function getEstimates() {
  return await prisma.estimate.findMany({
    orderBy: { date: 'desc' },
    include: { client: true }
  })
}

export async function getEstimateFormData() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } })
  const settings = await prisma.companySettings.findFirst()
  
  const lastEstimate = await prisma.estimate.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { estimateNumber: true }
  })

  let nextEstimateNumber = 'EST-001'
  if (lastEstimate?.estimateNumber) {
    const match = lastEstimate.estimateNumber.match(/EST-(\d+)/)
    if (match) {
      const nextNum = parseInt(match[1]) + 1
      nextEstimateNumber = `EST-${nextNum.toString().padStart(3, '0')}`
    }
  }

  return { clients, products, settings, nextEstimateNumber }
}

export async function createEstimate(data: any) {
  try {
    const estimate = await prisma.estimate.create({
      data: {
        estimateNumber: data.estimateNumber,
        date: new Date(data.date),
        clientId: data.clientId,
        status: data.status || 'sent',
        currency: data.currency,
        exchangeRate: data.exchangeRate,
        subTotal: data.subTotal,
        taxTotal: data.taxTotal,
        total: data.total,
        notes: data.notes,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: Math.max(1, Math.floor(parseFloat(item.quantity) || 1)),
            price: parseFloat(item.rate) || 0,
            tax: parseFloat(item.taxAmount) || 0
          }))
        }
      }
    })

    revalidatePath('/estimates')
    return { success: true, estimateId: estimate.id }
  } catch (error: any) {
    console.error('Failed to create estimate:', error)
    return { error: 'Failed to create estimate' }
  }
}
export async function convertToInvoice(estimateId: string) {
  try {
    const estimate = await prisma.estimate.findUnique({
      where: { id: estimateId },
      include: { items: true }
    });
    if (!estimate) return { error: 'Estimate not found' };

    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true }
    });
    let nextInvoiceNumber = 'INV-001';
    if (lastInvoice?.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (match) {
        const nextNum = parseInt(match[1]) + 1;
        nextInvoiceNumber = "INV-" + nextNum.toString().padStart(3, '0');
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: nextInvoiceNumber,
        date: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        clientId: estimate.clientId,
        status: 'draft',
        currency: estimate.currency,
        exchangeRate: estimate.exchangeRate,
        subTotal: estimate.subTotal,
        taxTotal: estimate.taxTotal,
        total: estimate.total,
        notes: estimate.notes,
        discountType: estimate.discountType,
        discountValue: estimate.discountValue,
        invoiceType: estimate.estimateType || 'REGULAR',
        items: {
          create: estimate.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            tax: item.tax
          }))
        }
      }
    });

    await prisma.estimate.update({
      where: { id: estimateId },
      data: { status: 'invoiced' }
    });

    revalidatePath('/estimates');
    revalidatePath('/invoices');
    return { success: true, invoiceId: invoice.id };
  } catch (error: any) {
    console.error('Failed to convert estimate:', error);
    return { error: 'Failed to convert estimate' };
  }
}

export async function deleteEstimate(id: string) {
  try {
    await prisma.estimate.delete({
      where: { id }
    });
    revalidatePath('/estimates');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete estimate:', error);
    return { error: 'Failed to delete estimate' };
  }
}

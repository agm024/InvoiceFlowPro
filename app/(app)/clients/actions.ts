'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { getStateNameByCode } from '@/utils/stateCodes'
import { slugify } from '@/utils/slugify'
import crypto from 'crypto'

export async function getClients() {
  return await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      invoices: {
        select: {
          total: true,
          status: true,
          date: true,
          invoiceType: true,
          amountPaid: true
        }
      }
    }
  })
}

async function generateUniqueSlug(name: string, model: any, existingId?: string) {
  const baseSlug = slugify(name) || 'client'
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

export async function createClient(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const gstin = formData.get('gstin') as string
  const panNo = formData.get('panNo') as string
  const stateCode = formData.get('stateCode') as string
  const providedStateName = formData.get('stateName') as string
  
  const stateName = providedStateName || (stateCode ? getStateNameByCode(stateCode) : '')
  const slug = await generateUniqueSlug(name, prisma.client)
  const portalToken = crypto.randomBytes(16).toString('hex')

  try {
    const client = await prisma.client.create({
      data: { name, slug, email, phone, address, gstin, panNo, stateCode, stateName, portalToken }
    })
    revalidatePath('/clients')
    return { success: true, client }
  } catch (error) {
    console.error('Failed to create client:', error)
    return { error: 'Failed to create client' }
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // Find all invoices and estimates for the client to delete their items
      const invoices = await tx.invoice.findMany({ where: { clientId: id }, select: { id: true } });
      const estimates = await tx.estimate.findMany({ where: { clientId: id }, select: { id: true } });
      const invoiceIds = invoices.map(i => i.id);
      const estimateIds = estimates.map(e => e.id);

      // Delete items
      if (invoiceIds.length > 0) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: { in: invoiceIds } } });
      }
      if (estimateIds.length > 0) {
        await tx.estimateItem.deleteMany({ where: { estimateId: { in: estimateIds } } });
      }

      // Find projects to delete milestones
      const projects = await tx.project.findMany({ where: { clientId: id }, select: { id: true } });
      const projectIds = projects.map(p => p.id);
      if (projectIds.length > 0) {
        await tx.milestone.deleteMany({ where: { projectId: { in: projectIds } } });
      }

      // Delete main records
      await tx.invoice.deleteMany({ where: { clientId: id } });
      await tx.estimate.deleteMany({ where: { clientId: id } });
      await tx.project.deleteMany({ where: { clientId: id } });
      await tx.client.delete({ where: { id } });
    });

    revalidatePath('/clients')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete client:', error)
    return { error: 'Failed to delete client' }
  }
}

export async function generateMissingPortalTokens() {
  const clients = await prisma.client.findMany({ where: { portalToken: null } })
  for (const client of clients) {
    await prisma.client.update({
      where: { id: client.id },
      data: { portalToken: crypto.randomBytes(16).toString('hex') }
    })
  }
  revalidatePath('/clients')
}

export async function updateClient(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const gstin = formData.get('gstin') as string
  const panNo = formData.get('panNo') as string
  const stateCode = formData.get('stateCode') as string
  const providedStateName = formData.get('stateName') as string

  const stateName = providedStateName || (stateCode ? getStateNameByCode(stateCode) : '')
  const slug = await generateUniqueSlug(name, prisma.client, id)

  try {
    const client = await prisma.client.update({
      where: { id },
      data: { name, slug, email, phone, address, gstin, panNo, stateCode, stateName }
    })
    revalidatePath('/clients')
    return { success: true, client }
  } catch (error) {
    console.error('Failed to update client:', error)
    return { error: 'Failed to update client' }
  }
}

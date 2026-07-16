'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  return await prisma.client.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function createClient(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const gstin = formData.get('gstin') as string
  const panNo = formData.get('panNo') as string
  const stateCode = formData.get('stateCode') as string
  const stateName = formData.get('stateName') as string

  try {
    const client = await prisma.client.create({
      data: { name, email, phone, address, gstin, panNo, stateCode, stateName }
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
    await prisma.client.delete({ where: { id } })
    revalidatePath('/clients')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete client:', error)
    return { error: 'Failed to delete client' }
  }
}

export async function updateClient(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const gstin = formData.get('gstin') as string
  const panNo = formData.get('panNo') as string
  const stateCode = formData.get('stateCode') as string
  const stateName = formData.get('stateName') as string

  try {
    const client = await prisma.client.update({
      where: { id },
      data: { name, email, phone, address, gstin, panNo, stateCode, stateName }
    })
    revalidatePath('/clients')
    return { success: true, client }
  } catch (error) {
    console.error('Failed to update client:', error)
    return { error: 'Failed to update client' }
  }
}

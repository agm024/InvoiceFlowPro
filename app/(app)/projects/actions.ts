'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function createProject(data: {
  clientId: string
  name: string
  totalValue: number
  currency: string
  milestones: Array<{
    name: string
    percentage?: number | null
    amount: number
  }>
}) {
  try {
    const project = await prisma.project.create({
      data: {
        clientId: data.clientId,
        name: data.name,
        totalValue: data.totalValue,
        currency: data.currency || 'INR',
        status: 'ACTIVE',
        milestones: {
          create: data.milestones.map((m, index) => ({
            name: m.name,
            percentage: m.percentage,
            amount: m.amount,
            status: 'UNBILLED',
            orderIndex: index
          }))
        }
      },
      include: {
        milestones: true
      }
    })
    
    revalidatePath('/clients')
    revalidatePath('/')
    return { success: true, project }
  } catch (error) {
    console.error('Failed to create project:', error)
    return { error: 'Failed to create project' }
  }
}

export async function getClientProjects(clientId: string) {
  try {
    return await prisma.project.findMany({
      where: { clientId },
      include: {
        milestones: {
          include: {
            invoice: true
          },
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to fetch client projects:', error)
    return []
  }
}

export async function activateMilestone(milestoneId: string, invoiceId: string) {
  try {
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { 
        status: 'SENT',
        invoiceId: invoiceId
      }
    })
    revalidatePath('/clients', 'layout')
    return { success: true, milestone }
  } catch (error) {
    console.error('Failed to activate milestone:', error)
    return { error: 'Failed to activate milestone' }
  }
}

export async function markMilestonePaid(milestoneId: string) {
  try {
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'PAID' }
    })
    revalidatePath('/clients', 'layout')
    return { success: true, milestone }
  } catch (error) {
    console.error('Failed to mark milestone paid:', error)
    return { error: 'Failed to update milestone' }
  }
}

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({
      where: { id: projectId }
    })
    revalidatePath('/clients', 'layout')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete project:', error)
    return { error: 'Failed to delete project' }
  }
}


'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function updateClientProfile(clientId: string, data: any) {
  try {
    await prisma.client.update({
      where: { id: clientId },
      data: {
        address: data.address,
        phone: data.phone,
        gstin: data.gstin,
        panNo: data.panNo,
      }
    })
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateEstimateStatus(estimateId: string, status: string) {
  try {
    await prisma.estimate.update({
      where: { id: estimateId },
      data: { status }
    })
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function signProjectContract(projectId: string, signature: string) {
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { contractApprovedAt: new Date(), contractSignedBy: signature }
    })

    await prisma.activityLog.create({
      data: {
        clientId: project.clientId,
        action: 'CONTRACT_SIGNED',
        description: signature
      }
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function signOffProject(projectId: string, signature: string) {
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { projectClosedAt: new Date(), status: 'COMPLETED', stage: 'CLOSED' }
    })

    await prisma.activityLog.create({
      data: {
        clientId: project.clientId,
        action: 'HANDOVER_SIGNED',
        description: signature
      }
    })

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

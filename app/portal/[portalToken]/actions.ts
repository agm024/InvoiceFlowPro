'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function updateClientProfile(portalToken: string, clientId: string, data: any) {
  try {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (client?.portalToken !== portalToken) throw new Error("Unauthorized");
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

export async function updateEstimateStatus(portalToken: string, estimateId: string, status: string) {
  try {
    const estimate = await prisma.estimate.findUnique({ where: { id: estimateId }, include: { client: true } });
    if (estimate?.client?.portalToken !== portalToken) throw new Error("Unauthorized");
    await prisma.estimate.update({
      where: { id: estimateId },
      data: { status }
    })
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function signProjectContract(portalToken: string, projectId: string, signature: string) {
  try {
    const proj = await prisma.project.findUnique({ where: { id: projectId }, include: { client: true } });
    if (proj?.client?.portalToken !== portalToken) throw new Error("Unauthorized");
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { contractApprovedAt: new Date(), contractSignedBy: signature }
    })

    await prisma.activityLog.create({
      data: {
        companyId: project.companyId,
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

export async function signOffProject(portalToken: string, projectId: string, signature: string) {
  try {
    const proj = await prisma.project.findUnique({ where: { id: projectId }, include: { client: true } });
    if (proj?.client?.portalToken !== portalToken) throw new Error("Unauthorized");
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { projectClosedAt: new Date(), status: 'COMPLETED', stage: 'CLOSED' }
    })

    await prisma.activityLog.create({
      data: {
        companyId: project.companyId,
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

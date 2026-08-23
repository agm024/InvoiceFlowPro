'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { requireCompany } from '@/lib/auth-context'

export async function createProjectTask(projectId: string, title: string, description?: string) {
  try {
    const { companyId } = await requireCompany()
    const project = await prisma.project.findFirst({ where: { id: projectId, companyId } })
    if (!project) return { error: 'Project not found' }

    await prisma.projectTask.create({
      data: {
        title,
        description,
        projectId
      }
    })
    revalidatePath(`/app/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateProjectTaskStatus(taskId: string, status: string, projectId: string) {
  try {
    const { companyId } = await requireCompany()
    const project = await prisma.project.findFirst({ where: { id: projectId, companyId } })
    if (!project) return { error: 'Project not found' }

    await prisma.projectTask.update({
      where: { id: taskId },
      data: { status }
    })
    revalidatePath(`/app/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteProjectTask(taskId: string, projectId: string) {
  try {
    const { companyId } = await requireCompany()
    const project = await prisma.project.findFirst({ where: { id: projectId, companyId } })
    if (!project) return { error: 'Project not found' }

    await prisma.projectTask.delete({
      where: { id: taskId }
    })
    revalidatePath(`/app/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateProjectStage(projectId: string, stage: string) {
  try {
    const { companyId } = await requireCompany()
    const project = await prisma.project.findFirst({ where: { id: projectId, companyId } })
    if (!project) return { error: 'Project not found' }

    await prisma.project.update({
      where: { id: projectId },
      data: { stage }
    })
    revalidatePath(`/app/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function createProjectTask(projectId: string, title: string, description?: string) {
  try {
    await prisma.projectTask.create({
      data: {
        title,
        description,
        projectId
      }
    })
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateProjectTaskStatus(taskId: string, status: string, projectId: string) {
  try {
    await prisma.projectTask.update({
      where: { id: taskId },
      data: { status }
    })
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteProjectTask(taskId: string, projectId: string) {
  try {
    await prisma.projectTask.delete({
      where: { id: taskId }
    })
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateProjectStage(projectId: string, stage: string) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { stage }
    })
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

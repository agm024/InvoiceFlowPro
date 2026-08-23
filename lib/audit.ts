import prisma from '@/utils/prisma'
import { requireSuperAdmin } from './auth-context'
import { headers } from 'next/headers'

export async function logAudit({
  action,
  targetId,
  companyId,
  metadata
}: {
  action: string
  targetId?: string
  companyId?: string
  metadata?: any
}) {
  try {
    const admin = await requireSuperAdmin()
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    await prisma.auditLog.create({
      data: {
        action,
        adminId: admin.id || 'system',
        targetId,
        companyId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress
      }
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
    // Do not throw, as we don't want audit log failures to break the main transaction
  }
}

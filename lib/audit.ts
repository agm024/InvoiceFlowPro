import prisma from '@/utils/prisma'
import { requireSuperAdmin } from './auth-context'
import { headers } from 'next/headers'

export async function logAudit({
  action,
  targetId,
  companyId,
  reason,
  before,
  after,
  metadata = {}
}: {
  action: string
  targetId?: string
  companyId?: string
  reason?: string
  before?: any
  after?: any
  metadata?: any
}) {
  try {
    const admin = await requireSuperAdmin()
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    const requestId = headersList.get('x-request-id') || undefined

    const combinedMetadata = {
      ...metadata,
      before,
      after
    }

    await prisma.auditLog.create({
      data: {
        action,
        adminId: admin.id || 'system',
        targetId,
        companyId,
        ipAddress,
        userAgent,
        requestId,
        reason,
        metadata: Object.keys(combinedMetadata).length > 0 ? JSON.stringify(combinedMetadata) : null
      }
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}

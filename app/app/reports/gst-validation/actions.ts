'use server'

import prisma from '@/utils/prisma'
import { requireCompany } from '@/lib/auth-context'
import { revalidatePath } from 'next/cache'

export async function logGstExport(type: string, period: string, validCount: number, warningCount: number, errorCount: number) {
  const { companyId } = await requireCompany()
  try {
    await prisma.gstExportHistory.create({
      data: {
        companyId,
        type,
        period,
        validCount,
        warningCount,
        errorCount,
        metadata: JSON.stringify({ format: 'CSV' })
      }
    })
    revalidatePath('/app/reports/gst-validation')
    return { success: true }
  } catch (error) {
    console.error('Failed to log GST export:', error)
    return { error: 'Failed to log GST export event' }
  }
}

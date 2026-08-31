import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { EmailsClient } from "./EmailsClient"

export const dynamic = 'force-dynamic'

export default async function EmailsAdminPage() {
  await requireSuperAdmin()

  const [templates, logs] = await Promise.all([
    prisma.emailTemplate.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.emailLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 100
    })
  ])

  // Format datetimes to strings for client components serialization
  const formattedTemplates = templates.map(t => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    htmlBody: t.htmlBody
  }))

  const formattedLogs = logs.map(l => ({
    id: l.id,
    templateName: l.templateName || "Unknown",
    recipient: l.recipient,
    status: l.status,
    sentAt: l.sentAt.toISOString(),
    error: l.error
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Email Communications</h1>
        <p className="text-xs text-zinc-500 mt-1">Manage transactional HTML templates and inspect system outbound logs.</p>
      </div>

      <EmailsClient templates={formattedTemplates} logs={formattedLogs} />
    </div>
  )
}

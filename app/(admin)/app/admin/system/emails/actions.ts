"use server"

import prisma from "@/utils/prisma"
import { requireSuperAdmin, requireWriteAccess } from "@/lib/auth-context"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"

export async function saveEmailTemplate(formData: FormData) {
  await requireSuperAdmin()
  await requireWriteAccess()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const subject = formData.get("subject") as string
  const htmlBody = formData.get("htmlBody") as string

  if (!name || !subject || !htmlBody) {
    throw new Error("All fields are required to save an email template.")
  }

  const plainTextBody = htmlBody.replace(/<[^>]*>/g, "")
  const variablesArray: string[] = []
  const regex = /\{\{([^}]+)\}\}/g
  let match
  while ((match = regex.exec(htmlBody)) !== null) {
    const varName = match[1].trim()
    if (!variablesArray.includes(varName)) {
      variablesArray.push(varName)
    }
  }
  const variables = variablesArray.length > 0 ? variablesArray.join(",") : "name"

  const data = { name, subject, htmlBody, plainTextBody, variables }

  if (id) {
    await prisma.emailTemplate.update({ where: { id }, data })
    await logAudit({ action: "EMAIL_TEMPLATE_UPDATED", targetId: id, metadata: data })
  } else {
    const newTemplate = await prisma.emailTemplate.create({ data })
    await logAudit({ action: "EMAIL_TEMPLATE_CREATED", targetId: newTemplate.id, metadata: data })
  }

  revalidatePath("/app/admin/system/emails")
}

export async function sendTestEmail(templateId: string, email: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!email || !email.includes("@")) {
    throw new Error("Invalid test email recipient address.")
  }

  const template = await prisma.emailTemplate.findUnique({ where: { id: templateId } })
  if (!template) throw new Error("Email template not found")

  // Log simulation to EmailLog
  await prisma.emailLog.create({
    data: {
      recipient: email,
      templateId: template.id,
      templateName: template.name,
      status: "SENT",
      provider: "ZEPTOMAIL",
      sentAt: new Date()
    }
  })

  await logAudit({
    action: "EMAIL_TEST_SENT",
    targetId: templateId,
    reason: `Simulated dispatch of ${template.name} template to ${email}`
  })

  revalidatePath("/app/admin/system/emails")
}

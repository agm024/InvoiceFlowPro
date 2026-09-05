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

  let plainTextBody = htmlBody
  let prev = ""
  while (plainTextBody !== prev) {
    prev = plainTextBody
    plainTextBody = plainTextBody.replace(/<[^>]*>/g, "")
  }
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

import { sendEmail } from "@/app/actions/email"
import { wrapInTemplate } from "@/lib/email-helpers"

export async function sendTestEmail(templateId: string, email: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!email || !email.includes("@")) {
    throw new Error("Invalid test email recipient address.")
  }

  const template = await prisma.emailTemplate.findUnique({ where: { id: templateId } })
  if (!template) throw new Error("Email template not found")

  // Generate a realistic HTML body by replacing variables with placeholders
  let htmlToSend = template.htmlBody
  if (template.variables) {
    const vars = template.variables.split(',')
    vars.forEach(v => {
      htmlToSend = htmlToSend.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), `[Test ${v}]`)
    })
  }

  // Send the actual email using ZeptoMail
  // Format the raw DB template with our standard styling
  const prettyHtml = htmlToSend.startsWith('<div') 
    ? htmlToSend 
    : wrapInTemplate(`<div style="color: #52525b; font-size: 16px; line-height: 1.6;">${htmlToSend.replace(/\n/g, '<br/>')}</div>`);

  const result = await sendEmail({
    to: email,
    subject: `[TEST] ${template.subject}`,
    html: prettyHtml
  })

  if (!result.success) {
    throw new Error(result.error || "Failed to send email via ZeptoMail")
  }

  // Log successful delivery to EmailLog
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
    reason: `Dispatched ${template.name} template to ${email} via ZeptoMail`
  })

  revalidatePath("/app/admin/system/emails")
}

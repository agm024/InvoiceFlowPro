import { requireSuperAdmin, getCurrentUser } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import { BusinessDetailsClient } from './BusinessDetailsClient'

export const dynamic = 'force-dynamic'

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireSuperAdmin()
  const user = await getCurrentUser()
  const { id } = await params

  // Fetch Company with counts, users, invoices, payments, subscriptions, tickets, audit logs, and all available plans
  const [company, users, invoices, payments, activityLogs, tickets, plans] = await Promise.all([
    prisma.company.findUnique({
      where: { id },
      include: {
        subscription: { include: { plan: true } }
      }
    }),
    prisma.user.findMany({
      where: { companyId: id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.invoice.findMany({
      where: { companyId: id },
      orderBy: { date: 'desc' }
    }),
    prisma.platformPayment.findMany({
      where: { companyId: id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.auditLog.findMany({
      where: { companyId: id },
      orderBy: { createdAt: 'desc' },
      take: 50
    }),
    prisma.ticket.findMany({
      where: { companyId: id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.plan.findMany({
      orderBy: { displayOrder: 'asc' }
    })
  ])

  if (!company) {
    notFound()
  }

  // Format to serializable object
  const formattedCompany = {
    id: company.id,
    name: company.name,
    status: company.status,
    createdAt: company.createdAt.toISOString(),
    supportAccessGranted: company.supportAccessGranted,
    subscription: company.subscription ? {
      id: company.subscription.id,
      status: company.subscription.status,
      billingInterval: company.subscription.billingInterval,
      currentPeriodEnd: company.subscription.currentPeriodEnd ? company.subscription.currentPeriodEnd.toISOString() : null,
      plan: {
        id: company.subscription.plan.id,
        name: company.subscription.plan.name,
        userLimits: company.subscription.plan.userLimits,
        clientLimits: company.subscription.plan.clientLimits,
        invoiceLimits: company.subscription.plan.invoiceLimits,
        monthlyPrice: company.subscription.plan.monthlyPrice,
        yearlyPrice: company.subscription.plan.yearlyPrice,
        currency: company.subscription.plan.currency
      }
    } : null
  }

  const formattedUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString()
  }))

  const formattedInvoices = invoices.map(i => ({
    id: i.id,
    invoiceNumber: i.invoiceNumber,
    date: i.date.toISOString(),
    total: i.total,
    currency: i.currency,
    status: i.status
  }))

  const formattedPayments = payments.map(p => ({
    id: p.id,
    originalAmount: p.originalAmount,
    originalCurrency: p.originalCurrency,
    convertedAmountInr: p.convertedAmountInr,
    createdAt: p.createdAt.toISOString(),
    gatewayTransactionId: p.gatewayTransactionId,
    status: p.status
  }))

  const formattedLogs = activityLogs.map(l => ({
    id: l.id,
    action: l.action,
    adminId: l.adminId,
    metadata: l.metadata,
    ipAddress: l.ipAddress,
    createdAt: l.createdAt.toISOString()
  }))

  const formattedTickets = tickets.map(t => ({
    id: t.id,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    createdAt: t.createdAt.toISOString()
  }))

  const formattedPlans = plans.map(p => ({
    id: p.id,
    name: p.name,
    userLimits: p.userLimits,
    clientLimits: p.clientLimits,
    invoiceLimits: p.invoiceLimits,
    monthlyPrice: p.monthlyPrice,
    yearlyPrice: p.yearlyPrice,
    currency: p.currency
  }))

  return (
    <BusinessDetailsClient 
      company={formattedCompany}
      users={formattedUsers}
      invoices={formattedInvoices}
      payments={formattedPayments}
      activityLogs={formattedLogs}
      tickets={formattedTickets}
      plans={formattedPlans}
      adminImpersonating={user.isImpersonating}
    />
  )
}

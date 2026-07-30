import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import PortalClient from './PortalClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Client Portal | InvoiceFlowPro',
}

export default async function ClientPortalPage({ params }: { params: Promise<{ portalToken: string }> }) {
  const resolvedParams = await params
  
  const client = await prisma.client.findUnique({
    where: { portalToken: resolvedParams.portalToken },
    include: {
      invoices: {
        orderBy: { date: 'desc' }
      },
      estimates: {
        orderBy: { date: 'desc' }
      },
      projects: {
        orderBy: { createdAt: 'desc' },
        include: {
          milestones: {
            orderBy: { orderIndex: 'asc' }
          }
        }
      }
    }
  })

  if (!client) {
    notFound()
  }

  const companySettings = await prisma.companySettings.findFirst()

  const unpaidInvoices = client.invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled' && i.status !== 'draft' && i.invoiceType !== 'QUOTATION')
  const paidInvoices = client.invoices.filter(i => i.status === 'paid' && i.invoiceType !== 'QUOTATION')
  const outstandingBalance = unpaidInvoices.reduce((acc, inv) => acc + (inv.total - (inv.amountPaid || 0)), 0)

  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading Portal...</div>}>
      <PortalClient 
        client={client}
        unpaidInvoices={unpaidInvoices}
        paidInvoices={paidInvoices}
        outstandingBalance={outstandingBalance}
        companySettings={companySettings}
      />
    </Suspense>
  )
}

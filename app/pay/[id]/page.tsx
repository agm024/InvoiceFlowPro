import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import PayClientPage from './PayClientPage'

export default async function PublicPayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      bank: true,
      items: {
        include: { product: true }
      }
    }
  })
  
  if (!invoice) {
    notFound()
  }

  const settings = await prisma.companySettings.findUnique({ where: { id: 'default' } })
  const myUpiId = settings?.upiId || 'demo@upi' 
  const upiUrl = `upi://pay?pa=${myUpiId}&pn=${encodeURIComponent(settings?.companyName || 'InvoiceFlowPro')}&am=${invoice.total.toFixed(2)}&tr=${invoice.invoiceNumber}&cu=INR`

  return <PayClientPage invoice={invoice} upiUrl={upiUrl} upiId={myUpiId} settings={settings} />
}

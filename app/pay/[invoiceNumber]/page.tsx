import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import PayClientPage from './PayClientPage'

export default async function PayPage({ params }: { params: Promise<{ invoiceNumber: string }> }) {
  const { invoiceNumber } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { invoiceNumber: decodeURIComponent(invoiceNumber) },
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
  const remainingBalance = invoice.total - (invoice.amountPaid || 0)
  const upiUrl = `upi://pay?pa=${myUpiId}&pn=${encodeURIComponent(settings?.companyName || 'InvoiceFlowPro')}&am=${remainingBalance.toFixed(2)}&tr=${invoice.invoiceNumber}&cu=INR`

  return <PayClientPage invoice={invoice} upiUrl={upiUrl} upiId={myUpiId} settings={settings} />
}

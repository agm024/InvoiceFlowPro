import PublicInvoicePage from '../invoice/page'
import PrintTrigger from './PrintTrigger'

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <PrintTrigger />
      <PublicInvoicePage params={params} />
    </>
  )
}

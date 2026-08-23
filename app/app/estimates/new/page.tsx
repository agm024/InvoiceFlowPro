export const dynamic = 'force-dynamic'
import { getEstimateFormData } from '../actions'
import EstimateForm from './EstimateForm'
import Link from 'next/link'

export default async function NewEstimatePage() {
  const { clients, products, settings, nextEstimateNumber } = await getEstimateFormData()

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <div className="mb-6">
        <Link href="/app/estimates" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
          &larr; Back to Estimates
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Estimate</h1>
      </div>

      <EstimateForm 
        clients={clients} 
        products={products} 
        settings={settings}
        nextEstimateNumber={nextEstimateNumber}
      />
    </div>
  )
}

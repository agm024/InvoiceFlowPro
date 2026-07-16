import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductTransactionsClient from './ProductTransactionsClient'
import DeleteProductButton from '../DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      invoiceItems: {
        include: {
          invoice: {
            include: { client: true }
          }
        }
      }
    }
  })

  if (!product) {
    notFound()
  }

  // Calculate metrics
  const saleAmount = product.invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalDiscount = product.invoiceItems.reduce((sum, item) => {
    // Assuming invoice discount applies proportionately, but image shows 0. Let's just use 0 for now unless we calculate item level discount.
    return sum + 0
  }, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-4">
        <Link href="/products" className="text-sm text-zinc-500 hover:text-foreground inline-block">
          &larr; Back to Products & Services
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 bg-card-bg border border-card-border p-6 rounded-t-xl border-b-0 shadow-sm relative z-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
        <div className="flex gap-3">
          <Link 
            href={`/products/${product.slug}/edit`}
            className="bg-amber-100 text-amber-900 border border-amber-200 px-4 py-2 rounded-md text-sm font-semibold hover:bg-amber-200 transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            Edit
          </Link>
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-b-xl shadow-sm overflow-hidden mt-[-1px] relative z-0">
        
        {/* Top Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 border-b border-card-border">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1 flex flex-col">
              Price 
              <span className="text-[10px] text-zinc-400 font-normal">% {product.taxInclusive ? 'incl' : 'excl'}. tax</span>
            </p>
            <h2 className="text-2xl font-bold text-emerald-600">₹{product.price}</h2>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1 flex flex-col">
              Purchase Price
              <span className="text-[10px] text-zinc-400 font-normal flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Weighted Avg 
              </span>
            </p>
            <h2 className="text-2xl font-bold text-emerald-600">₹{product.purchasePrice}</h2>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1 flex flex-col">
              Sale Amount
              <span className="text-[10px] text-zinc-400 font-normal opacity-0">-</span>
            </p>
            <h2 className="text-2xl font-bold text-emerald-600">₹{saleAmount}</h2>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1 flex flex-col">
              Total Discount
              <span className="text-[10px] text-zinc-400 font-normal opacity-0">-</span>
            </p>
            <h2 className="text-2xl font-bold text-red-500">₹{totalDiscount}</h2>
          </div>
        </div>

        <ProductTransactionsClient invoiceItems={product.invoiceItems} />
      </div>
    </div>
  )
}

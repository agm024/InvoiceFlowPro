import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductTransactionsClient from './ProductTransactionsClient'
import DeleteProductButton from '../DeleteProductButton'
import { ArrowLeft, Package, IndianRupee, Percent, Tag, Edit3, TrendingUp, Users, FileText } from 'lucide-react'

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
  const totalDiscount = product.invoiceItems.reduce((sum, item) => sum + 0, 0)
  
  // Extract unique clients
  const uniqueClients = Array.from(new Set(product.invoiceItems.map(item => item.invoice.client.name)))
  
  // Group invoices for a quick preview (latest 5)
  const latestInvoices = product.invoiceItems
    .map(item => item.invoice)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto w-full space-y-10 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Back Link */}
      <div>
        <Link href="/products" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>
      </div>

      {/* Header Profile Section */}
      <div className="relative bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-10 shadow-sm backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/30 shrink-0">
              <Package size={36} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
                  {product.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-500/20">
                  <Percent size={14} />
                  <span>{product.gstRate}% GST</span>
                </div>
                {product.hsn && (
                  <div className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">
                    <Tag size={14} />
                    <span>HSN/SAC {product.hsn}</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-100 dark:border-green-500/20">
                  <Users size={14} />
                  <span>{uniqueClients.length} Buyers</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto w-full md:w-auto">
            <Link 
              href={`/products/${product.slug}/edit`}
              className="flex-1 md:flex-none justify-center inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Edit3 size={16} />
              Edit Item
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Layout for Metrics & Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Financials & Clients */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Key Metrics Card */}
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm backdrop-blur-xl">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
              <TrendingUp size={16} /> Financial Overview
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Selling Price</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">
                    ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 mb-1">
                    {product.taxInclusive ? 'incl. tax' : 'excl. tax'}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Purchase Cost</p>
                <div className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
                  ₹{product.purchasePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Lifetime Revenue</p>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{saleAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                {totalDiscount > 0 && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Discounts</p>
                    <div className="text-lg font-bold text-red-500">
                      -₹{totalDiscount.toLocaleString('en-IN')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buyers List Card */}
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm backdrop-blur-xl">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
              <Users size={16} /> Client Directory ({uniqueClients.length})
            </h3>
            
            {uniqueClients.length === 0 ? (
              <div className="text-center p-6 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 font-medium">No sales recorded yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {uniqueClients.map(client => (
                  <div key={client} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950/50 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {client.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200 line-clamp-1">
                      {client}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Transactions History */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-sm backdrop-blur-xl h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/20">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-zinc-400" /> Sales Ledger
              </h3>
            </div>
            
            <div className="flex-1 p-0">
              <ProductTransactionsClient invoiceItems={product.invoiceItems} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

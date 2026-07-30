export const dynamic = 'force-dynamic'
import { getProducts } from './actions'
import Link from 'next/link'
import DeleteProductButton from './DeleteProductButton'
import { Box, Plus, Tag, Percent, IndianRupee, Package, ArrowRight } from 'lucide-react'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-7xl mx-auto space-y-10 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-zinc-200 dark:border-zinc-800/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900/30">
              <Package size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Products & Services
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium pl-[52px]">
            Manage your service catalog, pricing models, and tax rates.
          </p>
        </div>
        <Link 
          href="/products/new" 
          className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <Plus size={18} className="relative z-10" /> 
          <span className="relative z-10">Add Item</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="relative overflow-hidden p-16 text-center bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl backdrop-blur-xl group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 opacity-50"></div>
          <Box size={56} className="mx-auto mb-5 text-zinc-300 dark:text-zinc-700 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10">Your catalog is empty</h3>
          <p className="text-zinc-500 max-w-sm mx-auto mb-8 relative z-10">Build out your product and service offerings to easily add them to estimates and invoices.</p>
          <Link 
            href="/products/new" 
            className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-sm text-zinc-900 dark:text-white relative z-10 hover:-translate-y-0.5"
          >
            Create your first item <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const uniqueClients = Array.from(new Set(product.invoiceItems.map(item => item.invoice.client.name)))
            
            return (
              <div 
                key={product.id} 
                className="group relative bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col backdrop-blur-xl"
              >
                {/* Decorative Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-50/50 dark:to-zinc-800/10 rounded-2xl pointer-events-none"></div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <DeleteProductButton id={product.id} />
                </div>
                
                <div className="flex-1 relative z-10">
                  <div className="mb-4">
                    <Link href={`/products/${product.slug}`} className="inline-block">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    {product.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1.5 font-medium leading-relaxed">{product.description}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3 mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 mb-0.5">Price</span>
                        <div className="flex items-center gap-1 text-zinc-900 dark:text-white font-black text-xl">
                          <IndianRupee size={16} className="text-zinc-400" />
                          <span>{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      
                      {product.discount > 0 && (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-red-400 mb-0.5">Discount</span>
                          <span className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-md">
                            -₹{product.discount}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-[11px] font-bold border border-blue-100 dark:border-blue-500/20">
                        <Percent size={12} />
                        <span>{product.gstRate}% GST</span>
                      </div>
                      {product.hsn && (
                        <div className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-md text-[11px] font-bold border border-zinc-200 dark:border-zinc-700">
                          <Tag size={12} />
                          <span>HSN {product.hsn}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


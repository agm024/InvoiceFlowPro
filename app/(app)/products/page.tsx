export const dynamic = 'force-dynamic'
import { getProducts } from './actions'
import Link from 'next/link'
import DeleteProductButton from './DeleteProductButton'
import { Box, Plus, Tag, Percent, IndianRupee } from 'lucide-react'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products & Services</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your catalog, pricing, and tax rates.</p>
        </div>
        <Link 
          href="/products/new" 
          className="bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5"
        >
          <Plus size={16} /> Add Item
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <Box size={48} className="mx-auto mb-4 text-zinc-400" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No items found</h3>
          <p className="mb-6">Add your first product or service to the catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const uniqueClients = Array.from(new Set(product.invoiceItems.map(item => item.invoice.client.name)))
            
            return (
              <div key={product.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteProductButton id={product.id} />
                </div>
                
                <div className="flex-1">
                  <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:underline mb-2">{product.name}</h3>
                  </Link>
                  {product.description && (
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{product.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <IndianRupee size={14} />
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">₹{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Percent size={14} />
                      <span>{product.gstRate}% GST</span>
                    </div>
                    {product.hsn && (
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Tag size={14} />
                        <span className="text-xs">HSN: {product.hsn}</span>
                      </div>
                    )}
                    {product.discount > 0 && (
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <span className="text-red-500 text-xs font-semibold">-₹{product.discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {uniqueClients.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <details className="text-xs text-zinc-500 group/details">
                      <summary className="cursor-pointer hover:text-zinc-900 dark:hover:text-white list-none flex justify-between items-center font-medium transition-colors">
                        Purchased by {uniqueClients.length} client(s) 
                        <span className="text-[10px] group-open/details:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {uniqueClients.map(client => (
                          <span key={client} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded-md text-[10px] font-medium tracking-wide">
                            {client}
                          </span>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


import { getProducts, deleteProduct } from './actions'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Products & Services</h1>
        <Link 
          href="/products/new" 
          className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Add Item
        </Link>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p>No items found. Add your first product or service.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[700px]">
              <thead className="bg-sidebar-bg text-zinc-500 border-b border-sidebar-border uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">HSN/SAC</th>
                  <th className="px-6 py-4 font-medium">Base Price</th>
                  <th className="px-6 py-4 font-medium">Discount</th>
                  <th className="px-6 py-4 font-medium">GST Rate</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sidebar-border">
                {products.map((product) => {
                  const uniqueClients = Array.from(new Set(product.invoiceItems.map(item => item.invoice.client.name)))
                  
                  return (
                    <tr key={product.id} className="hover:bg-sidebar-bg/50 transition-colors text-foreground group">
                      <td className="px-6 py-4 font-medium min-w-[300px]">
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          {product.description && <span className="text-zinc-500 text-xs mt-1">{product.description}</span>}
                          {uniqueClients.length > 0 && (
                            <details className="mt-2 text-xs text-zinc-500">
                              <summary className="cursor-pointer hover:text-foreground list-none flex gap-1 items-center font-semibold">
                                Purchased by {uniqueClients.length} client(s) <span className="text-[10px]">▼</span>
                              </summary>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {uniqueClients.map(client => (
                                  <span key={client} className="bg-sidebar-border px-2 py-1 rounded">{client}</span>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{product.hsn || '-'}</td>
                      <td className="px-6 py-4 font-medium">₹{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-zinc-500">{product.discount > 0 ? `₹${product.discount.toFixed(2)}` : '-'}</td>
                      <td className="px-6 py-4 text-zinc-500">{product.gstRate}%</td>
                      <td className="px-6 py-4 text-right align-top">
                        <form action={async () => {
                          'use server'
                          await deleteProduct(product.id)
                        }}>
                          <button className="text-red-500 hover:text-red-600 text-xs font-medium bg-red-500/10 px-2 py-1 rounded">Delete</button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

import { createProduct } from '../actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function NewProductPage() {
  async function handleSubmit(formData: FormData) {
    'use server'
    const res = await createProduct(formData)
    if (res.success) {
      redirect('/products')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <Link href="/products" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
          &larr; Back to Products
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Product/Service</h1>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm p-6">
        <form action={handleSubmit} className="flex flex-col gap-6 text-foreground">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name *</label>
            <input name="name" required className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground" placeholder="e.g. Website Design" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea name="description" rows={3} className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Base Price (₹) *</label>
              <input type="number" step="0.01" name="price" required className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GST Rate (%)</label>
              <select name="gstRate" defaultValue="18" className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground">
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">HSN/SAC Code</label>
              <input name="hsn" className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-card-border">
            <button type="submit" className="bg-foreground text-background px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

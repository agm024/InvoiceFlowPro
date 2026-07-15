import { createClient } from '../actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function NewClientPage() {
  async function handleSubmit(formData: FormData) {
    'use server'
    const res = await createClient(formData)
    if (res.success) {
      redirect('/clients')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <Link href="/clients" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
          &larr; Back to Clients
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Client</h1>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm p-6">
        <form action={handleSubmit} className="flex flex-col gap-6 text-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Company / Client Name *</label>
              <input name="name" required className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GSTIN</label>
              <input name="gstin" className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground uppercase" placeholder="e.g. 29ABCDE1234F1Z5" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
              <input type="email" name="email" className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
              <input type="tel" name="phone" className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Billing Address</label>
            <textarea name="address" rows={3} className="rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-foreground resize-none" />
          </div>

          <div className="flex justify-end pt-4 border-t border-card-border">
            <button type="submit" className="bg-foreground text-background px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

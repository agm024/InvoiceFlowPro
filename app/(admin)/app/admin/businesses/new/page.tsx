import { createCompany } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { requireSuperAdmin } from '@/lib/auth-context'

export default async function NewCompanyPage() {
  await requireSuperAdmin()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link href="/app/admin/businesses" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 text-sm font-medium mb-4 transition">
          <ArrowLeft size={16} /> Back to Businesses
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Onboard New Company</h1>
        <p className="text-zinc-500 mt-2">Manually create a new tenant workspace in the system.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm p-8">
        <form action={createCompany} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Company Name</label>
            <input type="text" name="name" required placeholder="e.g. Acme Corp" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-transparent focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors" />
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <Link href="/app/admin/businesses" className="px-6 py-2.5 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
              Cancel
            </Link>
            <button type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition flex items-center gap-2">
              <Save size={18} /> Create Company
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

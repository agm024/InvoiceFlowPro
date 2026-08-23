import { cookies } from 'next/headers'
import { stopImpersonation } from '@/app/(admin)/app/admin/impersonate-actions'
import { AlertCircle } from 'lucide-react'

export default async function ImpersonationBanner() {
  const cookieStore = await cookies()
  const isImpersonating = !!cookieStore.get('impersonatedCompanyId')?.value

  if (!isImpersonating) return null

  return (
    <div className="bg-orange-500 text-white px-4 py-2 flex items-center justify-between text-sm font-medium z-50 fixed top-0 w-full">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} />
        <span>You are currently impersonating a tenant company. All actions are logged.</span>
      </div>
      <form action={stopImpersonation}>
        <button type="submit" className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition">
          Exit Impersonation
        </button>
      </form>
    </div>
  )
}

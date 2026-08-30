import { requireSuperAdmin } from "@/lib/auth-context"
import { AdminSidebar } from "./AdminSidebar"
import { LogOut, ArrowLeft } from "lucide-react"
import { signOut } from "@/auth"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSuperAdmin()

  const signOutAction = async () => {
    "use server"
    await signOut({ redirectTo: '/sign-in' })
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <AdminSidebar />
      <main className="flex-1 flex flex-col  h-screen overflow-y-auto">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg">Super Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/app" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-2">
              <ArrowLeft size={16} /> Exit to App
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2">
                <LogOut size={16} /> Sign Out
              </button>
            </form>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

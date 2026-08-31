import { requireSuperAdmin, getCurrentUser } from "@/lib/auth-context"
import { AdminSidebar } from "./AdminSidebar"
import { AdminHeader } from "./AdminHeader"
import { signOut } from "@/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSuperAdmin()
  const user = await getCurrentUser()

  const signOutAction = async () => {
    "use server"
    await signOut({ redirectTo: '/sign-in' })
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <AdminHeader user={user} signOutAction={signOutAction} />
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}

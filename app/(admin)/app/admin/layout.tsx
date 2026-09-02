import { requireSuperAdmin, getCurrentUser } from "@/lib/auth-context"
import { AdminSidebar } from "./AdminSidebar"
import { AdminHeader } from "./AdminHeader"
import AdminLayoutClient from "./AdminLayoutClient"
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
    <AdminLayoutClient 
      sidebar={<AdminSidebar />} 
      header={<AdminHeader user={user} signOutAction={signOutAction} />}
    >
      {children}
    </AdminLayoutClient>
  )
}

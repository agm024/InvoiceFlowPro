import { requireSuperAdmin } from "@/lib/auth-context"
import { Construction } from "lucide-react"

export default async function EmailTemplatesPage() {
  await requireSuperAdmin()

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="p-4 bg-blue-50 text-blue-500 rounded-full dark:bg-blue-900/30">
        <Construction size={48} />
      </div>
      <h1 className="text-2xl font-bold">Email Templates</h1>
      <p className="text-zinc-500 max-w-md">
        This module is currently under construction. Soon, you will be able to customize automated transactional emails (like invoice reminders and receipts) directly from the platform.
      </p>
    </div>
  )
}

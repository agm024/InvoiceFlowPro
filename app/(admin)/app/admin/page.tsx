import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import Link from "next/link"
import { Building2, CreditCard, Activity, Users } from "lucide-react"

export default async function AdminDashboard() {
  await requireSuperAdmin()

  // Platform Metrics
  const activeBusinessesCount = await prisma.company.count({ where: { status: "ACTIVE" } })
  const trialBusinessesCount = await prisma.company.count({ where: { status: "TRIAL" } })
  const activeSubscriptionsCount = await prisma.subscription.count({ where: { status: "active" } })
  
  const totalRevenueResult = await prisma.platformPayment.aggregate({
    _sum: { convertedAmountInr: true },
    where: { status: "SUCCESS" }
  })
  const intlRevenueResult = await prisma.platformPayment.aggregate({
    _sum: { convertedAmountInr: true },
    where: { status: "SUCCESS", originalCurrency: { not: "INR" } }
  })

  const totalRevenue = totalRevenueResult._sum.convertedAmountInr || 0
  const intlRevenue = intlRevenueResult._sum.convertedAmountInr || 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4 text-zinc-500 mb-4">
            <Activity size={20} />
            <h3 className="text-sm font-medium">Total Platform Revenue</h3>
          </div>
          <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4 text-zinc-500 mb-4">
            <CreditCard size={20} />
            <h3 className="text-sm font-medium">International Revenue</h3>
          </div>
          <p className="text-3xl font-bold">₹{intlRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4 text-zinc-500 mb-4">
            <Building2 size={20} />
            <h3 className="text-sm font-medium">Active Businesses</h3>
          </div>
          <p className="text-3xl font-bold">{activeBusinessesCount}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4 text-zinc-500 mb-4">
            <Users size={20} />
            <h3 className="text-sm font-medium">Active Subscriptions</h3>
          </div>
          <p className="text-3xl font-bold">{activeSubscriptionsCount}</p>
          <p className="text-xs text-zinc-500 mt-2">{trialBusinessesCount} currently on trial</p>
        </div>
      </div>
    </div>
  )
}

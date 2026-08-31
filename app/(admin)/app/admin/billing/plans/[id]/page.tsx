import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { savePlan } from "../actions"
import Link from "next/link"

export default async function EditPlanPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireSuperAdmin()
  const isNew = params.id === "new"
  
  let plan = null
  if (!isNew) {
    plan = await prisma.plan.findUnique({ where: { id: params.id } })
    if (!plan) return <div>Plan not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/admin/billing/plans" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">&larr; Back</Link>
        <h1 className="text-2xl font-bold">{isNew ? "Create Plan" : "Edit Plan"}</h1>
      </div>
      
      <form action={savePlan} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
        {plan && <input type="hidden" name="id" value={plan.id} />}
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Plan Name</label>
              <input type="text" name="name" defaultValue={plan?.name || ""} required className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg" />
            </div>
            <div className="pt-8">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="isPopular" defaultChecked={plan?.isPopular} className="rounded border-zinc-300" />
                Mark as "Most Popular"
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Price</label>
              <input type="number" step="0.01" name="monthlyPrice" defaultValue={plan?.monthlyPrice ?? 0} required className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Yearly Price</label>
              <input type="number" step="0.01" name="yearlyPrice" defaultValue={plan?.yearlyPrice ?? 0} required className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select name="currency" defaultValue={plan?.currency || "INR"} className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Trial Period (Days)</label>
              <input type="number" name="trialPeriod" defaultValue={plan?.trialPeriod ?? 14} required className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" name="displayOrder" defaultValue={plan?.displayOrder ?? 0} required className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg" />
              <p className="text-xs text-zinc-500 mt-1">Order on the pricing page (0 is first).</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">User Limits</label>
              <input type="number" name="userLimits" placeholder="Unlimited" defaultValue={plan?.userLimits ?? ""} className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold" />
              <p className="text-[10px] text-zinc-400 mt-1">Leave empty for unlimited</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Client Limits</label>
              <input type="number" name="clientLimits" placeholder="Unlimited" defaultValue={plan?.clientLimits ?? ""} className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold" />
              <p className="text-[10px] text-zinc-400 mt-1">Leave empty for unlimited</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Invoice Limits</label>
              <input type="number" name="invoiceLimits" placeholder="Unlimited" defaultValue={plan?.invoiceLimits ?? ""} className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold" />
              <p className="text-[10px] text-zinc-400 mt-1">Leave empty for unlimited</p>
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            {isNew ? "Create Plan" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

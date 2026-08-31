"use client"

import { useState, useTransition } from "react"
import { 
  Building2, Users, FileText, Activity, ShieldCheck, LifeBuoy, 
  ArrowLeft, Lock, Trash2, CheckCircle2, XCircle, AlertTriangle, 
  Settings, Mail, ShieldAlert, History, ReceiptText, Plus
} from "lucide-react"
import Link from "next/link"
import { 
  suspendCompany, reactivateCompany, archiveCompany, 
  changeCompanyPlan, cancelCompanySubscription 
} from "../actions"
import { impersonateCompany } from "../../impersonate-actions"

interface Plan {
  id: string
  name: string
  userLimits: number | null
  clientLimits: number | null
  invoiceLimits: number | null
  monthlyPrice: number
  yearlyPrice: number
  currency: string
}

interface CompanyDetails {
  id: string
  name: string
  status: string
  createdAt: string
  supportAccessGranted: boolean
  subscription?: {
    id: string
    plan: Plan
    status: string
    billingInterval: string
    currentPeriodEnd: string | null
  } | null
}

interface UserRow {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

interface InvoiceRow {
  id: string
  invoiceNumber: string
  date: string
  total: number
  currency: string
  status: string
}

interface PaymentRow {
  id: string
  originalAmount: number
  originalCurrency: string
  convertedAmountInr: number
  createdAt: string
  gatewayTransactionId: string | null
  status: string
}

interface AuditLogRow {
  id: string
  action: string
  adminId: string
  metadata: string | null
  ipAddress: string | null
  createdAt: string
}

interface TicketRow {
  id: string
  subject: string
  status: string
  priority: string
  createdAt: string
}

interface BusinessDetailsClientProps {
  company: CompanyDetails
  users: UserRow[]
  invoices: InvoiceRow[]
  payments: PaymentRow[]
  activityLogs: AuditLogRow[]
  tickets: TicketRow[]
  plans: Plan[]
  adminImpersonating: boolean
}

export function BusinessDetailsClient({
  company,
  users,
  invoices,
  payments,
  activityLogs,
  tickets,
  plans,
  adminImpersonating
}: BusinessDetailsClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "invoices" | "payments" | "subscriptions" | "activity" | "support" | "security">("overview")
  const [isPending, startTransition] = useTransition()
  
  // Action Modals State
  const [showImpersonateModal, setShowImpersonateModal] = useState(false)
  const [impersonateReason, setImpersonateReason] = useState("")
  const [impersonateAllowWrite, setImpersonateAllowWrite] = useState(false)

  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [suspendReason, setSuspendReason] = useState("")

  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState(company.subscription?.plan?.id || "")
  const [planChangeReason, setPlanChangeReason] = useState("")

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [archiveReason, setArchiveReason] = useState("")

  // Form handlers
  const handleImpersonate = () => {
    if (!impersonateReason.trim()) return alert("Reason is required.")
    startTransition(async () => {
      try {
        await impersonateCompany(company.id, impersonateReason, impersonateAllowWrite)
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  const handleSuspend = () => {
    if (!suspendReason.trim()) return alert("Reason is required.")
    startTransition(async () => {
      try {
        if (company.status === "ACTIVE") {
          await suspendCompany(company.id, suspendReason)
          setShowSuspendModal(false)
          setSuspendReason("")
        } else {
          await reactivateCompany(company.id, suspendReason)
          setShowSuspendModal(false)
          setSuspendReason("")
        }
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  const handlePlanChange = () => {
    if (!planChangeReason.trim()) return alert("Reason is required.")
    startTransition(async () => {
      try {
        await changeCompanyPlan(company.id, selectedPlanId, planChangeReason)
        setShowPlanModal(false)
        setPlanChangeReason("")
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  const handleCancelSub = () => {
    if (!cancelReason.trim()) return alert("Reason is required.")
    startTransition(async () => {
      try {
        await cancelCompanySubscription(company.id, cancelReason)
        setShowCancelModal(false)
        setCancelReason("")
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  const handleArchive = () => {
    if (!archiveReason.trim()) return alert("Reason is required.")
    startTransition(async () => {
      try {
        await archiveCompany(company.id, archiveReason)
        setShowArchiveModal(false)
        setArchiveReason("")
      } catch (err: any) {
        alert(err.message)
      }
    })
  }

  const userLimit = company.subscription?.plan?.userLimits ?? null
  const clientLimit = company.subscription?.plan?.clientLimits ?? null
  const invoiceLimit = company.subscription?.plan?.invoiceLimits ?? null

  const planName = company.subscription?.plan?.name || "No Plan"
  const price = (company.subscription?.billingInterval === "year" 
    ? company.subscription?.plan?.yearlyPrice 
    : company.subscription?.plan?.monthlyPrice) ?? 0
  const currency = company.subscription?.plan?.currency || "INR"

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back button and page title */}
      <div>
        <Link 
          href="/app/admin/businesses" 
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 text-xs font-semibold mb-4 transition"
        >
          <ArrowLeft size={14} /> Back to Businesses
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold flex items-center justify-center text-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
              {company.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{company.name}</h1>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold">
                <span className={`px-2 py-0.5 rounded-full ${
                  company.status === "ACTIVE" 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                    : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                }`}>
                  {company.status}
                </span>
                <span className="text-zinc-400">ID: {company.id}</span>
              </div>
            </div>
          </div>

          {/* Quick Management Buttons */}
          <div className="flex items-center gap-2">
            {/* View as Company (Impersonate) */}
            <button
              onClick={() => setShowImpersonateModal(true)}
              disabled={!company.supportAccessGranted || adminImpersonating}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm flex items-center gap-1.5 ${
                company.supportAccessGranted && !adminImpersonating
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {!company.supportAccessGranted && <Lock size={12} />}
              View as Company
            </button>

            {/* Suspend / Reactivate */}
            <button
              onClick={() => setShowSuspendModal(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm ${
                company.status === "ACTIVE"
                  ? "border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  : "border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              }`}
            >
              {company.status === "ACTIVE" ? "Suspend Business" : "Reactivate"}
            </button>

            {/* Soft Delete Archive */}
            {company.status !== "ARCHIVED" && (
              <button
                onClick={() => setShowArchiveModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition shadow-sm flex items-center gap-1"
              >
                <Trash2 size={12} /> Archive
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto select-none">
        {(["overview", "users", "invoices", "payments", "subscriptions", "activity", "support", "security"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap -mb-px ${
              activeTab === tab 
                ? "border-zinc-900 dark:border-white text-zinc-900 dark:text-white" 
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* OVERVIEW PANEL */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick stats & Profile */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">Business Metrics</h3>
              
              <div className="grid grid-cols-3 gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Users</span>
                  <p className="text-2xl font-bold mt-1 text-zinc-800 dark:text-zinc-200">{users.length}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Clients</span>
                  <p className="text-2xl font-bold mt-1 text-zinc-800 dark:text-zinc-200">{invoices.length > 0 ? "Active" : "None"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Total Invoices</span>
                  <p className="text-2xl font-bold mt-1 text-zinc-800 dark:text-zinc-200">{invoices.length}</p>
                </div>
              </div>

              {/* Resource usage vs limits */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Resource Limits Usage</h4>
                
                {/* Users Limit */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-500">Users Limit ({users.length} active)</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{userLimit === null ? "Unlimited" : `${userLimit} max`}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: userLimit === null ? "20%" : `${Math.min((users.length / userLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Invoices Limit */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-500">Invoices Limit ({invoices.length} created)</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{invoiceLimit === null ? "Unlimited" : `${invoiceLimit} max`}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: invoiceLimit === null ? "10%" : `${Math.min((invoices.length / invoiceLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Info Card */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">Active Plan</h3>
                
                <div className="mt-4">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{planName}</h4>
                  <p className="text-2xl font-bold mt-2 text-zinc-800 dark:text-zinc-200">
                    {currency === "USD" ? "$" : "₹"}{price.toLocaleString()}
                    <span className="text-xs text-zinc-400 font-semibold uppercase"> / {company.subscription?.billingInterval || "month"}</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    Status: <span className="font-semibold text-emerald-500 capitalize">{company.subscription?.status || "active"}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-6">
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 py-2 rounded-lg text-xs font-semibold transition"
                >
                  Change Plan
                </button>
                {company.subscription?.status !== "canceled" && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* USERS PANEL */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                      <td className="px-6 py-4 text-zinc-900 dark:text-white font-semibold">{u.name || "No Name"}</td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 capitalize">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVOICES PANEL */}
        {activeTab === "invoices" && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                      <td className="px-6 py-4 text-zinc-900 dark:text-white font-semibold">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 text-zinc-500">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                        {inv.currency === "USD" ? "$" : "₹"}{inv.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full capitalize ${
                          inv.status === "paid" 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No invoices generated.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS PANEL */}
        {activeTab === "payments" && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Txn ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Original Amount</th>
                    <th className="px-6 py-4">INR Equivalent</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                      <td className="px-6 py-4 text-zinc-900 dark:text-white font-mono">{p.gatewayTransactionId || p.id}</td>
                      <td className="px-6 py-4 text-zinc-400">{new Date(p.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                        {p.originalCurrency === "USD" ? "$" : "₹"}{p.originalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-zinc-900 dark:text-white">
                        ₹{p.convertedAmountInr.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full ${
                          p.status === "SUCCESS" 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                            : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No SaaS payments registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBSCRIPTIONS LIFE PANEL */}
        {activeTab === "subscriptions" && (
          <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">Subscription Timeline & Billing History</h3>
            
            <div className="grid grid-cols-2 gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6 text-xs">
              <div>
                <p className="text-zinc-400 font-semibold">Start Billing Date</p>
                <p className="text-sm font-bold mt-1 text-zinc-800 dark:text-zinc-200">{new Date(company.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-zinc-400 font-semibold">Next Invoice Billing Date</p>
                <p className="text-sm font-bold mt-1 text-zinc-800 dark:text-zinc-200">
                  {company.subscription?.currentPeriodEnd 
                    ? new Date(company.subscription.currentPeriodEnd).toLocaleDateString() 
                    : "End of billing cycle"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-zinc-500">Billing Timeline Actions Log</h4>
              <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-4 ml-2 space-y-4 text-xs">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Subscription Registered</p>
                  <p className="text-zinc-400 text-[10px]">{new Date(company.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUDIT ACTIVITY PANEL */}
        {activeTab === "activity" && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Admin ID</th>
                    <th className="px-6 py-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  {activityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                      <td className="px-6 py-4 text-zinc-400">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono font-bold text-zinc-800 dark:text-zinc-200">{log.action}</td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{log.adminId}</td>
                      <td className="px-6 py-4 text-zinc-500 font-mono">{log.ipAddress || "unknown"}</td>
                    </tr>
                  ))}
                  {activityLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No activity logged for this company.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUPPORT PANEL */}
        {activeTab === "support" && (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                      <td className="px-6 py-4 text-zinc-900 dark:text-white font-semibold">{t.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === "URGENT" || t.priority === "HIGH" 
                            ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400" 
                            : "bg-zinc-100 text-zinc-500"
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize text-zinc-700 dark:text-zinc-300">{t.status.toLowerCase()}</td>
                      <td className="px-6 py-4 text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No support tickets created.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECURITY PANEL */}
        {activeTab === "security" && (
          <div className="bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">Active Login Sessions</h3>
            <p className="text-xs text-zinc-500">Session and device authentication summaries managed by platform auth controls.</p>
            <div className="text-xs text-zinc-500 border border-zinc-100 dark:border-zinc-900 p-4 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
              No active anomalies detected. All logins secure.
            </div>
          </div>
        )}
      </div>

      {/* --- ACTION MODALS --- */}
      
      {/* 1. Impersonate Reason Modal */}
      {showImpersonateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Request Tenant Impersonation</h3>
            <p className="text-xs text-zinc-500">Accessing this workspace requires a documented security ticket reason.</p>
            
            <div className="space-y-3 text-xs font-semibold">
              <label className="block text-zinc-600 dark:text-zinc-400">Explicit Reason</label>
              <textarea 
                rows={3}
                placeholder="e.g. Debugging client portal invoice receipt discrepancies."
                value={impersonateReason}
                onChange={(e) => setImpersonateReason(e.target.value)}
                className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={impersonateAllowWrite}
                  onChange={(e) => setImpersonateAllowWrite(e.target.checked)}
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Enable Write Permissions (Logged as Critical Action)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
              <button 
                onClick={() => setShowImpersonateModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button 
                onClick={handleImpersonate}
                disabled={isPending}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {isPending ? "Connecting..." : "Confirm & Launch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Suspend/Reactivate Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              {company.status === "ACTIVE" ? "Suspend Business" : "Reactivate Business"}
            </h3>
            <p className="text-xs text-zinc-500">Provide an administrative comment details log before executing.</p>
            
            <div className="space-y-2 text-xs font-semibold">
              <label className="block text-zinc-600 dark:text-zinc-400">Reason / Comment</label>
              <textarea 
                rows={3}
                placeholder="Write reason details..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
              <button 
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSuspend}
                disabled={isPending}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Executing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Change Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Change Subscription Plan</h3>
            <p className="text-xs text-zinc-500">Select the plan to migrate this tenant company to.</p>
            
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Target Plan</label>
                <select 
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.currency === "USD" ? "$" : "₹"}{p.monthlyPrice}/mo)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">Reason / Notes</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Client requested upgrade to custom limits."
                  value={planChangeReason}
                  onChange={(e) => setPlanChangeReason(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
              <button 
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button 
                onClick={handlePlanChange}
                disabled={isPending}
                className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Migrating..." : "Update Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-600">Cancel Subscription</h3>
            <p className="text-xs text-zinc-500">Are you sure you want to cancel subscription access immediately?</p>
            
            <div className="space-y-2 text-xs font-semibold">
              <label className="block text-zinc-600 dark:text-zinc-400">Comment / Reason</label>
              <textarea 
                rows={3}
                placeholder="Reason..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCancelSub}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Archive Business Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-600">Archive Company (Soft Delete)</h3>
            <p className="text-xs text-zinc-500">This soft-deletes the company, revoking portal access. Data remains in database.</p>
            
            <div className="space-y-2 text-xs font-semibold">
              <label className="block text-zinc-600 dark:text-zinc-400">Archival Reason</label>
              <textarea 
                rows={3}
                placeholder="Provide archival explanation..."
                value={archiveReason}
                onChange={(e) => setArchiveReason(e.target.value)}
                className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
              <button 
                onClick={() => setShowArchiveModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleArchive}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Archiving..." : "Archive Business"}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

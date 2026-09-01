'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Building2, Receipt, FileText, Download, CreditCard, CheckCircle, HelpCircle, Briefcase, User, MapPin, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { updateClientProfile, updateEstimateStatus, signProjectContract, signOffProject } from './actions'
import SignatureModal from './SignatureModal'

export default function PortalClient({ 
  client, 
  unpaidInvoices, 
  paidInvoices, 
  outstandingBalance, 
  companySettings 
}: {
  client: any,
  unpaidInvoices: any[],
  paidInvoices: any[],
  outstandingBalance: number,
  companySettings: any
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'dashboard'

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const [isUpdating, setIsUpdating] = useState(false)
  const [signatureModal, setSignatureModal] = useState<{ isOpen: boolean, type: 'contract' | 'handover', projectId: string, projectName: string, contractText?: string | null } | null>(null)

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      address: formData.get('address') as string,
      gstin: formData.get('gstin') as string,
      phone: formData.get('phone') as string,
      panNo: formData.get('panNo') as string,
    }

    const res = await updateClientProfile(client.id, data)
    if (res.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error('Failed to update profile')
    }
    setIsUpdating(false)
  }

  const handleEstimateAction = async (id: string, status: string) => {
    const res = await updateEstimateStatus(id, status)
    if (res.success) {
      toast.success(`Estimate ${status} successfully`)
      // Wait for next.js to refresh since page is dynamic, we can just reload
      window.location.reload()
    } else {
      toast.error('Failed to update estimate')
    }
  }

  const handleSign = async (signature: string) => {
    if (!signatureModal) return
    const { type, projectId } = signatureModal
    
    toast.loading(`Signing ${type}...`, { id: 'sign' })
    let res;
    if (type === 'contract') {
      res = await signProjectContract(projectId, signature)
    } else {
      res = await signOffProject(projectId, signature)
    }

    if (res.success) {
      toast.success(`${type === 'contract' ? 'Contract' : 'Handover document'} signed successfully!`, { id: 'sign' })
      window.location.reload()
    } else {
      toast.error('Error signing document', { id: 'sign' })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950/50 pb-24">
      {signatureModal && (
        <SignatureModal
          isOpen={signatureModal.isOpen}
          onClose={() => setSignatureModal(null)}
          onSign={handleSign}
          type={signatureModal.type}
          projectName={signatureModal.projectName}
          companyName={companySettings?.companyName || 'Your Company'}
          contractText={signatureModal.contractText}
        />
      )}
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="font-semibold text-zinc-900 dark:text-zinc-100">{companySettings?.companyName || 'Your Company'}</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Client Portal</p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto bg-zinc-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{client.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{client.email}</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-6 mt-4 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Receipt },
            { id: 'estimates', label: 'Estimates', icon: FileText },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'profile', label: 'Profile & Billing', icon: User },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white dark:text-zinc-100' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-16 space-y-10">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Financial Overview</h2>
              <Link href={`/statement/${client.id}`} target="_blank" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                <Download size={16} /> Statement of Account
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Outstanding Balance</p>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {unpaidInvoices[0]?.currency || 'INR'} {outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Unpaid Invoices</p>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{unpaidInvoices.length}</h2>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Active Projects</p>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{client.projects?.filter((p: any) => p.status === 'ACTIVE').length || 0}</h2>
              </div>
            </div>

            <section>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Unpaid Invoices</h3>
              {unpaidInvoices.length > 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto">
                  <table className="whitespace-nowrap w-full text-left text-sm">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                        <th className="px-6 py-4 font-medium">Invoice #</th>
                        <th className="px-6 py-4 font-medium">Due Date</th>
                        <th className="px-6 py-4 font-medium text-right">Amount</th>
                        <th className="px-6 py-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {unpaidInvoices.map(invoice => (
                        <tr key={invoice.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                            {invoice.invoiceNumber}
                            <div className="text-xs text-zinc-500 mt-1">{format(new Date(invoice.date), 'MMM dd, yyyy')}</div>
                          </td>
                          <td className="px-6 py-4">
                            {invoice.dueDate ? (
                              <span className={new Date(invoice.dueDate) < new Date() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-zinc-500'}>
                                {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-100">
                            {invoice.currency} {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 items-center">
                              <a href={`mailto:${companySettings?.email || 'billing@company.com'}?subject=Question regarding Invoice ${invoice.invoiceNumber}`} className="text-zinc-400 hover:text-zinc-900 dark:text-white p-1.5 transition-colors" title="Ask a Question">
                                <HelpCircle size={18} />
                              </a>
                              <Link href={`/pay/${invoice.id}`} target="_blank" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1.5 transition-colors" title="View Invoice">
                                <FileText size={18} />
                              </Link>
                              <Link href={`/pay/${invoice.id}`} className="px-3 py-1.5 bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ml-2">
                                <CreditCard size={14} /> Pay Now
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 text-center">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <h4 className="text-lg font-medium text-zinc-900 dark:text-white">All caught up!</h4>
                  <p className="text-zinc-500 mt-1">You have no unpaid invoices.</p>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Payment History</h3>
              {paidInvoices.length > 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto">
                  <table className="whitespace-nowrap w-full text-left text-sm">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                        <th className="px-6 py-4 font-medium">Invoice #</th>
                        <th className="px-6 py-4 font-medium">Date Paid</th>
                        <th className="px-6 py-4 font-medium text-right">Amount</th>
                        <th className="px-6 py-4 font-medium text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {paidInvoices.map(invoice => (
                        <tr key={invoice.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{invoice.invoiceNumber}</td>
                          <td className="px-6 py-4 text-zinc-500">{format(new Date(invoice.updatedAt), 'MMM dd, yyyy')}</td>
                          <td className="px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-100">
                            {invoice.currency} {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/pay/${invoice.id}`} target="_blank" className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg transition-colors inline-flex items-center" title="View Receipt">
                              <FileText size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 text-center border-dashed">
                  <p className="text-zinc-500">No payment history available yet.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ESTIMATES TAB */}
        {activeTab === 'estimates' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Estimates & Quotations</h2>
            {client.estimates?.length > 0 ? (
              <div className="grid gap-4">
                {client.estimates.map((estimate: any) => (
                  <div key={estimate.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{estimate.estimateNumber}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          estimate.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          estimate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {estimate.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">
                        Total: {estimate.currency} {estimate.total.toLocaleString()} • Date: {format(new Date(estimate.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Link href={`/estimates/${estimate.id}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <FileText size={16} /> View
                      </Link>
                      
                      {estimate.status === 'sent' || estimate.status === 'draft' ? (
                        <>
                          <button onClick={() => handleEstimateAction(estimate.id, 'accepted')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                            <CheckCircle size={16} /> Accept
                          </button>
                          <button onClick={() => handleEstimateAction(estimate.id, 'rejected')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors">
                            <XCircle size={16} /> Reject
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-zinc-400" />
                <p className="text-zinc-500">No estimates available.</p>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Active Projects</h2>
            {client.projects?.length > 0 ? (
              <div className="grid gap-6">
                {client.projects.map((project: any) => (
                  <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">{project.name}</h3>
                          <p className="text-sm text-zinc-500">Total Value: {project.currency} {project.totalValue.toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                        }`}>
                          {project.status}
                        </span>
                      </div>

                      {/* Timeline / Stage View */}
                      <div className="mt-8 mb-4 overflow-x-auto pb-4 hide-scrollbar">
                        <div className="flex justify-between mb-2 min-w-[600px] px-2">
                          {['PLANNING', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'REVIEW', 'CLOSED'].map((stage, idx, arr) => {
                            const currentIndex = arr.indexOf(project.stage || 'PLANNING')
                            const isPast = idx < currentIndex
                            const isCurrent = idx === currentIndex
                            return (
                              <div key={stage} className="flex flex-col items-center w-full relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                                  isPast ? 'bg-green-500 text-white' :
                                  isCurrent ? 'bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white ring-4 ring-zinc-200 dark:ring-zinc-800' :
                                  'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                }`}>
                                  {isPast ? <CheckCircle size={16} /> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-2 font-medium uppercase tracking-wider text-center ${
                                  isCurrent ? 'text-zinc-900 dark:text-white dark:text-zinc-100' : 'text-zinc-500'
                                }`}>{stage}</span>
                                {idx !== arr.length - 1 && (
                                  <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${
                                    isPast ? 'bg-green-500' : 'bg-zinc-100 dark:bg-zinc-800'
                                  }`}></div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      {/* Sign-Off Actions */}
                      <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-1">Contract Approval</h4>
                          <p className="text-xs text-zinc-500 mb-3">Sign off on the initial project scope.</p>
                          {project.contractApprovedAt ? (
                            <div className="flex flex-col gap-1 mt-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                <CheckCircle size={14} /> 
                                Digitally Signed by {project.contractSignedBy || "Client"}
                              </div>
                              <div className="text-[11px] text-green-700/80 font-mono ml-5 border-l-2 border-green-600/20 pl-2">
                                {format(new Date(project.contractApprovedAt), "MMM dd, yyyy 'at' hh:mm a")}   IP Verified
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setSignatureModal({
                              isOpen: true,
                              type: 'contract',
                              projectId: project.id,
                              projectName: project.name,
                              contractText: project.contractText
                            })} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold w-full transition-colors">
                              Sign Contract
                            </button>
                          )}
                        </div>
                        <div className="flex-1 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-700 pt-4 md:pt-0 pl-0 md:pl-4">
                          <h4 className="font-semibold text-sm text-zinc-900 dark:text-white mb-1">Project Closure</h4>
                          <p className="text-xs text-zinc-500 mb-3">Sign off on the final deliverables.</p>
                          {project.projectClosedAt ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                              <CheckCircle size={14} /> Closed on {format(new Date(project.projectClosedAt), 'MMM dd, yyyy')}
                            </div>
                          ) : (
                            <button onClick={() => setSignatureModal({
                              isOpen: true,
                              type: 'handover',
                              projectId: project.id,
                              projectName: project.name
                            })} disabled={project.stage !== 'REVIEW'} className="px-4 py-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white rounded-lg text-xs font-semibold w-full transition-colors disabled:opacity-50">
                              {project.stage !== 'REVIEW' ? 'Not Ready for Closure' : 'Sign-Off Project'}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                      
                      {/* Active Tasks */}
                      <div className="p-6">
                        <h4 className="text-sm font-black text-zinc-700 dark:text-zinc-300 mb-4 uppercase tracking-wider">Current Tasks</h4>
                        <div className="space-y-3">
                          {project.tasks?.filter((t: any) => t.status !== 'DONE').map((task: any) => {
                            const phaseName = task.status === 'TODO' ? 'Planning' 
                                            : task.status === 'DESIGN' ? 'Design'
                                            : task.status === 'DEVELOPMENT' || task.status === 'IN_PROGRESS' ? 'Development'
                                            : task.status === 'REVIEW' ? 'Review'
                                            : task.status;
                            return (
                            <div key={task.id} className="flex gap-4 items-center bg-white dark:bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
                              <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                              <div className="flex-1">
                                <p className="font-bold text-sm text-zinc-900 dark:text-white">{task.title}</p>
                              </div>
                              <span className="shrink-0 text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-md uppercase tracking-wide">
                                {phaseName}
                              </span>
                            </div>
                            )
                          })}
                          {!project.tasks?.filter((t: any) => t.status !== 'DONE').length && (
                            <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                              <p className="text-xs font-medium text-zinc-500">No active tasks right now.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="p-6">
                        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Billing Milestones</h4>
                        <div className="space-y-3">
                          {project.milestones?.map((milestone: any) => (
                            <div key={milestone.id} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                              <div>
                                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{milestone.name}</p>
                                <p className="text-xs text-zinc-500">{project.currency} {milestone.amount.toLocaleString()}</p>
                              </div>
                              <span className={`text-xs font-semibold ${
                                milestone.status === 'PAID' ? 'text-green-600' : 
                                milestone.status === 'BILLED' ? 'text-orange-500' : 'text-zinc-400'
                              }`}>
                                {milestone.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-12 text-center">
                <Briefcase size={48} className="mx-auto mb-4 text-zinc-400" />
                <p className="text-zinc-500">No active projects.</p>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Profile & Billing Details</h2>
            <form onSubmit={handleProfileUpdate} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 max-w-2xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Company Name</label>
                  <input type="text" value={client.name} disabled className="w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                  <input type="email" value={client.email || ''} disabled className="w-full bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed" />
                  <p className="text-xs text-zinc-500 mt-1">Contact your provider to change email or company name.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone Number</label>
                  <input type="text" name="phone" defaultValue={client.phone || ''} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-zinc-900 dark:ring-white focus:border-zinc-900 dark:focus:border-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Billing Address</label>
                  <textarea name="address" defaultValue={client.address || ''} rows={3} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-zinc-900 dark:ring-white focus:border-zinc-900 dark:focus:border-white outline-none"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">GSTIN</label>
                    <input type="text" name="gstin" defaultValue={client.gstin || ''} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-zinc-900 dark:ring-white focus:border-zinc-900 dark:focus:border-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">PAN Number</label>
                    <input type="text" name="panNo" defaultValue={client.panNo || ''} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-zinc-900 dark:ring-white focus:border-zinc-900 dark:focus:border-white outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button type="submit" disabled={isUpdating} className="bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70">
                  {isUpdating ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
          </div>
        )}
        
      </main>
    </div>
  )
}

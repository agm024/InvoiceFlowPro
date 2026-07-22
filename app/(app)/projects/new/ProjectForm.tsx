'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '../actions'
import { Client } from '@prisma/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

type MilestoneEntry = {
  id: string
  name: string
  isPercentage: boolean
  value: number
}

const CURRENCIES = [
  { symbol: '₹', code: 'INR' },
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: 'A$', code: 'AUD' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'د.إ', code: 'AED' },
]

export default function ProjectForm({ clients }: { clients: Client[] }) {
  const router = useRouter()
  
  const [clientId, setClientId] = useState('')
  const [name, setName] = useState('')
  const [projectCostStr, setProjectCostStr] = useState('')
  const [currency, setCurrency] = useState('INR')
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '₹'

  const [milestones, setMilestones] = useState<MilestoneEntry[]>([
    { id: '1', name: '', isPercentage: true, value: 30 }
  ])
  
  const projectCost = parseFloat(projectCostStr) || 0

  // Calculate the actual amounts for milestones
  const calculatedMilestones = useMemo(() => {
    return milestones.map(m => {
      const amount = m.isPercentage ? (projectCost * (m.value / 100)) : m.value
      return {
        ...m,
        amount,
        percentage: m.isPercentage ? m.value : (projectCost > 0 ? (m.value / projectCost) * 100 : 0)
      }
    })
  }, [milestones, projectCost])

  const totalAllocated = calculatedMilestones.reduce((sum, m) => sum + m.amount, 0)
  const unassignedBalance = projectCost - totalAllocated
  
  const isOverAllocated = unassignedBalance < -0.01 // Small floating point tolerance
  const isExactlyAllocated = Math.abs(unassignedBalance) < 0.01 && projectCost > 0

  const addMilestone = () => {
    setMilestones([
      ...milestones, 
      { id: Date.now().toString(), name: '', isPercentage: true, value: 0 }
    ])
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id))
  }

  const updateMilestone = (id: string, field: keyof MilestoneEntry, val: any) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: val } : m))
  }

  const handleSave = async () => {
    if (!clientId) return toast.error('Please select a client')
    if (!name) return toast.error('Please provide a project name')
    if (projectCost <= 0) return toast.error('Project cost must be greater than 0')
    if (isOverAllocated) return toast.error('Cannot over-allocate project budget')
    if (unassignedBalance > 0.01) return toast.error('Please allocate the entire project ceiling')

    const payload = {
      clientId,
      name,
      totalValue: projectCost,
      currency,
      milestones: calculatedMilestones.map((m, index) => ({
        name: m.name.trim() || `Phase ${index + 1}`,
        percentage: m.isPercentage ? m.value : null,
        amount: m.amount
      }))
    }

    toast.loading('Creating project canvas...', { id: 'save_project' })
    const res = await createProject(payload)
    if (res.error) {
      toast.error(res.error, { id: 'save_project' })
    } else {
      toast.success('Project finalized & locked!', { id: 'save_project' })
      router.push(`/clients`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Data Entry */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-card-bg border border-zinc-200 dark:border-card-border p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Contract Overview</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Client Link</label>
              <div className="relative">
                <select 
                  className="w-full bg-zinc-50 dark:bg-sidebar-bg border-0 ring-1 ring-zinc-200 dark:ring-sidebar-border rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="" className="text-zinc-400">Assign a client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Ceiling & Currency</label>
              <div className="flex gap-2">
                <div className="relative w-28 shrink-0">
                  <select 
                    className="w-full bg-zinc-50 dark:bg-sidebar-bg border-0 ring-1 ring-zinc-200 dark:ring-sidebar-border rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">{currencySymbol}</span>
                  <input 
                    type="number"
                    placeholder="5,00,000"
                    className="w-full bg-zinc-50 dark:bg-sidebar-bg border-0 ring-1 ring-zinc-200 dark:ring-sidebar-border rounded-xl pl-8 pr-4 py-3 text-zinc-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-shadow tabular-nums"
                    value={projectCostStr}
                    onChange={(e) => setProjectCostStr(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Title</label>
              <input 
                type="text"
                placeholder="e.g. Next-Gen Web Application Redesign"
                className="w-full bg-zinc-50 dark:bg-sidebar-bg border-0 ring-1 ring-zinc-200 dark:ring-sidebar-border rounded-xl px-4 py-3 text-zinc-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-shadow"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card-bg border border-zinc-200 dark:border-card-border p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Milestone Phases</h2>
            </div>
            <button 
              onClick={addMilestone} 
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Phase
            </button>
          </div>
          
          <div className="space-y-4">
            {milestones.map((m, index) => {
              const calc = calculatedMilestones[index]
              return (
                <div key={m.id} className="flex gap-4 items-center p-4 bg-zinc-50 dark:bg-sidebar-bg rounded-2xl border border-zinc-100 dark:border-sidebar-border group relative transition-all hover:shadow-md">
                  
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs uppercase tracking-wider">{index + 1}.</span>
                    <input 
                      type="text"
                      className="w-full bg-white dark:bg-card-bg border-0 ring-1 ring-zinc-200 dark:ring-sidebar-border pl-12 pr-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow placeholder-zinc-400"
                      value={m.name}
                      onChange={(e) => updateMilestone(m.id, 'name', e.target.value)}
                      placeholder="Phase Name"
                    />
                  </div>
                  
                  <div className="flex gap-1.5 items-center bg-white dark:bg-card-bg border border-zinc-200 dark:border-sidebar-border rounded-xl p-1 shadow-sm">
                    <input 
                      type="number"
                      className="w-24 bg-transparent px-3 text-right text-sm font-bold text-zinc-900 dark:text-white focus:outline-none tabular-nums"
                      value={m.value || ''}
                      onChange={(e) => updateMilestone(m.id, 'value', parseFloat(e.target.value) || 0)}
                    />
                    <div className="flex bg-zinc-100 dark:bg-sidebar-bg rounded-lg border border-zinc-200 dark:border-sidebar-border text-xs font-bold overflow-hidden p-0.5 gap-0.5">
                      <button 
                        onClick={() => updateMilestone(m.id, 'isPercentage', false)}
                        className={`px-3 py-1.5 rounded-md transition-colors ${!m.isPercentage ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                      >{currencySymbol}</button>
                      <button 
                        onClick={() => updateMilestone(m.id, 'isPercentage', true)}
                        className={`px-3 py-1.5 rounded-md transition-colors ${m.isPercentage ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                      >%</button>
                    </div>
                  </div>
                  
                  <div className="w-28 text-right font-bold text-zinc-900 dark:text-white text-sm tabular-nums bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    {currencySymbol} {calc.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>

                  <button 
                    onClick={() => removeMilestone(m.id)}
                    className="absolute -right-3 -top-3 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-lg shadow-sm scale-90 group-hover:scale-100"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Smart Balance Widget & Actions */}
      <div className="space-y-6">
        <div className={`p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border-2 transition-all duration-500 relative overflow-hidden ${isOverAllocated ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30' : isExactlyAllocated ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30' : 'bg-white dark:bg-card-bg border-zinc-200 dark:border-card-border'}`}>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

          <h2 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 ${isExactlyAllocated ? 'text-emerald-600 dark:text-emerald-400' : isOverAllocated ? 'text-red-600 dark:text-red-400' : 'text-zinc-500'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
            Smart Balance Ledger
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-medium">Project Ceiling</span>
              <span className="font-bold text-zinc-900 dark:text-white tabular-nums">{currencySymbol} {projectCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-medium">Total Allocated</span>
              <span className="font-bold text-zinc-900 dark:text-white tabular-nums">{currencySymbol} {totalAllocated.toLocaleString()}</span>
            </div>
            
            <div className="pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col gap-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${isOverAllocated ? 'text-red-500' : 'text-zinc-500'}`}>Unassigned Scope Balance</span>
                <span className={`font-bold tabular-nums text-3xl tracking-tight ${isOverAllocated ? 'text-red-600 dark:text-red-400' : isExactlyAllocated ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                  {currencySymbol} {unassignedBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {isOverAllocated && (
            <div className="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-3 rounded-xl mb-6 font-medium flex items-start gap-2 border border-red-200 dark:border-red-900/50">
              <span className="mt-0.5">⚠️</span>
              <p>You have over-allocated the agreed ceiling by <b>{currencySymbol}{Math.abs(unassignedBalance).toLocaleString()}</b>. Adjust phases below 0.</p>
            </div>
          )}

          {!isOverAllocated && !isExactlyAllocated && projectCost > 0 && (
            <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl mb-6 font-medium flex items-start gap-2 border border-amber-200 dark:border-amber-900/50">
              <span className="mt-0.5">⏳</span>
              <p>You still have <b>{currencySymbol}{unassignedBalance.toLocaleString()}</b> in unassigned project scope.</p>
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isOverAllocated || !isExactlyAllocated}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
              isExactlyAllocated 
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5' 
              : 'bg-zinc-800 dark:bg-zinc-800 cursor-not-allowed opacity-50 shadow-none'
            }`}
          >
            {isExactlyAllocated && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
            {isExactlyAllocated ? 'Finalize & Lock Document' : 'Balance Phases to Finalize'}
          </button>
          
          <div className="mt-6 text-center">
            <Link href="/projects" className="text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Cancel & Return
            </Link>
          </div>
        </div>
        
        {/* Live Preview Paper Document representation */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-zinc-200 aspect-[1/1.414] relative overflow-hidden text-black hidden xl:block transform rotate-1 hover:rotate-0 transition-transform duration-500 origin-bottom-right">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="relative z-10">
            <h3 className="font-serif text-2xl border-b-2 border-zinc-100 pb-4 mb-6 text-zinc-800 tracking-tight">Milestone Schedule</h3>
            <div className="space-y-4">
              {calculatedMilestones.map((m, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-zinc-100 pb-2">
                  <span className="font-medium text-zinc-600">{m.name || `Phase ${i+1}`}</span>
                  <span className="tabular-nums font-bold text-zinc-900">{currencySymbol} {m.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between text-base font-black border-t-4 border-zinc-900 pt-4 text-zinc-900">
              <span>Total Value</span>
              <span className="tabular-nums">{currencySymbol} {projectCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

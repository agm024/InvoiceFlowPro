'use client'

import { useState } from 'react'
import { Plus, Trash2, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { createExpense, deleteExpense } from './actions'

type Expense = any

export default function ExpensesClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [activeForm, setActiveForm] = useState<'NONE' | 'EXPENSE' | 'GST'>('NONE')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await createExpense(formData)
    if (res.success) {
      toast.success('Record saved successfully!')
      setActiveForm('NONE')
      window.location.reload()
    } else {
      toast.error('Failed to log record')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      const res = await deleteExpense(id)
      if (res.success) {
        setExpenses(expenses.filter(e => e.id !== id))
        toast.success('Record deleted')
      }
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Expenses & Purchases</h1>
          <p className="text-zinc-500">Track vendor bills, input tax credit (ITC), and GST payments.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveForm(activeForm === 'GST' ? 'NONE' : 'GST')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${activeForm === 'GST' ? 'bg-zinc-200 text-zinc-800' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'}`}
          >
            <Plus size={18} /> {activeForm === 'GST' ? 'Cancel' : 'Log GST Payment'}
          </button>
          <button 
            onClick={() => setActiveForm(activeForm === 'EXPENSE' ? 'NONE' : 'EXPENSE')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${activeForm === 'EXPENSE' ? 'bg-zinc-200 text-zinc-800' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'}`}
          >
            <Plus size={18} /> {activeForm === 'EXPENSE' ? 'Cancel' : 'Add Expense'}
          </button>
        </div>
      </div>

      {activeForm === 'EXPENSE' && (
        <div className="bg-card-bg border border-card-border p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4">Log New Expense</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vendor Name (e.g. AWS, Figma)</label>
                <input type="text" name="vendorName" required className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount (Taxable Value)</label>
                <input type="number" step="0.01" name="totalAmount" required className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GST/Tax Amount</label>
                <input type="number" step="0.01" name="taxAmount" required defaultValue="0" className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border">
                  <option value="SOFTWARE">Software / SaaS</option>
                  <option value="HOSTING">Hosting / Cloud</option>
                  <option value="HARDWARE">Hardware / Electronics</option>
                  <option value="OTHER">Other Expense</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-900/30">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="isRcm" className="mt-1 w-4 h-4 text-orange-600 rounded border-gray-300" />
                <div>
                  <div className="font-semibold text-orange-900 dark:text-orange-200 flex items-center gap-2">
                    <ShieldAlert size={16} /> Subject to Reverse Charge (RCM)?
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300/70 mt-1">Check this if purchasing from a foreign vendor who didn't charge Indian GST (e.g. AWS US, OpenAI).</div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer mt-2">
                <input type="checkbox" name="itcEligible" defaultChecked className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" />
                <div>
                  <div className="font-semibold text-foreground">Eligible for Input Tax Credit (ITC)?</div>
                  <div className="text-xs text-zinc-500 mt-1">Check this if you plan to claim ITC on this purchase in GSTR-3B.</div>
                </div>
              </label>
            </div>

            <div className="flex justify-end mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeForm === 'GST' && (
        <div className="bg-green-50/30 border border-green-200 p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4 text-green-800">Log GST Payment to Government</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <input type="hidden" name="category" value="GST_PAYMENT" />
            <input type="hidden" name="taxAmount" value="0" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900">Payment Date</label>
                <input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} className="w-full rounded-md px-4 py-2 bg-white border border-green-200 focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900">Challan / Reference Number (CPIN)</label>
                <input type="text" name="vendorName" placeholder="e.g. CPIN12345678" required className="w-full rounded-md px-4 py-2 bg-white border border-green-200 focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900">Total Amount Paid</label>
                <input type="number" step="0.01" name="totalAmount" required className="w-full rounded-md px-4 py-2 bg-white border border-green-200 focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900">Notes (Optional)</label>
                <input type="text" name="description" placeholder="e.g. GST for July 2026" className="w-full rounded-md px-4 py-2 bg-white border border-green-200 focus:border-green-500 focus:ring-green-500" />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button disabled={isSubmitting} type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save GST Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-card-border bg-zinc-50 dark:bg-sidebar-bg">
          <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Business Expenses</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 dark:bg-sidebar-bg text-zinc-500 text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 border-y border-card-border">Date</th>
              <th className="px-6 py-4 border-y border-card-border">Vendor</th>
              <th className="px-6 py-4 border-y border-card-border">Amount</th>
              <th className="px-6 py-4 border-y border-card-border">Tax</th>
              <th className="px-6 py-4 border-y border-card-border">Flags</th>
              <th className="px-6 py-4 border-y border-card-border text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-sidebar-border text-sm">
            {expenses.filter(e => e.category !== 'GST_PAYMENT').map(exp => (
              <tr key={exp.id} className="hover:bg-zinc-50/50 dark:hover:bg-sidebar-bg/50">
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(exp.date), 'dd MMM yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{exp.vendorName}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{exp.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{exp.taxAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {exp.isRcm && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-semibold">RCM</span>}
                    {exp.itcEligible && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">ITC</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {expenses.filter(e => e.category !== 'GST_PAYMENT').length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No standard expenses logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* GST Payments Section */}
      <div className="bg-card-bg border border-green-200 dark:border-green-900/30 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10">
          <h2 className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">GST Paid to Government</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-50/50 dark:bg-green-900/5 text-green-700/70 dark:text-green-400/70 text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 border-y border-green-100 dark:border-green-900/20">Date</th>
              <th className="px-6 py-4 border-y border-green-100 dark:border-green-900/20">Challan / Ref</th>
              <th className="px-6 py-4 border-y border-green-100 dark:border-green-900/20">Amount Paid</th>
              <th className="px-6 py-4 border-y border-green-100 dark:border-green-900/20 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50 dark:divide-green-900/10 text-sm">
            {expenses.filter(e => e.category === 'GST_PAYMENT').map(exp => (
              <tr key={exp.id} className="hover:bg-green-50 dark:hover:bg-green-900/10">
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(exp.date), 'dd MMM yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700 dark:text-green-300">{exp.vendorName}</td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600 dark:text-green-400">₹{exp.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => handleDelete(exp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {expenses.filter(e => e.category === 'GST_PAYMENT').length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  No GST payments logged yet. Log an expense and select "GST Paid to Govt" category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

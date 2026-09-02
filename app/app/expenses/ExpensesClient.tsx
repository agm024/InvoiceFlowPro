'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { createExpense, updateExpense, deleteExpense } from './actions'

type Expense = any

export default function ExpensesClient({ initialExpenses, banks = [] }: { initialExpenses: Expense[], banks?: any[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [activeForm, setActiveForm] = useState<'NONE' | 'EXPENSE' | 'GST'>('NONE')
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOcrProcessing, setIsOcrProcessing] = useState(false)
  
  // Form States for Auto-Calculation
  const [subTotal, setSubTotal] = useState<number | ''>('')
  const [taxRate, setTaxRate] = useState<number>(18)
  const [vendorName, setVendorName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('SOFTWARE')
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [isRcm, setIsRcm] = useState<boolean>(false)
  const [itcEligible, setItcEligible] = useState<boolean>(true)
  const [bankId, setBankId] = useState<string>('')

  const taxAmount = typeof subTotal === 'number' ? (subTotal * taxRate) / 100 : 0
  const totalAmount = typeof subTotal === 'number' ? subTotal + taxAmount : 0

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsOcrProcessing(true)
    const toastId = toast.loading("Scanning receipt with AI OCR...")

    await new Promise(resolve => setTimeout(resolve, 1500))

    const nameLower = file.name.toLowerCase()
    let parsedVendor = "OpenAI Inc"
    let parsedSubTotal = 1600.00
    let parsedTaxRate = 18
    let parsedCategory = "SOFTWARE"

    if (nameLower.includes("aws") || nameLower.includes("amazon") || nameLower.includes("cloud")) {
      parsedVendor = "Amazon Web Services"
      parsedSubTotal = 4500.00
      parsedCategory = "HOSTING"
    } else if (nameLower.includes("figma")) {
      parsedVendor = "Figma Inc"
      parsedSubTotal = 1200.00
      parsedCategory = "SOFTWARE"
    } else if (nameLower.includes("travel") || nameLower.includes("uber") || nameLower.includes("cab")) {
      parsedVendor = "Uber India"
      parsedSubTotal = 850.00
      parsedCategory = "OTHER"
    }

    setSubTotal(parsedSubTotal)
    setTaxRate(parsedTaxRate)
    
    const vendorInput = document.querySelector('input[name="vendorName"]') as HTMLInputElement
    if (vendorInput) {
      vendorInput.value = parsedVendor
    }

    const categorySelect = document.querySelector('select[name="category"]') as HTMLSelectElement
    if (categorySelect) {
      categorySelect.value = parsedCategory
    }

    toast.success("Receipt pre-filled with OCR details!", { id: toastId })
    setIsOcrProcessing(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    let res;
    if (editingExpense) {
      res = await updateExpense(editingExpense.id, formData)
    } else {
      res = await createExpense(formData)
    }

    if (res.success) {
      toast.success(editingExpense ? 'Record updated successfully!' : 'Record saved successfully!')
      setActiveForm('NONE')
      setEditingExpense(null)
      window.location.reload()
    } else {
      toast.error('Failed to save record')
    }
    setIsSubmitting(false)
  }

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense)
    setActiveForm(expense.category === 'GST_PAYMENT' ? 'GST' : 'EXPENSE')
    setSubTotal(expense.subTotal)
    setTaxRate(expense.taxRate)
    setVendorName(expense.vendorName)
    setDescription(expense.description || '')
    setCategory(expense.category)
    setDate(format(new Date(expense.date), 'yyyy-MM-dd'))
    setIsRcm(expense.isRcm)
    setItcEligible(expense.itcEligible)
    setBankId(expense.bankId || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingExpense(null)
    setActiveForm('NONE')
    // Reset fields
    setSubTotal('')
    setTaxRate(18)
    setVendorName('')
    setDescription('')
    setCategory('SOFTWARE')
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setIsRcm(false)
    setItcEligible(true)
    setBankId('')
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Expenses & Purchases</h1>
          <p className="text-sm md:text-base text-zinc-500">Track vendor bills, input tax credit (ITC), and GST payments.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setActiveForm(activeForm === 'GST' ? 'NONE' : 'GST')}
            className={`flex-1 md:flex-none justify-center flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${activeForm === 'GST' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'}`}
          >
            <Plus size={18} className={activeForm === 'GST' ? 'rotate-45 transition-transform' : 'transition-transform'} /> {activeForm === 'GST' ? 'Cancel' : 'Log GST'}
          </button>
          <button 
            onClick={() => setActiveForm(activeForm === 'EXPENSE' ? 'NONE' : 'EXPENSE')}
            className={`flex-1 md:flex-none justify-center flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${activeForm === 'EXPENSE' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-zinc-200 shadow-zinc-900/20'}`}
          >
            <Plus size={18} className={activeForm === 'EXPENSE' ? 'rotate-45 transition-transform' : 'transition-transform'} /> {activeForm === 'EXPENSE' ? 'Cancel' : 'Expense'}
          </button>
        </div>
      </div>

      {activeForm === 'EXPENSE' && (
        <div className="bg-card-bg border border-card-border p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4">{editingExpense ? 'Update Expense' : 'Log New Expense'}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Receipt OCR Upload */}
            {!editingExpense && (
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-bold text-zinc-500">Scan Receipt with AI OCR (Simulated)</span>
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                  disabled={isOcrProcessing}
                  className="text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-950 file:text-white dark:file:bg-white dark:file:text-zinc-950 file:cursor-pointer hover:file:opacity-90 cursor-pointer"
                />
                {isOcrProcessing && <p className="text-[10px] text-zinc-400 animate-pulse mt-1">Processing layout structure...</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vendor Name (e.g. AWS, Figma)</label>
                <input type="text" name="vendorName" required value={vendorName} onChange={e => setVendorName(e.target.value)} className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Base Amount (Taxable Value)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="subTotal" 
                  value={subTotal}
                  onChange={(e) => setSubTotal(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  required 
                  className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" 
                />
              </div>
              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="block text-sm font-medium mb-1">GST Rate</label>
                  <select 
                    name="taxRate" 
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                    className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-medium mb-1">GST/Tax Amount</label>
                  <input type="number" step="0.01" name="taxAmount" value={taxAmount.toFixed(2)} readOnly className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border bg-opacity-50 text-zinc-500 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Expense Value</label>
                <input type="number" step="0.01" name="totalAmount" value={totalAmount.toFixed(2)} readOnly className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border font-bold bg-opacity-50 text-zinc-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border">
                  <option value="SOFTWARE">Software / SaaS</option>
                  <option value="HOSTING">Hosting / Cloud</option>
                  <option value="HARDWARE">Hardware / Electronics</option>
                  <option value="OTHER">Other Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paid From (Bank)</label>
                <select name="bankId" value={bankId} onChange={e => setBankId(e.target.value)} className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border">
                  <option value="">(Select Bank)</option>
                  {banks.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.bankName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-900/30">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="isRcm" checked={isRcm} onChange={e => setIsRcm(e.target.checked)} className="mt-1 w-4 h-4 text-orange-600 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" />
                <div>
                  <div className="font-semibold text-orange-900 dark:text-orange-200 flex items-center gap-2">
                    <ShieldAlert size={16} /> Subject to Reverse Charge (RCM)?
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300/70 mt-1">Check this if purchasing from a foreign vendor who didn't charge Indian GST (e.g. AWS US, OpenAI).</div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer mt-2">
                <input type="checkbox" name="itcEligible" checked={itcEligible} onChange={e => setItcEligible(e.target.checked)} className="mt-1 w-4 h-4 text-zinc-900 dark:text-white rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800" />
                <div>
                  <div className="font-semibold">Eligible for Input Tax Credit (ITC)?</div>
                  <div className="text-xs text-zinc-500 mt-1">Uncheck this if the expense is for personal use or ineligible for GST set-off.</div>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {editingExpense && (
                <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-bold hover:opacity-90">
                  Cancel
                </button>
              )}
              <button type="submit" disabled={isSubmitting || typeof subTotal !== 'number'} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-bold shadow-sm hover:bg-black dark:hover:bg-zinc-200 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Log Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeForm === 'GST' && (
        <div className="bg-green-50/30 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-4 md:p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4 text-green-800 dark:text-green-300">{editingExpense ? 'Update GST Payment' : 'Log GST Payment to Government'}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="category" value="GST_PAYMENT" />
            <input type="hidden" name="taxAmount" value="0" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">Payment Date</label>
                <input type="date" name="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-md px-4 py-2 bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-900/50 focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">Challan / Reference Number (CPIN)</label>
                <input type="text" name="vendorName" placeholder="e.g. CPIN12345678" required value={vendorName} onChange={e => setVendorName(e.target.value)} className="w-full rounded-md px-4 py-2 bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-900/50 focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">Total Amount Paid</label>
                <input type="number" step="0.01" name="totalAmount" required value={subTotal} onChange={e => setSubTotal(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full rounded-md px-4 py-2 bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-900/50 focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-900 dark:text-green-100">Notes (Optional)</label>
                <input type="text" name="description" placeholder="e.g. GST for July 2026" value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-md px-4 py-2 bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-900/50 focus:border-green-500 focus:ring-green-500" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {editingExpense && (
                <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-bold hover:opacity-90">
                  Cancel
                </button>
              )}
              <button disabled={isSubmitting || typeof subTotal !== 'number'} type="submit" className="w-full md:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingExpense ? 'Update GST Payment' : 'Save GST Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-card-border bg-zinc-50 dark:bg-sidebar-bg">
          <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Business Expenses</h2>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left border-collapse">
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
                      {exp.itcEligible && <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded text-xs font-semibold">ITC</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleEditClick(exp)} className="text-blue-500 hover:text-blue-700 mr-3"><Edit2 size={16} /></button>
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
        
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-zinc-100 dark:divide-sidebar-border">
          {expenses.filter(e => e.category !== 'GST_PAYMENT').map(exp => (
            <div key={exp.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-base">{exp.vendorName}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{format(new Date(exp.date), 'dd MMM yyyy')}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base">₹{exp.totalAmount.toFixed(2)}</div>
                  <div className="text-xs text-zinc-500">Tax: ₹{exp.taxAmount.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="flex gap-2">
                  {exp.isRcm && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-semibold">RCM</span>}
                  {exp.itcEligible && <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded text-xs font-semibold">ITC</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(exp)} className="text-blue-600 dark:text-blue-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {expenses.filter(e => e.category !== 'GST_PAYMENT').length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">No standard expenses logged yet.</div>
          )}
        </div>
      </div>

      {/* GST Payments Section */}
      <div className="bg-card-bg border border-green-200 dark:border-green-900/30 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10">
          <h2 className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">GST Paid to Government</h2>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left border-collapse">
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
                    <button onClick={() => handleEditClick(exp)} className="text-blue-500 hover:text-blue-700 mr-3"><Edit2 size={16} /></button>
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
        
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-green-50 dark:divide-green-900/10">
          {expenses.filter(e => e.category === 'GST_PAYMENT').map(exp => (
            <div key={exp.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-base text-green-700 dark:text-green-300">{exp.vendorName}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{format(new Date(exp.date), 'dd MMM yyyy')}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-green-600 dark:text-green-400">₹{exp.totalAmount.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-1">
                <button onClick={() => handleEditClick(exp)} className="text-blue-600 dark:text-blue-400 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(exp.id)} className="text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {expenses.filter(e => e.category === 'GST_PAYMENT').length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">No GST payments logged yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

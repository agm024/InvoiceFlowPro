'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createInvoice } from '../actions'
import { createClient } from '../../clients/actions'
import { createProduct } from '../../products/actions'
import { Search, Plus, X, Trash2, Edit2, FileText, Banknote } from 'lucide-react'
import toast from 'react-hot-toast'

type Client = { id: string, name: string, email?: string | null, phone?: string | null, gstin?: string | null, panNo?: string | null }
type Product = { id: string, name: string, price: number, gstRate: number, hsn?: string | null }
type Bank = { id: string, bankName: string, accountNumber: string, ifsc?: string | null, swiftCode?: string | null, routingNumber?: string | null, iban?: string | null }
type ExchangeRate = { id: string, currency: string, rate: number }

export default function InvoiceForm({ 
  clients: initialClients, 
  products: initialProducts,
  banks,
  exchangeRates = [],
  defaultInvoiceNumber,
  defaultInvoiceType,
  existingInvoice
}: { 
  clients: Client[], 
  products: Product[],
  banks: Bank[],
  exchangeRates?: ExchangeRate[],
  defaultInvoiceNumber: string,
  defaultInvoiceType?: string,
  existingInvoice?: any
}) {
  const router = useRouter()
  
  // Local Data State
  const [clients, setClients] = useState(initialClients)
  const [products, setProducts] = useState(initialProducts)

  // Invoice Fields
  const [clientId, setClientId] = useState(existingInvoice?.clientId || '')
  const [invoiceNumber, setInvoiceNumber] = useState(existingInvoice?.invoiceNumber || defaultInvoiceNumber)
  const [date, setDate] = useState(existingInvoice?.date ? new Date(existingInvoice.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate ? new Date(existingInvoice.dueDate).toISOString().split('T')[0] : '')
  const [reference, setReference] = useState(existingInvoice?.reference || '')
  
  const [notes, setNotes] = useState(existingInvoice?.notes || '')
  const [invoiceType, setInvoiceType] = useState(existingInvoice?.invoiceType || defaultInvoiceType || 'REGULAR') // REGULAR, EXPORT, QUOTATION
  const [currency, setCurrency] = useState(existingInvoice?.currency || 'INR')
  const [exchangeRate, setExchangeRate] = useState(existingInvoice?.exchangeRate || 1.0)
  const [paymentMethod, setPaymentMethod] = useState(existingInvoice?.paymentMethod || 'UPI')
  const [bankId, setBankId] = useState(existingInvoice?.bankId || '')
  
  const [discountType, setDiscountType] = useState(existingInvoice?.discountType || 'FLAT')
  const [discountValue, setDiscountValue] = useState(existingInvoice?.discountValue || 0)
  
  const [items, setItems] = useState<Array<{ productId: string, quantity: number, price: number | '', name: string }>>(
    existingInvoice?.items?.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.product.name
    })) || []
  )

  // UI States
  const [clientSearch, setClientSearch] = useState('')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [isAddingClient, setIsAddingClient] = useState(false)
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  
  // Submit Action State
  const [submitAction, setSubmitAction] = useState<'sent' | 'draft' | 'sent_and_print'>('draft')

  // Auto-fill client search if we have a clientId
  useEffect(() => {
    if (clientId) {
      const c = clients.find(c => c.id === clientId)
      if (c) setClientSearch(c.name)
    }
  }, [clientId, clients])

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))

  const handleCreateClient = async (e: any) => {
    e.preventDefault()
    const container = e.currentTarget.closest('.quick-client-container')
    const inputs = container.querySelectorAll('input')
    const formData = new FormData()
    let isValid = true
    inputs.forEach((input: any) => {
      if (input.required && !input.value) isValid = false
      formData.append(input.name, input.value)
    })
    if (!isValid) {
      toast.error('Please fill in required fields (Customer Name).')
      return
    }
    const res = await createClient(formData)
    if (res.success && res.client) {
      setClients([...clients, res.client])
      setClientId(res.client.id)
      setClientSearch(res.client.name)
      setIsAddingClient(false)
      setShowClientDropdown(false)
      toast.success('Customer created successfully!')
    } else {
      toast.error('Failed to create customer.')
    }
  }

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (editingProduct?.id) {
      // If we are editing, we assume there's an updateProduct action (which doesn't exist yet, but let's mock the UI update)
      // We will just create a new product for now since updateProduct action might not be fully featured in actions.ts yet
      toast.error('Product editing requires updateProduct action to be fully implemented in actions.ts. We will add it as new for now.');
      formData.append('gstRate', '18')
      const res = await createProduct(formData)
      if (res.success && res.product) {
        setProducts([...products, res.product])
        setEditingProduct(null)
      }
    } else {
      formData.append('gstRate', '18')
      const res = await createProduct(formData)
      if (res.success && res.product) {
        setProducts([...products, res.product])
        setEditingProduct(null)
      }
    }
  }

  const handleSelectProduct = (product: Product) => {
    let finalPrice = product.price;
    // Export pricing logic: Divide INR base price by exchange rate
    if (invoiceType === 'EXPORT' && currency !== 'INR' && exchangeRate > 0) {
      finalPrice = Number((product.price / exchangeRate).toFixed(2));
    }

    setItems([...items, { productId: product.id, quantity: 1, price: finalPrice, name: product.name }])
    setIsProductModalOpen(false)
    setProductSearch('')
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculatedItems = useMemo(() => {
    return items.map(item => {
      const product = products.find(p => p.id === item.productId)
      if (!product) return { ...item, price: item.price || 0, taxAmount: 0, totalWithTax: 0, gstRate: 0, isTaxInclusive: false }
      
      const itemPrice = typeof item.price === 'number' ? item.price : 0
      const effectiveGstRate = invoiceType === 'EXPORT' ? 0 : product.gstRate
      
      let totalWithoutTax = itemPrice * item.quantity;
      let taxAmount = 0;
      let totalWithTax = 0;
      
      if (product.taxInclusive && invoiceType !== 'EXPORT') {
        totalWithTax = itemPrice * item.quantity;
        totalWithoutTax = totalWithTax / (1 + effectiveGstRate / 100);
        taxAmount = totalWithTax - totalWithoutTax;
      } else {
        taxAmount = totalWithoutTax * (effectiveGstRate / 100);
        totalWithTax = totalWithoutTax + taxAmount;
      }

      return {
        ...item,
        price: itemPrice,
        taxAmount,
        totalWithTax,
        totalWithoutTax,
        gstRate: effectiveGstRate,
        isTaxInclusive: product.taxInclusive || false
      }
    })
  }, [items, products, invoiceType])

  const subTotal = calculatedItems.reduce((sum, item) => sum + (item.totalWithoutTax || 0), 0)
  const taxTotal = calculatedItems.reduce((sum, item) => sum + item.taxAmount, 0)
  
  let discountAmount = 0
  if (discountType === 'FLAT') {
    discountAmount = discountValue
  } else if (discountType === 'PERCENTAGE') {
    discountAmount = (subTotal + taxTotal) * (discountValue / 100)
  }

  const totalBeforeRoundOff = subTotal + taxTotal - discountAmount
  const finalTotal = Math.round(totalBeforeRoundOff)
  const autoRoundOff = finalTotal - totalBeforeRoundOff

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId) { toast.error('Please select a client'); return }
    if (items.length === 0 || !items[0].productId) { toast.error('Please add at least one product'); return }

    const payload = {
      clientId,
      invoiceNumber,
      date: new Date(date).toISOString(),
      dueDate,
      reference,
      notes,
      invoiceType,
      currency,
      exchangeRate: Number(exchangeRate) || 1.0,
      paymentMethod,
      bankId: paymentMethod === 'BANK' ? bankId : undefined,
      discountType,
      discountValue,
      roundOff: autoRoundOff,
      subTotal,
      taxTotal,
      total: finalTotal,
      status: submitAction === 'sent_and_print' ? 'sent' : submitAction,
      items: calculatedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.isTaxInclusive && invoiceType !== 'EXPORT' ? Number(((item.totalWithoutTax || 0) / item.quantity).toFixed(2)) : item.price,
        tax: item.taxAmount
      }))
    }

    let res;
    if (existingInvoice) {
      const { updateInvoice } = await import('../actions')
      res = await updateInvoice(existingInvoice.id, payload)
    } else {
      res = await createInvoice(payload)
    }

    if (res.success) {
      const redirectPath = invoiceType === 'QUOTATION' ? '/quotations' : '/invoices'
      if (submitAction === 'sent_and_print') {
        const num = existingInvoice ? existingInvoice.invoiceNumber : (res.invoice?.invoiceNumber || invoiceNumber);
        if (num) {
          router.push(`/pay/${encodeURIComponent(num)}/print`);
        } else {
          router.push(redirectPath);
        }
      } else {
        router.push(redirectPath);
      }
      toast.success(existingInvoice ? `${invoiceType === 'QUOTATION' ? 'Quotation' : 'Invoice'} updated!` : `${invoiceType === 'QUOTATION' ? 'Quotation' : 'Invoice'} created successfully!`)
    } else {
      toast.error('Error saving document')
    }
  }

  return (
    <div className="relative font-sans text-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-foreground">
        
        {/* Top Bar: Type, Currency */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card-bg p-4 rounded-xl border border-card-border shadow-sm gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="font-medium text-zinc-500 uppercase tracking-wider text-xs w-20 md:w-auto">Type</span>
            <select 
              value={invoiceType} 
              onChange={e => setInvoiceType(e.target.value)}
              className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer flex-1 md:flex-none"
            >
              <option value="REGULAR">Regular</option>
              <option value="EXPORT">Export</option>
              <option value="QUOTATION">Quotation</option>
            </select>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
            <span className="font-medium text-zinc-500 uppercase tracking-wider text-xs w-20 md:w-auto">Currency</span>
            <div className="flex gap-2">
              <select 
                value={currency} 
                onChange={e => {
                  const newCurrency = e.target.value;
                  setCurrency(newCurrency);
                  if (newCurrency === 'INR') {
                    setExchangeRate(1.0);
                  } else {
                    const rate = exchangeRates.find(r => r.currency === newCurrency);
                    if (rate) setExchangeRate(rate.rate);
                  }
                }}
                className="bg-sidebar-bg border border-sidebar-border rounded-md px-3 py-1.5 focus:outline-none"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AUD">AUD</option>
              </select>
              {currency !== 'INR' && (
                <div className="flex items-center gap-2 bg-sidebar-bg px-2 rounded-md border border-sidebar-border">
                  <span className="text-zinc-500 text-xs">Rate:</span>
                  <input 
                    type="number" step="0.01" value={exchangeRate}
                    onChange={e => setExchangeRate(parseFloat(e.target.value) || 1)}
                    className="w-16 bg-transparent focus:outline-none text-right text-xs py-1.5"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer & Dates Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-card-bg p-6 rounded-xl border border-card-border shadow-sm">
          <div className="lg:col-span-5 relative">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Select Customer</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
              <input 
                type="text"
                placeholder="Search customers by name..."
                value={clientSearch}
                onChange={e => {
                  setClientSearch(e.target.value)
                  setShowClientDropdown(true)
                  if (!e.target.value) setClientId('')
                }}
                onFocus={() => setShowClientDropdown(true)}
                className="w-full rounded-md pl-9 pr-24 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 font-medium text-foreground"
              />
              {!clientId && (
                <button type="button" onClick={() => setIsAddingClient(true)} className="absolute right-2 top-1.5 text-blue-500 hover:bg-blue-50 px-2 py-1 rounded text-xs font-medium transition-colors">
                  + Create Customer
                </button>
              )}
            </div>
            
            {showClientDropdown && clientSearch && !clientId && (
              <div className="absolute z-20 w-full mt-1 bg-card-bg border border-card-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredClients.map(c => (
                  <div 
                    key={c.id} 
                    className="px-4 py-3 hover:bg-sidebar-bg cursor-pointer border-b border-sidebar-border last:border-0"
                    onClick={() => {
                      setClientId(c.id)
                      setClientSearch(c.name)
                      setShowClientDropdown(false)
                    }}
                  >
                    <div className="font-medium text-foreground">{c.name}</div>
                    {(c.email || c.phone) && <div className="text-xs text-zinc-500 mt-0.5">{c.email} {c.phone}</div>}
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="px-4 py-3 text-sm text-zinc-500">No customers found. Click + Create Customer.</div>
                )}
              </div>
            )}
            
            {/* Quick Add Client Inline Modal */}
            {isAddingClient && (
              <div className="quick-client-container absolute z-30 w-full mt-1 bg-card-bg border border-card-border rounded-xl shadow-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-foreground">Create New Customer</h4>
                  <button type="button" onClick={() => setIsAddingClient(false)} className="text-zinc-400 hover:text-foreground"><X size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" name="name" required placeholder="Customer Name *" className="rounded-md px-3 py-2 text-sm bg-sidebar-bg border border-sidebar-border" />
                  <input type="email" name="email" placeholder="Email Address" className="rounded-md px-3 py-2 text-sm bg-sidebar-bg border border-sidebar-border" />
                  <input type="text" name="phone" placeholder="Phone Number" className="rounded-md px-3 py-2 text-sm bg-sidebar-bg border border-sidebar-border" />
                  <input type="text" name="gstin" placeholder="GSTIN (Optional)" className="rounded-md px-3 py-2 text-sm bg-sidebar-bg border border-sidebar-border uppercase" />
                  <input type="number" name="stateCode" placeholder="GST State Code (e.g. 27)" className="col-span-2 rounded-md px-3 py-2 text-sm bg-sidebar-bg border border-sidebar-border" />
                </div>
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={() => setIsAddingClient(false)} className="px-4 py-2 text-zinc-500 mr-2">Cancel</button>
                  <button type="button" onClick={handleCreateClient} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm">Save</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Invoice No.</label>
            <input 
              value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} required 
              className="w-full rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none" 
            />
          </div>
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Invoice Date</label>
            <input 
              type="date" value={date} onChange={e => setDate(e.target.value)} required 
              className="w-full rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none text-zinc-700 dark:text-zinc-300" 
            />
          </div>
          <div className="lg:col-span-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Reference</label>
            <input 
              value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. PO Number..."
              className="w-full rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none" 
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-card-bg rounded-xl border border-card-border shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-card-border bg-sidebar-bg/50 gap-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><FileText size={16} className="text-zinc-400" /> Products & Services</h3>
            {items.length > 0 && (
              <button type="button" onClick={() => setIsProductModalOpen(true)} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md font-medium text-sm transition-colors flex items-center gap-1 w-full sm:w-auto justify-center border border-blue-100 sm:border-none">
                <Plus size={14} /> Add Product
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center bg-card-bg">
              <div className="bg-sidebar-bg p-5 rounded-2xl mb-4 border border-sidebar-border shadow-inner">
                <Banknote className="text-zinc-400" size={32} />
              </div>
              <p className="text-zinc-500 mb-6 text-center max-w-sm text-sm">
                Search existing products to add to this list or add new product to get started ✨
              </p>
              <button type="button" onClick={() => setIsProductModalOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-2">
                <Plus size={16} /> Add New Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-sidebar-bg/30 text-zinc-500 text-xs uppercase tracking-wider border-b border-card-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product Name</th>
                    <th className="px-6 py-3 font-medium w-24">Qty</th>
                    <th className="px-6 py-3 font-medium w-32">Unit Price</th>
                    {invoiceType === 'REGULAR' && <th className="px-6 py-3 font-medium w-24">Tax</th>}
                    <th className="px-6 py-3 font-medium w-32 text-right">Total Amount</th>
                    <th className="px-6 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {items.map((item, index) => (
                    <tr key={index} className="group hover:bg-sidebar-bg/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" min="1" value={item.quantity} 
                          onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full bg-transparent border-b border-transparent hover:border-sidebar-border focus:border-blue-500 focus:outline-none px-1 py-1"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" step="0.01" value={item.price} 
                          onChange={e => updateItem(index, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-full bg-transparent border-b border-transparent hover:border-sidebar-border focus:border-blue-500 focus:outline-none px-1 py-1"
                        />
                      </td>
                      {invoiceType === 'REGULAR' && (
                        <td className="px-6 py-4 text-zinc-500 text-sm">
                          {calculatedItems[index].gstRate}%
                        </td>
                      )}
                      <td className="px-6 py-4 text-right font-medium text-foreground">
                        {calculatedItems[index].totalWithTax.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button type="button" onClick={() => removeItem(index)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Section: Notes & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 items-start">
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-sidebar-bg/50 border-b border-card-border text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Notes, terms & more...
              </div>
              <div className="p-5">
                <textarea 
                  value={notes} onChange={e => setNotes(e.target.value)} rows={3} 
                  placeholder="Enter your notes, say thanks, or anything else..."
                  className="w-full bg-transparent resize-none focus:outline-none text-foreground placeholder:text-zinc-400"
                />
              </div>
            </div>
            
            <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Payment Method
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <select 
                  value={paymentMethod === 'BANK' ? bankId : paymentMethod} 
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'UPI' || val === 'NONE') { setPaymentMethod(val); setBankId(''); } 
                    else { setPaymentMethod('BANK'); setBankId(val); }
                  }}
                  className="w-full rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none font-medium"
                >
                  <option value="NONE">None</option>
                  <option value="UPI">UPI (Default)</option>
                  {banks.map(b => <option key={b.id} value={b.id}>{b.bankName} (...{b.accountNumber.slice(-4)})</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 bg-zinc-50 dark:bg-sidebar-bg/30 border border-card-border rounded-xl p-6 shadow-sm">
            
            <div className="flex justify-end items-center mb-6 border-b border-card-border pb-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-xs uppercase tracking-wider">Extra Discount</span>
                <div className="flex bg-white dark:bg-card-bg border border-card-border rounded-md overflow-hidden">
                  <select 
                    value={discountType} onChange={e => setDiscountType(e.target.value)}
                    className="bg-transparent border-r border-card-border px-2 py-1 focus:outline-none text-sm text-zinc-500 font-medium"
                  >
                    <option value="FLAT">{currency}</option>
                    <option value="PERCENTAGE">%</option>
                  </select>
                  <input 
                    type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-20 text-right bg-transparent px-2 py-1 font-medium focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-zinc-600 text-sm">Taxable Amount</span>
              <span className="font-medium text-foreground text-sm">{currency} {subTotal.toFixed(2)}</span>
            </div>
            
            {invoiceType === 'REGULAR' && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-600 text-sm">Total Tax</span>
                <span className="font-medium text-foreground text-sm">{currency} {taxTotal.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-card-border">
              <span className="text-zinc-600 text-sm flex items-center gap-2">
                Round Off
              </span>
              <span className="font-medium text-zinc-600 text-sm">{autoRoundOff > 0 ? '+' : ''}{autoRoundOff.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-base font-bold text-foreground">Total Amount</span>
              <span className="text-xl font-bold text-foreground">{currency} {finalTotal.toFixed(2)}</span>
            </div>
            
            {currency !== 'INR' && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-zinc-500 text-xs">Total Amount (In INR)</span>
                <span className="font-medium text-zinc-500 text-xs">₹ {(finalTotal * exchangeRate).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end pt-4 gap-3 sm:gap-4 sticky bottom-0 bg-background/90 backdrop-blur py-4 border-t border-card-border z-10 -mx-4 px-4 sm:-mx-8 sm:px-8 mt-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <button type="button" onClick={() => router.back()} className="text-foreground px-6 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-sidebar-bg transition-colors w-full sm:w-auto border border-zinc-200 sm:border-none">
            Cancel
          </button>
          
          <button type="submit" onClick={() => setSubmitAction('draft')} className="bg-sidebar-bg text-foreground border border-sidebar-border shadow-sm px-6 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto">
            Save as Draft
          </button>
          
          <button type="submit" onClick={() => setSubmitAction('sent')} className="bg-blue-100 text-blue-700 shadow-sm px-6 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-blue-200 transition-colors w-full sm:w-auto border border-blue-200">
            Save
          </button>
          
          <button type="submit" onClick={() => setSubmitAction('sent_and_print')} className="bg-blue-600 text-white shadow-md shadow-blue-500/20 px-8 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto">
            Save & Print
          </button>
        </div>
      </form>

      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsProductModalOpen(false); setEditingProduct(null) }}></div>
          <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="px-6 py-4 border-b border-card-border flex justify-between items-center bg-sidebar-bg/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Search size={18} className="text-zinc-400" /> {editingProduct ? 'Edit Product' : 'Select or Add Product'}
              </h2>
              <button onClick={() => { setIsProductModalOpen(false); setEditingProduct(null) }} className="text-zinc-400 hover:text-foreground bg-sidebar-border hover:bg-zinc-200 dark:hover:bg-zinc-700 p-1.5 rounded-md transition-colors"><X size={18} /></button>
            </div>
            
            {editingProduct ? (
              <form onSubmit={handleSaveProduct} className="p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Product Name *</label>
                  <input type="text" name="name" defaultValue={editingProduct.name} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Base Price (INR) *</label>
                    <input type="number" step="0.01" name="price" defaultValue={editingProduct.price} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">HSN Code</label>
                    <input type="text" name="hsn" defaultValue={editingProduct.hsn || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">GST Rate (%)</label>
                    <input type="number" name="gstRate" defaultValue={editingProduct.gstRate || 18} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-card-border">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-5 py-2.5 font-medium text-zinc-500 hover:bg-sidebar-bg rounded-lg transition-colors">Back</button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Product</button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-card-border bg-card-bg">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                    <input 
                      type="text" autoFocus
                      placeholder="Search existing products..."
                      value={productSearch} onChange={e => setProductSearch(e.target.value)}
                      className="w-full rounded-xl pl-11 pr-4 py-3 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 text-base shadow-sm"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto p-2 max-h-[400px]">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 hover:bg-sidebar-bg rounded-xl group transition-colors mb-1">
                      <div className="flex-1 cursor-pointer pl-2" onClick={() => handleSelectProduct(p)}>
                        <div className="font-semibold text-foreground text-base mb-1">{p.name}</div>
                        <div className="text-sm text-zinc-500 font-medium">Base Price: ₹{p.price} <span className="text-zinc-300 mx-2">|</span> GST: {p.gstRate}%</div>
                      </div>
                      <div className="flex items-center gap-2 pr-2">
                        <button onClick={() => setEditingProduct(p)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleSelectProduct(p)} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-600 text-foreground px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="text-center p-12 text-zinc-500 flex flex-col items-center">
                      <div className="bg-sidebar-bg p-4 rounded-full mb-4">
                        <Search className="text-zinc-400" size={24} />
                      </div>
                      <p>No products found matching "{productSearch}".</p>
                    </div>
                  )}
                </div>
                <div className="p-5 border-t border-card-border bg-sidebar-bg/50 flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-500">Didn't find what you need?</span>
                  <button onClick={() => setEditingProduct({ name: productSearch, price: 0, gstRate: 18 })} className="text-blue-600 font-semibold hover:underline flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-lg">
                    <Plus size={16} /> Create New Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

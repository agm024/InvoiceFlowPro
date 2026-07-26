'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createInvoice } from '../actions'
import { createClient } from '../../clients/actions'
import { createProduct } from '../../products/actions'
import { Search, Plus, X, Trash2, Edit2, FileText, Banknote, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

type Client = { id: string, name: string, email?: string | null, phone?: string | null, gstin?: string | null, panNo?: string | null, address?: string | null }
type Product = { id: string, name: string, price: number, gstRate: number, hsn?: string | null, taxInclusive?: boolean }
type Bank = { id: string, bankName: string, accountNumber: string, ifsc?: string | null, swiftCode?: string | null, routingNumber?: string | null, iban?: string | null }
type ExchangeRate = { id: string, currency: string, rate: number }

export default function InvoiceForm({ 
  clients: initialClients, 
  products: initialProducts,
  banks,
  exchangeRates = [],
  defaultInvoiceNumber,
  defaultInvoiceType,
  existingInvoice,
  milestoneId,
  adHocMilestoneDetails,
  companySettings
}: { 
  clients: Client[], 
  products: Product[],
  banks: Bank[],
  exchangeRates?: ExchangeRate[],
  defaultInvoiceNumber: string,
  defaultInvoiceType?: string,
  existingInvoice?: any,
  milestoneId?: string,
  adHocMilestoneDetails?: any,
  companySettings?: any
}) {
  const router = useRouter()
  
  // Local Data State
  const [clients, setClients] = useState(initialClients)
  const [products, setProducts] = useState(initialProducts)

  // Invoice Fields
  const [clientId, setClientId] = useState(existingInvoice?.clientId || adHocMilestoneDetails?.clientId || '')
  const [invoiceNumber, setInvoiceNumber] = useState(existingInvoice?.invoiceNumber || defaultInvoiceNumber)
  const [date, setDate] = useState(existingInvoice?.date ? new Date(existingInvoice.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate ? new Date(existingInvoice.dueDate).toISOString().split('T')[0] : '')
  const [reference, setReference] = useState(existingInvoice?.reference || '')
  
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showDesktopPreview, setShowDesktopPreview] = useState(true)
  
  const [notes, setNotes] = useState(existingInvoice?.notes || '')
  const [invoiceType, setInvoiceType] = useState(existingInvoice?.invoiceType || defaultInvoiceType || 'REGULAR') // REGULAR, EXPORT, QUOTATION
  const [currency, setCurrency] = useState(existingInvoice?.currency || adHocMilestoneDetails?.currency || 'INR')
  const [exchangeRate, setExchangeRate] = useState(existingInvoice?.exchangeRate || 1.0)
  const [isFetchingRate, setIsFetchingRate] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(existingInvoice?.paymentMethod || 'UPI')
  const [bankId, setBankId] = useState(existingInvoice?.bankId || '')

  useEffect(() => {
    async function fetchRate() {
      if (invoiceType === 'EXPORT' && currency !== 'INR') {
        setIsFetchingRate(true)
        try {
          const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=INR`)
          if (res.ok) {
            const data = await res.json()
            if (data.rates && data.rates.INR) {
              setExchangeRate(data.rates.INR)
              toast.success(`Exchange rate updated: 1 ${currency} = ₹${data.rates.INR}`)
            }
          }
        } catch (error) {
          console.error("Failed to fetch exchange rate:", error)
          toast.error("Failed to fetch live exchange rate")
        } finally {
          setIsFetchingRate(false)
        }
      } else {
        setExchangeRate(1.0)
      }
    }
    
    // Only fetch if it's a new invoice (no existing exchange rate) or currency changed
    if (!existingInvoice) {
      fetchRate()
    }
  }, [currency, invoiceType, existingInvoice])
  
  const [discountType, setDiscountType] = useState(existingInvoice?.discountType || 'FLAT')
  const [discountValue, setDiscountValue] = useState(existingInvoice?.discountValue || 0)
  
  const [items, setItems] = useState<Array<{ productId: string, quantity: number, price: number | '', name: string }>>(
    existingInvoice?.items ? existingInvoice.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.product.name
    })) : adHocMilestoneDetails ? [{
      productId: adHocMilestoneDetails.productId,
      quantity: 1,
      price: adHocMilestoneDetails.price,
      name: adHocMilestoneDetails.name
    }] : []
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
  const [submitAction, setSubmitAction] = useState<'sent' | 'draft' | 'sent_and_print' | 'paid'>('draft')

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
      let product = products.find(p => p.id === item.productId)
      
      if (!product && adHocMilestoneDetails && adHocMilestoneDetails.productId === item.productId) {
        product = {
          id: adHocMilestoneDetails.productId,
          name: adHocMilestoneDetails.name,
          hsn: adHocMilestoneDetails.hsn,
          gstRate: adHocMilestoneDetails.gstRate,
          taxInclusive: false,
          price: adHocMilestoneDetails.price
        } as any
      }

      if (!product) return { ...item, price: item.price || 0, taxAmount: 0, totalWithTax: 0, totalWithoutTax: 0, gstRate: 0, isTaxInclusive: false }
      
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
      milestoneId,
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

  const selectedClientData = clients.find(c => c.id === clientId)

  return (
    <div className="relative font-sans text-sm flex flex-col 2xl:flex-row gap-8 items-start w-full">
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 text-foreground w-full 2xl:max-w-4xl pb-12">
        
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
                <div className="flex items-center gap-2 border border-card-border bg-sidebar-bg rounded-md px-3 relative">
                  <span className="text-zinc-500 text-xs">1 {currency} = ₹</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={exchangeRate} 
                    onChange={e => setExchangeRate(parseFloat(e.target.value) || 1)}
                    className="w-16 bg-transparent focus:outline-none text-right text-xs py-1.5 font-medium"
                    disabled={isFetchingRate}
                  />
                  {isFetchingRate && (
                    <div className="absolute right-2 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4 bg-card-bg p-6 rounded-xl border border-card-border shadow-sm">
          <div className="sm:col-span-2 xl:col-span-4 relative">
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
                className={`w-full rounded-md pl-9 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white font-medium text-foreground truncate ${!clientId ? 'pr-32' : 'pr-4'}`}
              />
              {!clientId && (
                <button type="button" onClick={() => setIsAddingClient(true)} className="absolute right-2 top-1.5 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap">
                  + Customer
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
                  <div className="px-4 py-3 text-sm text-zinc-500">No customers found. Click + Customer.</div>
                )}
              </div>
            )}
            
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
                  <button type="button" onClick={handleCreateClient} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-white px-4 py-2 rounded-md font-medium text-sm">Save</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="xl:col-span-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Invoice No.</label>
            <input 
              value={invoiceNumber || ""} onChange={e => setInvoiceNumber(e.target.value)} required 
              className="w-full rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none truncate" 
            />
          </div>
          <div className="xl:col-span-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Invoice Date</label>
            <input 
              type="date" value={date} onChange={e => setDate(e.target.value)} required 
              className="w-full rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none text-zinc-700 dark:text-zinc-300" 
            />
          </div>
          <div className="xl:col-span-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Reference</label>
            <input 
              value={reference || ""} onChange={e => setReference(e.target.value)} placeholder="e.g. PO Number"
              className="w-full rounded-md px-3 py-2 bg-sidebar-bg border border-sidebar-border focus:outline-none truncate" 
            />
          </div>
        </div>

        <div className="bg-card-bg rounded-xl border border-card-border shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-card-border bg-sidebar-bg/50 gap-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><FileText size={16} className="text-zinc-400" /> Products & Services</h3>
            {items.length > 0 && (
              <button type="button" onClick={() => setIsProductModalOpen(true)} className="text-zinc-900 dark:text-white hover:bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md font-medium text-sm transition-colors flex items-center gap-1 w-full sm:w-auto justify-center border border-zinc-200 dark:border-zinc-700 sm:border-none">
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
              <button type="button" onClick={() => setIsProductModalOpen(true)} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm shadow-zinc-900/20 flex items-center gap-2">
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
                          type="number" min="1" value={item.quantity || ""} 
                          onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full bg-transparent border-b border-transparent hover:border-sidebar-border focus:border-zinc-900 dark:border-white focus:outline-none px-1 py-1"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" step="0.01" value={item.price || ""} 
                          onChange={e => updateItem(index, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                          className="w-full bg-transparent border-b border-transparent hover:border-sidebar-border focus:border-zinc-900 dark:border-white focus:outline-none px-1 py-1"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 items-start">
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-sidebar-bg/50 border-b border-card-border text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Notes, terms & more...
              </div>
              <div className="p-5">
                <textarea 
                  value={notes || ""} onChange={e => setNotes(e.target.value)} rows={3} 
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
            
            <div className="flex justify-between items-center mb-6 border-b border-card-border pb-4 gap-4">
              <span className="text-zinc-500 text-xs uppercase tracking-wider flex-shrink-0">Extra Discount</span>
              <div className="flex bg-white dark:bg-card-bg border border-card-border rounded-md overflow-hidden max-w-[160px]">
                <select 
                  value={discountType} onChange={e => setDiscountType(e.target.value)}
                  className="bg-transparent border-r border-card-border px-2 py-1.5 focus:outline-none text-sm text-zinc-600 font-medium cursor-pointer flex-shrink-0"
                >
                  <option value="FLAT">{currency}</option>
                  <option value="PERCENTAGE">%</option>
                </select>
                <input 
                  type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="w-full text-right bg-transparent px-3 py-1.5 font-medium focus:outline-none text-sm min-w-0"
                />
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

        <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-zinc-200 dark:border-card-border pb-24">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 sm:py-2.5 font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-card-bg w-full sm:w-auto">
            Cancel
          </button>
          
          <button type="button" onClick={() => {
            if (window.innerWidth >= 1536) {
              setShowDesktopPreview(true)
            } else {
              setShowPreviewModal(true)
            }
          }} className={`${showDesktopPreview ? '2xl:hidden' : ''} bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm px-6 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors w-full sm:w-auto border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2`}>
            <Eye size={18} /> Preview
          </button>
          
          <button type="submit" onClick={() => setSubmitAction('draft')} className="bg-zinc-100 dark:bg-sidebar-bg text-foreground border border-zinc-200 dark:border-sidebar-border shadow-sm px-6 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto">
            Save as Draft
          </button>
          
          <button type="submit" onClick={() => setSubmitAction('sent')} className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm px-6 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto border border-zinc-200 dark:border-zinc-700">
            Save
          </button>

          <button type="submit" onClick={() => setSubmitAction('paid')} className="bg-emerald-100 text-emerald-700 shadow-sm px-6 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-emerald-200 transition-colors w-full sm:w-auto border border-emerald-200">
            Save & Mark as Paid
          </button>
          
          <button type="submit" onClick={() => setSubmitAction('sent_and_print')} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-white shadow-md shadow-zinc-900/20 px-8 py-3 sm:py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors w-full sm:w-auto">
            Save & Print
          </button>
        </div>
      </form>

      {(() => {
        const previewContent = (
          <div className="bg-white border border-zinc-200 shadow-xl rounded-lg overflow-hidden h-[750px]">
            <div className="origin-top-left w-[800px] p-10 bg-white" style={{ transform: 'scale(0.75)' }}>
            
            <div className="border-b-2 border-zinc-900 pb-8 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-black text-zinc-900 tracking-tight uppercase">INVOICE</h1>
                <p className="text-zinc-500 mt-2 font-medium">#{invoiceNumber || 'INV-0000'}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-zinc-900">{companySettings?.companyName || 'Your Company'}</div>
                <div className="text-zinc-500 mt-1">{companySettings?.email || 'contact@yourcompany.com'}</div>
              </div>
            </div>

            <div className="flex justify-between mb-12">
              <div>
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Billed To</p>
                <h3 className="text-xl font-bold text-zinc-900">{selectedClientData?.name || 'Client Name'}</h3>
                {selectedClientData?.address && <p className="text-zinc-600 whitespace-pre-wrap mt-1 max-w-xs">{selectedClientData.address}</p>}
                {selectedClientData?.gstin && <p className="text-zinc-600 mt-1">GSTIN: {selectedClientData.gstin}</p>}
              </div>
              <div className="text-right flex flex-col gap-4">
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Invoice Date</p>
                  <p className="text-lg font-medium text-zinc-900">{date ? format(new Date(date), 'dd MMM yyyy') : '-'}</p>
                </div>
                {dueDate && (
                  <div>
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Due Date</p>
                    <p className="text-lg font-medium text-zinc-900">{format(new Date(dueDate), 'dd MMM yyyy')}</p>
                  </div>
                )}
              </div>
            </div>

            <table className="w-full text-left mb-8 border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 text-sm uppercase tracking-wider text-zinc-900 font-bold">
                  <th className="py-3 pr-4">Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {calculatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-400 italic">No items added yet</td>
                  </tr>
                ) : (
                  calculatedItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-zinc-200">
                      <td className="py-4 pr-4 font-medium text-zinc-900">{item.name || '-'}</td>
                      <td className="py-4 px-4 text-center text-zinc-600">{item.quantity}</td>
                      <td className="py-4 px-4 text-right text-zinc-600">{currency} {item.price.toFixed(2)}</td>
                      <td className="py-4 pl-4 text-right font-medium text-zinc-900">{currency} {item.totalWithoutTax.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between py-2 text-zinc-600 border-b border-zinc-100">
                  <span>Subtotal</span>
                  <span>{currency} {subTotal.toFixed(2)}</span>
                </div>
                {taxTotal > 0 && (
                  <div className="flex justify-between py-2 text-zinc-600 border-b border-zinc-100">
                    <span>Tax</span>
                    <span>{currency} {taxTotal.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between py-2 text-green-600 border-b border-zinc-100">
                    <span>Discount</span>
                    <span>-{currency} {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-4 text-2xl font-black text-zinc-900 mt-2 border-t-2 border-zinc-900">
                  <span>Total</span>
                  <span>{currency} {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {notes && (
              <div className="mt-12 pt-8 border-t border-zinc-200">
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Notes</p>
                <p className="text-zinc-600 whitespace-pre-wrap">{notes}</p>
              </div>
            )}
            </div>
          </div>
        )

        return (
          <>
            {showDesktopPreview && (
              <div className="hidden 2xl:flex w-[600px] sticky top-8 flex-shrink-0 flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-foreground">Live Preview</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 bg-sidebar-bg px-2 py-1 rounded">Updates automatically</span>
                    <button type="button" onClick={() => setShowDesktopPreview(false)} className="text-zinc-400 hover:text-foreground p-1 rounded transition-colors"><X size={16} /></button>
                  </div>
                </div>
                {previewContent}
              </div>
            )}

            {showPreviewModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 2xl:hidden">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreviewModal(false)}></div>
                <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-[650px] relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-card-border flex justify-between items-center bg-sidebar-bg/50">
                    <h2 className="text-lg font-semibold text-foreground">Invoice Preview</h2>
                    <button onClick={() => setShowPreviewModal(false)} className="text-zinc-400 hover:text-foreground bg-sidebar-border hover:bg-zinc-200 dark:hover:bg-zinc-700 p-1.5 rounded-md transition-colors"><X size={18} /></button>
                  </div>
                  <div className="p-6 overflow-y-auto bg-zinc-50 flex flex-col items-center">
                    <div className="w-[600px]">
                      {previewContent}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      })()}

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
                  <input type="text" name="name" defaultValue={editingProduct.name} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Base Price (INR) *</label>
                    <input type="number" step="0.01" name="price" defaultValue={editingProduct.price} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">HSN Code</label>
                    <input type="text" name="hsn" defaultValue={editingProduct.hsn || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">GST Rate (%)</label>
                    <input type="number" name="gstRate" defaultValue={editingProduct.gstRate || 18} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-card-border">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-5 py-2.5 font-medium text-zinc-500 hover:bg-sidebar-bg rounded-lg transition-colors">Back</button>
                  <button type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm">Save Product</button>
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
                      className="w-full rounded-xl pl-11 pr-4 py-3 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white text-base shadow-sm"
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
                        <button onClick={() => setEditingProduct(p)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleSelectProduct(p)} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:border-white hover:text-zinc-900 dark:text-white text-foreground px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
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
                  <button onClick={() => setEditingProduct({ name: productSearch, price: 0, gstRate: 18 })} className="text-zinc-900 dark:text-white font-semibold hover:underline flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
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

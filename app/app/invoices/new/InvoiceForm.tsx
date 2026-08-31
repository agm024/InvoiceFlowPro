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
  const [currentStep, setCurrentStep] = useState(1)
  
  // Local Data State
  const [clients, setClients] = useState(initialClients)
  const [products, setProducts] = useState(initialProducts)

  // Invoice Fields
  const [clientId, setClientId] = useState(existingInvoice?.clientId || adHocMilestoneDetails?.clientId || '')
  const [invoiceNumber, setInvoiceNumber] = useState(existingInvoice?.invoiceNumber || defaultInvoiceNumber)
  const [date, setDate] = useState(existingInvoice?.date ? new Date(existingInvoice.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate ? new Date(existingInvoice.dueDate).toISOString().split('T')[0] : '')
  const [reference, setReference] = useState(existingInvoice?.reference || '')
  

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
      const redirectPath = '/app/invoices'
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
      toast.success(
        (t) => (
          <span className="flex items-center gap-2">
            {existingInvoice ? `${invoiceType === 'QUOTATION' ? 'Quotation' : 'Invoice'} updated!` : `${invoiceType === 'QUOTATION' ? 'Quotation' : 'Invoice'} created successfully!`}
            <button 
              onClick={() => {
                toast.dismiss(t.id)
                router.push(existingInvoice ? `/app/invoices/${existingInvoice.id}` : `/app/invoices`)
              }}
              className="ml-2 px-3 py-1 bg-zinc-900 text-white rounded-md text-xs font-bold hover:bg-black transition-colors"
            >
              View
            </button>
          </span>
        ),
        { duration: 5000 }
      )
    } else {
      toast.error('Error saving document')
    }
  }

  const selectedClientData = clients.find(c => c.id === clientId)
  
  const getStepClass = (stepId: number) => {
    if (currentStep >= 7) {
      return "transition-all duration-300";
    }
    return `transition-all duration-300 ${
      currentStep === stepId 
        ? "ring-2 ring-primary/40 ring-offset-2 bg-primary/5 dark:bg-primary/5 p-4 rounded-xl border border-primary/20" 
        : "opacity-35 blur-[0.25px] pointer-events-none"
    }`;
  }

  return (
    <div className="relative font-sans text-sm flex flex-col items-center w-full min-h-screen bg-zinc-50/50 dark:bg-black/20 p-4 sm:p-8 gap-6">
      
      {/* Guided Wizard Steps Header */}
      <div className="w-full max-w-6xl bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm flex items-center justify-between overflow-x-auto gap-4">
        {[
          { id: 1, name: 'Customer' },
          { id: 2, name: 'Details' },
          { id: 3, name: 'Items' },
          { id: 4, name: 'Tax / Disc' },
          { id: 5, name: 'Payment' },
          { id: 6, name: 'Notes' },
          { id: 7, name: 'Preview' },
          { id: 8, name: 'Issue' }
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setCurrentStep(s.id);
            }}
            className={`flex items-center gap-2 text-xs font-bold whitespace-nowrap px-3 py-2 rounded-lg transition-all ${
              currentStep === s.id
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px]">
              {s.id}
            </span>
            {s.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 text-foreground w-full max-w-6xl">
        
        {/* Main Document Area */}
        <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-sm shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 min-h-[1056px] w-full max-w-4xl mx-auto flex flex-col relative transition-colors duration-200">
          
          {/* Header */}
          <div className={getStepClass(2) + " flex justify-between items-start mb-12"}>
            <div>
              <input
                type="text"
                value={invoiceType === 'QUOTATION' ? 'QUOTATION' : invoiceType === 'EXPORT' ? 'EXPORT INVOICE' : 'TAX INVOICE'}
                readOnly
                className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 bg-transparent focus:outline-none mb-2 w-full max-w-[300px]"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-zinc-500 font-medium">Type:</span>
                <select 
                  value={invoiceType} 
                  onChange={e => setInvoiceType(e.target.value)}
                  className="bg-transparent text-primary font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none cursor-pointer rounded px-2 py-1 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                >
                  <option value="REGULAR">Regular</option>
                  <option value="EXPORT">Export</option>
                  <option value="QUOTATION">Quotation</option>
                </select>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="group relative flex items-center justify-end">
                <span className="text-zinc-500 font-medium mr-2">#</span>
                <input 
                  value={invoiceNumber || ""} onChange={e => setInvoiceNumber(e.target.value)} required 
                  className="w-32 text-right text-xl font-semibold bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-primary focus:outline-none transition-colors" 
                  placeholder="INV-001"
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-zinc-500 text-sm w-12 text-right">Date</span>
                <input 
                  type="date" value={date} onChange={e => setDate(e.target.value)} required 
                  className="w-36 text-right rounded px-2 py-1 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm font-medium" 
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="text-zinc-500 text-sm w-12 text-right">Due</span>
                <input 
                  type="date" value={dueDate || ""} onChange={e => setDueDate(e.target.value)} 
                  className="w-36 text-right rounded px-2 py-1 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm font-medium" 
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="text-zinc-500 text-sm w-12 text-right">Ref</span>
                <input 
                  value={reference || ""} onChange={e => setReference(e.target.value)} placeholder="PO-1234"
                  className="w-36 text-right rounded px-2 py-1 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm font-medium" 
                />
              </div>
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800 mb-12" />

          {/* Client & Currency */}
          <div className={getStepClass(1) + " flex justify-between items-start mb-12"}>
            <div className="w-1/2 relative group">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Billed To</h3>
              
              {!clientId ? (
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Click to select customer..."
                    value={clientSearch}
                    onChange={e => {
                      setClientSearch(e.target.value)
                      setShowClientDropdown(true)
                      if (!e.target.value) setClientId('')
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    className="w-full text-lg font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:border-primary focus:outline-none pb-1 transition-colors"
                  />
                </div>
              ) : (
                <div 
                  className="cursor-pointer group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900 p-2 -ml-2 rounded transition-colors"
                  onClick={() => setClientId('')}
                >
                  <div className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    {selectedClientData?.name}
                    <Edit2 size={14} className="opacity-0 group-hover:opacity-100 text-zinc-400" />
                  </div>
                  {selectedClientData?.address && <div className="text-zinc-500 text-sm mt-1">{selectedClientData.address}</div>}
                  {selectedClientData?.gstin && <div className="text-zinc-500 text-sm mt-1">GSTIN: {selectedClientData.gstin}</div>}
                </div>
              )}

              {/* Client Dropdown */}
              {showClientDropdown && clientSearch && !clientId && (
                <div className="absolute z-20 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                  {filteredClients.map(c => (
                    <div 
                      key={c.id} 
                      className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                      onClick={() => {
                        setClientId(c.id)
                        setClientSearch(c.name)
                        setShowClientDropdown(false)
                      }}
                    >
                      <div className="font-medium">{c.name}</div>
                      {(c.email || c.phone) && <div className="text-xs text-zinc-500 mt-0.5">{c.email} {c.phone}</div>}
                    </div>
                  ))}
                  {filteredClients.length === 0 && (
                    <div 
                      className="px-4 py-3 text-sm text-primary font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                      onClick={() => setIsAddingClient(true)}
                    >
                      <Plus size={16} /> Add "{clientSearch}" as new customer
                    </div>
                  )}
                </div>
              )}
              
              {isAddingClient && (
                <div className="quick-client-container absolute z-30 w-[150%] mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Quick Add Customer</h4>
                    <button type="button" onClick={() => setIsAddingClient(false)} className="text-zinc-400 hover:text-foreground"><X size={16} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="name" required placeholder="Customer Name *" defaultValue={clientSearch} className="rounded-md px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary" />
                    <input type="email" name="email" placeholder="Email Address" className="rounded-md px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary" />
                    <input type="text" name="phone" placeholder="Phone Number" className="rounded-md px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary" />
                    <input type="text" name="gstin" placeholder="GSTIN (Optional)" className="rounded-md px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-primary uppercase" />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddingClient(false)} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">Cancel</button>
                    <button type="button" onClick={handleCreateClient} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-md font-medium text-sm hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm">Save Customer</button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-1/3 flex flex-col items-end">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Currency</h3>
              <div className="flex items-center gap-2">
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
                  className="bg-transparent text-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none rounded px-2 py-1 transition-colors cursor-pointer text-right"
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              {currency !== 'INR' && (
                <div className="flex items-center gap-2 mt-2 group relative">
                  <span className="text-zinc-500 text-xs font-medium">1 {currency} = ₹</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={exchangeRate} 
                    onChange={e => setExchangeRate(parseFloat(e.target.value) || 1)}
                    className="w-16 bg-transparent border-b border-dashed border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-primary focus:outline-none text-right text-sm font-medium transition-colors"
                    disabled={isFetchingRate}
                  />
                  {isFetchingRate && (
                    <div className="absolute -right-5 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className={getStepClass(3) + " flex-grow"}>
            <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left mb-4">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white">
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500">Item Description</th>
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-center w-24">Qty</th>
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right w-32">Rate</th>
                  {invoiceType === 'REGULAR' && <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right w-24">Tax</th>}
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right w-32">Amount</th>
                  <th className="py-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {items.map((item, index) => (
                  <tr key={index} className="group">
                    <td className="py-3 pr-4">
                      <input 
                        type="text"
                        value={item.name}
                        onChange={e => updateItem(index, 'name', e.target.value)}
                        className="w-full bg-transparent font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded px-2 py-1 -ml-2 transition-colors"
                      />
                    </td>
                    <td className="py-3">
                      <input 
                        type="number" min="1" value={item.quantity || ""} 
                        onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full bg-transparent text-center focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded px-2 py-1 transition-colors"
                      />
                    </td>
                    <td className="py-3">
                      <input 
                        type="number" step="0.01" value={item.price || ""} 
                        onChange={e => updateItem(index, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full bg-transparent text-right focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded px-2 py-1 transition-colors"
                      />
                    </td>
                    {invoiceType === 'REGULAR' && (
                      <td className="py-3 text-right text-zinc-500 text-sm pr-2">
                        {calculatedItems[index].gstRate}%
                      </td>
                    )}
                    <td className="py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">
                      {calculatedItems[index].totalWithTax.toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" onClick={() => removeItem(index)} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <button type="button" onClick={() => setIsProductModalOpen(true)} className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 py-2 transition-colors">
              <Plus size={16} /> Add Line Item
            </button>
          </div>

          {/* Footer Area of Document (Totals & Notes) */}
          <div className="flex flex-col sm:flex-row justify-between items-end mt-12 gap-8 border-t-2 border-zinc-900 dark:border-white pt-8">
            <div className="w-full sm:w-1/2 flex flex-col gap-6">
              <div className={getStepClass(6)}>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Notes / Terms</h3>
                <textarea 
                  value={notes || ""} onChange={e => setNotes(e.target.value)} rows={3} 
                  placeholder="Thank you for your business!"
                  className="w-full bg-transparent resize-none focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded p-2 -ml-2 text-sm text-zinc-600 dark:text-zinc-400 transition-colors"
                />
              </div>
              
              <div className={getStepClass(5)}>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Bank Details</h3>
                <select 
                  value={paymentMethod === 'BANK' ? bankId : paymentMethod} 
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'UPI' || val === 'NONE') { setPaymentMethod(val); setBankId(''); } 
                    else { setPaymentMethod('BANK'); setBankId(val); }
                  }}
                  className="w-full bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:outline-none rounded p-2 -ml-2 text-sm font-medium transition-colors cursor-pointer appearance-none"
                >
                  <option value="NONE">No Payment Details</option>
                  <option value="UPI">UPI Payment</option>
                  {banks.map(b => <option key={b.id} value={b.id}>{b.bankName} (Acc: {b.accountNumber})</option>)}
                </select>
              </div>
            </div>

            <div className={getStepClass(4) + " w-full sm:w-[320px] bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-6"}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-500 text-sm font-medium">Subtotal</span>
                <span className="font-medium text-sm">{currency} {subTotal.toFixed(2)}</span>
              </div>
              
              {invoiceType === 'REGULAR' && (
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-500 text-sm font-medium">Tax</span>
                  <span className="font-medium text-sm">{currency} {taxTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center mb-3 group">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-sm font-medium">Discount</span>
                  <select 
                    value={discountType} onChange={e => setDiscountType(e.target.value)}
                    className="bg-transparent text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer focus:outline-none"
                  >
                    <option value="FLAT">{currency}</option>
                    <option value="PERCENTAGE">%</option>
                  </select>
                </div>
                <input 
                  type="number" step="0.01" value={discountValue || ""} onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)} placeholder="0.00"
                  className="w-24 text-right bg-transparent border-b border-dashed border-transparent hover:border-zinc-300 focus:border-primary focus:outline-none text-sm font-medium"
                />
              </div>
              
              {autoRoundOff !== 0 && (
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-500 text-sm font-medium">Round Off</span>
                  <span className="text-sm font-medium text-zinc-500">{autoRoundOff > 0 ? '+' : ''}{autoRoundOff.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-base font-bold">Total</span>
                <span className="text-2xl font-bold tracking-tight text-primary">{currency} {finalTotal.toFixed(2)}</span>
              </div>
              
              {currency !== 'INR' && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-zinc-400 text-xs font-medium">Amount in INR</span>
                  <span className="font-semibold text-xs text-zinc-500">₹ {(finalTotal * exchangeRate).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center print:hidden">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 transition-all text-zinc-800 dark:text-zinc-200"
            >
              &larr; Back
            </button>
            <span className="text-xs text-zinc-500 font-bold">Step {currentStep} of 8</span>
            {currentStep < 8 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !clientId) {
                    toast.error("Please select a customer first.");
                    return;
                  }
                  if (currentStep === 3 && items.length === 0) {
                    toast.error("Please add at least one item first.");
                    return;
                  }
                  setCurrentStep(prev => prev + 1);
                }}
                className="px-4 py-2 text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-all"
              >
                Next &rarr;
              </button>
            ) : (
              <span className="text-xs font-bold text-zinc-400">Ready to Save</span>
            )}
          </div>
        </div>

        {/* Sticky Sidebar Actions */}
        <div className="lg:w-72 lg:sticky lg:top-8 flex flex-col gap-4 self-start w-full">
          {currentStep >= 7 ? (
            <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Eye size={16} className="text-zinc-400" /> Actions
              </h3>
              
              <div className="flex flex-col gap-3">
                <button type="submit" onClick={() => setSubmitAction('sent_and_print')} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md px-4 py-3 rounded-lg font-semibold transition-all hover:bg-black dark:hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  Save & Print
                </button>
                
                <button type="submit" onClick={() => setSubmitAction('sent')} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm px-4 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-[0.98]">
                  Save & Issue
                </button>

                <button type="submit" onClick={() => setSubmitAction('paid')} className="w-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-lg font-semibold hover:bg-emerald-500/20 transition-all active:scale-[0.98]">
                  Mark as Paid
                </button>
                
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 w-full" />
                
                <button type="submit" onClick={() => setSubmitAction('draft')} className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                  Save as Draft
                </button>
                
                <button type="button" onClick={() => router.back()} className="w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 py-2 text-sm font-medium transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0a0a0a] rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                📋 Wizard Progress
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={clientId ? "text-emerald-500 font-bold" : "text-zinc-300"}>●</span>
                  <span className={clientId ? "line-through text-zinc-400" : "text-zinc-600 dark:text-zinc-400"}>Select Client</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={invoiceNumber ? "text-emerald-500 font-bold" : "text-zinc-300"}>●</span>
                  <span className={invoiceNumber ? "line-through text-zinc-400" : "text-zinc-600 dark:text-zinc-400"}>Invoice Number & Dates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={items.length > 0 ? "text-emerald-500 font-bold" : "text-zinc-300"}>●</span>
                  <span className={items.length > 0 ? "line-through text-zinc-400" : "text-zinc-600 dark:text-zinc-400"}>Add Line Items</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={paymentMethod !== "NONE" ? "text-emerald-500 font-bold" : "text-zinc-300"}>●</span>
                  <span className={paymentMethod !== "NONE" ? "line-through text-zinc-400" : "text-zinc-600 dark:text-zinc-400"}>Payment Details</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !clientId) {
                    toast.error("Please select a customer first.");
                    return;
                  }
                  if (currentStep === 3 && items.length === 0) {
                    toast.error("Please add at least one item first.");
                    return;
                  }
                  setCurrentStep(prev => prev + 1);
                }}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm py-2.5 rounded-lg text-xs font-semibold hover:opacity-95"
              >
                Next Setup Step
              </button>
            </div>
          )}
        </div>
      </form>



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




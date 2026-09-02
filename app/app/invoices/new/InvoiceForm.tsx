'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createInvoice } from '../actions'
import { createClient } from '../../clients/actions'
import { createProduct } from '../../products/actions'
import { Search, Plus, X, Trash2, Edit2, FileText, Banknote, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import CustomDatePicker from '@/components/CustomDatePicker'

type Client = { id: string, name: string, email?: string | null, phone?: string | null, gstin?: string | null, panNo?: string | null, address?: string | null }
type Product = { id: string, name: string, price: number, gstRate: number, hsn?: string | null, taxInclusive?: boolean, category?: string | null }
type Bank = { id: string, bankName: string, accountNumber: string, ifsc?: string | null, swiftCode?: string | null, routingNumber?: string | null, iban?: string | null }
type ExchangeRate = { id: string, currency: string, rate: number }

import CustomDropdown from '@/components/CustomDropdown';

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
  

  const [notes, setNotes] = useState(existingInvoice?.notes || '')
  const [invoiceType, setInvoiceType] = useState(existingInvoice?.invoiceType || defaultInvoiceType || 'REGULAR') // REGULAR, EXPORT, QUOTATION
  const [currency, setCurrency] = useState(existingInvoice?.currency || adHocMilestoneDetails?.currency || companySettings?.defaultCurrency || 'INR')
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
  
  const [submitAction, setSubmitAction] = useState<'sent' | 'draft' | 'sent_and_print' | 'paid'>('draft')
  const [enableRoundOff, setEnableRoundOff] = useState(existingInvoice ? existingInvoice.roundOff !== 0 : true)



  // Auto-change to EXPORT if currency is not INR
  useEffect(() => {
    const defaultCurrency = companySettings?.defaultCurrency || 'INR';
    if (currency !== defaultCurrency && currency !== 'INR') {
      setInvoiceType('EXPORT');
      const rate = exchangeRates.find(r => r.currency === currency);
      if (rate) setExchangeRate(rate.rate);
    }
  }, [currency, companySettings?.defaultCurrency]);

  // When invoiceType changes to REGULAR, reset currency to default
  useEffect(() => {
    if (invoiceType === 'REGULAR') {
      const defaultCurrency = companySettings?.defaultCurrency || 'INR';
      setCurrency(defaultCurrency);
      setExchangeRate(1.0);
    }
  }, [invoiceType, companySettings?.defaultCurrency]);

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
      const res = await createProduct(formData)
      if (res.success && res.product) {
        setProducts([...products, res.product])
        setEditingProduct(null)
      }
    } else {
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
  const finalTotal = enableRoundOff ? Math.round(totalBeforeRoundOff) : totalBeforeRoundOff
  const autoRoundOff = enableRoundOff ? finalTotal - totalBeforeRoundOff : 0

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
  
  return (
    <div className="relative font-sans text-sm flex flex-col items-center w-full min-h-screen bg-zinc-50/50 dark:bg-black/20 p-2 sm:p-8 gap-6">

      <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-4 xl:gap-8 text-foreground w-full max-w-[1400px] mx-auto pb-28 sm:pb-0">
        
        {/* Main Document Area */}
        <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-3 sm:p-6 md:p-12 min-h-[1056px] w-full max-w-5xl mx-auto flex flex-col relative transition-colors duration-200">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0 mb-8 md:mb-12">
            <div className="w-full md:w-auto">
              <input
                type="text"
                value={invoiceType === 'QUOTATION' ? 'QUOTATION' : invoiceType === 'EXPORT' ? 'EXPORT INVOICE' : 'TAX INVOICE'}
                readOnly
                className="text-3xl md:text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 bg-transparent focus:outline-none mb-2 w-full md:max-w-[300px]"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-zinc-500 font-medium">Type:</span>
                <CustomDropdown
                  value={invoiceType}
                  onChange={setInvoiceType}
                  options={[
                    { value: "REGULAR", label: "Regular" },
                    { value: "EXPORT", label: "Export" },
                    { value: "QUOTATION", label: "Quotation" }
                  ]}
                  className="w-36 text-primary"
                />
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end w-full md:w-auto">
              <div className="group relative flex items-center justify-start md:justify-end w-full md:w-auto">
                <span className="text-zinc-500 font-medium mr-2">#</span>
                <input 
                  value={invoiceNumber || ""} onChange={e => setInvoiceNumber(e.target.value)} required 
                  className="w-48 text-left md:text-right text-xl font-semibold bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-primary focus:outline-none transition-colors" 
                  placeholder="INV-001"
                />
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 mt-4">
                <span className="text-zinc-500 text-sm w-12 text-left md:text-right font-medium">Date</span>
                <CustomDatePicker value={date} onChange={setDate} />
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 mt-2">
                <span className="text-zinc-500 text-sm w-12 text-left md:text-right font-medium">Due</span>
                <CustomDatePicker value={dueDate || ""} onChange={setDueDate} minDate={date} showPresets={true} />
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 mt-2">
                <span className="text-zinc-500 text-sm w-12 text-left md:text-right font-medium">Ref</span>
                <input 
                  value={reference || ""} onChange={e => setReference(e.target.value)} placeholder="PO-1234"
                  className="w-44 h-10 px-3 text-right rounded-md bg-transparent border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 focus:border-zinc-300 dark:focus:border-zinc-700 focus:outline-none transition-colors text-sm font-medium" 
                />
              </div>
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800 mb-12" />
          {/* Client & Currency */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 mb-12">
            <div className="w-full md:w-1/2 relative group">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Billed To</h3>
              
              {!clientId ? (
                <div className="relative">
                  <div className="flex items-center justify-between bg-[#F4F7F9] dark:bg-zinc-800/60 px-4 py-3 rounded-lg cursor-text border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                       onClick={() => { setShowClientDropdown(true); document.getElementById('client-search-input')?.focus() }}>
                    <div className="flex items-center flex-1">
                      <input 
                        id="client-search-input"
                        type="text"
                        placeholder="Select Customer"
                        value={clientSearch}
                        onChange={e => {
                          setClientSearch(e.target.value)
                          setShowClientDropdown(true)
                          if (!e.target.value) setClientId('')
                        }}
                        onFocus={() => setShowClientDropdown(true)}
                        className="w-full bg-transparent font-bold text-zinc-700 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsAddingClient(true); setShowClientDropdown(false) }}
                      className="whitespace-nowrap text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors ml-2"
                    >
                      + Create Customer
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="cursor-pointer group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900 p-3 -ml-3 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
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
              {showClientDropdown && !clientId && (
                <div className="absolute z-20 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {filteredClients.map(c => (
                    <div 
                      key={c.id} 
                      className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors"
                      onClick={() => {
                        setClientId(c.id)
                        setClientSearch(c.name)
                        setShowClientDropdown(false)
                      }}
                    >
                      <div className="font-medium text-zinc-900 dark:text-white">{c.name}</div>
                      {c.email && <div className="text-xs text-zinc-500">{c.email}</div>}
                    </div>
                  ))}
                  {filteredClients.length === 0 && (
                    <div 
                      className="px-4 py-4 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 cursor-pointer flex items-center gap-2 text-sm font-medium transition-colors"
                      onClick={() => setIsAddingClient(true)}
                    >
                      <Plus size={16} /> Add "{clientSearch}" as new customer
                    </div>
                  )}
                </div>
              )}

              {/* Quick Add Client Form */}
              {isAddingClient && (
                <div className="quick-client-container absolute z-30 w-full md:w-[150%] mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Quick Add Customer</h4>
                    <button type="button" onClick={() => setIsAddingClient(false)} className="text-zinc-400 hover:text-foreground"><X size={16} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="w-full md:w-1/3 flex flex-col items-end">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Currency</h3>
              <CustomDropdown
                value={currency}
                onChange={setCurrency}
                options={[
                  { value: "INR", label: "INR - Indian Rupee" },
                  { value: "USD", label: "USD - US Dollar" },
                  { value: "EUR", label: "EUR - Euro" },
                  { value: "GBP", label: "GBP - British Pound" },
                  { value: "AUD", label: "AUD - Australian Dollar" }
                ]}
                className="w-48 text-right"
                align="right"
              />
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
          {/* Line Items Container */}
          <div className="flex-grow">
            
            {/* Header (Desktop only) */}
            <div className="hidden md:flex border-b-2 border-zinc-900 dark:border-white py-3">
              <div className="flex-1 font-bold text-xs uppercase tracking-widest text-zinc-500">Item Description</div>
              <div className="w-24 font-bold text-xs uppercase tracking-widest text-zinc-500 text-center">Qty</div>
              <div className="w-32 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right">Rate</div>
              {invoiceType === 'REGULAR' && <div className="w-24 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right">Tax</div>}
              <div className="w-32 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right">Amount</div>
              <div className="w-10"></div>
            </div>

            {/* Items */}
            <div className="divide-y border-b border-zinc-100 dark:border-zinc-800 divide-zinc-100 dark:divide-zinc-800">
              {items.map((item, index) => (
                <div key={index} className="group py-4 md:py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-0 relative border border-zinc-200 dark:border-zinc-800 md:border-none p-3 md:p-0 rounded-lg md:rounded-none mb-3 md:mb-0">
                  
                  {/* Delete button (absolute on mobile, normal on desktop) */}
                  <button type="button" onClick={() => removeItem(index)} className="absolute top-3 right-3 md:hidden text-zinc-400 opacity-60 hover:opacity-100 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>

                  <div className="flex-1 md:pr-4">
                    <input 
                      type="text"
                      value={item.name}
                      placeholder="Item Description"
                      onChange={e => updateItem(index, 'name', e.target.value)}
                      className="w-[90%] md:w-full bg-transparent font-semibold md:font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded md:-ml-2 md:px-2 md:py-1 transition-colors"
                    />
                  </div>
                  
                  {/* QTY x PRICE row on mobile */}
                  <div className="flex items-center text-sm md:text-base text-zinc-500 md:text-zinc-900 dark:md:text-zinc-100 md:contents">
                    <div className="flex items-center md:w-24">
                      <input 
                        type="number" min="1" value={item.quantity || ""} 
                        onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-10 md:w-full bg-transparent md:text-center font-medium focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded md:px-2 md:py-1"
                      />
                    </div>
                    <span className="mx-1 md:hidden">×</span>
                    <div className="flex items-center md:w-32">
                      <span className="md:hidden mr-1">{currency}</span>
                      <input 
                        type="number" step="0.01" value={item.price || ""} 
                        onChange={e => updateItem(index, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-20 md:w-full bg-transparent md:text-right font-medium focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded md:px-2 md:py-1"
                      />
                    </div>
                  </div>

                  {/* GST & Total row on mobile */}
                  <div className="flex justify-between items-center mt-1 md:mt-0 md:contents">
                    {invoiceType === 'REGULAR' ? (
                      <div className="text-sm text-zinc-500 md:w-24 md:text-right md:pr-2">
                        <span className="md:hidden">GST </span>{calculatedItems[index].gstRate}%
                      </div>
                    ) : (
                      <div className="text-sm md:hidden" />
                    )}

                    <div className="text-sm md:text-base font-bold md:font-medium text-zinc-900 dark:text-zinc-100 md:w-32 md:text-right">
                      <span className="md:hidden">{currency} </span>{calculatedItems[index].totalWithTax.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Delete button on desktop */}
                  <div className="hidden md:flex w-10 justify-end">
                    <button type="button" onClick={() => removeItem(index)} className="text-zinc-400 opacity-40 hover:opacity-100 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setIsProductModalOpen(true)} className="mt-4 text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 py-2 transition-colors">
              <Plus size={16} /> Add Line Item
            </button>
          </div>

          {/* Footer Area of Document (Totals & Notes) */}
          <div className="flex flex-col sm:flex-row justify-between items-end mt-12 gap-8 border-t-2 border-zinc-900 dark:border-white pt-8">
            <div className="w-full sm:w-1/2 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Notes / Terms</h3>
                <textarea 
                  value={notes || ""} onChange={e => setNotes(e.target.value)} rows={3} 
                  placeholder="Thank you for your business!"
                  className="w-full bg-transparent resize-none focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded p-2 -ml-2 text-sm text-zinc-600 dark:text-zinc-400 transition-colors"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Bank Details</h3>
                <CustomDropdown
                  value={paymentMethod === 'BANK' ? bankId : paymentMethod}
                  onChange={(val: string) => {
                    if (val === 'UPI' || val === 'NONE' || val === 'CASH') { 
                      setPaymentMethod(val as any); 
                      setBankId(''); 
                    } else { 
                      setPaymentMethod('BANK'); 
                      setBankId(val); 
                    }
                  }}
                  options={[
                    { value: "NONE", label: "No Payment Details" },
                    { value: "UPI", label: "UPI Payment" },
                    { value: "CASH", label: "Cash Payment" },
                    ...banks.map(b => ({ value: b.id, label: b.bankName }))
                  ]}
                  className="w-full"
                />
              </div>
            </div>

            <div className="w-full sm:w-[320px] bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-6">
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
                    <CustomDropdown
                      value={discountType}
                      onChange={setDiscountType}
                      options={[
                        { value: "FLAT", label: currency },
                        { value: "PERCENTAGE", label: "%" }
                      ]}
                      className="w-24"
                    />
                  </div>
                  <input 
                    type="number" step="0.01" value={discountValue || ""} onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)} placeholder="0.00"
                    className="w-24 text-right bg-transparent border-b border-dashed border-transparent hover:border-zinc-300 focus:border-primary focus:outline-none text-sm font-medium"
                  />
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-500 text-sm font-medium">Round off total</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={enableRoundOff}
                      onChange={(e) => setEnableRoundOff(e.target.checked)}
                    />
                    <div className="w-8 h-4.5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {autoRoundOff !== 0 && enableRoundOff && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-zinc-500 text-sm font-medium">Rounding Difference</span>
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
        </div>

        {/* Action Buttons */}
        <div className="w-full xl:w-72 xl:sticky xl:top-8 flex flex-col gap-4 self-start order-last fixed sm:static bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 sm:border-0 p-4 sm:p-0 sm:bg-transparent shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:shadow-none pb-safe">
          <div className="bg-transparent sm:bg-white sm:dark:bg-[#0a0a0a] rounded-none sm:rounded-xl shadow-none sm:shadow-lg border-0 sm:border border-zinc-200 dark:border-zinc-800 p-0 sm:p-6">
            <h3 className="hidden sm:flex font-semibold text-sm mb-4 items-center gap-2">
              <Eye size={16} className="text-zinc-400" /> Actions
            </h3>
            
            {/* Desktop layout: standard flex-col stack */}
            <div className="hidden sm:flex flex-col gap-3">
              <button type="submit" onClick={() => setSubmitAction('sent_and_print')} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md px-4 py-3 rounded-xl font-bold transition-all hover:bg-black dark:hover:bg-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2">
                Save & Print
              </button>
              
              <button type="submit" onClick={() => setSubmitAction('sent')} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm px-4 py-3 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-[0.98]">
                Save & Issue
              </button>

              <button type="submit" onClick={() => setSubmitAction('paid')} className="w-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-3 rounded-xl font-bold hover:bg-emerald-500/20 transition-all active:scale-[0.98]">
                Mark as Paid
              </button>
              
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 w-full" />
              
              <button type="submit" onClick={() => setSubmitAction('draft')} className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                Save as Draft
              </button>
              
              <button type="button" onClick={() => router.back()} className="w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 py-2.5 text-sm font-semibold transition-colors rounded-xl">
                Cancel
              </button>
            </div>

            {/* Mobile layout: horizontal layout with primary buttons */}
            <div className="flex sm:hidden items-center justify-between gap-3 w-full max-w-lg mx-auto">
              <div className="flex flex-col items-start min-w-0 flex-[0.8]">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Total Due</span>
                <span className="text-base font-bold leading-tight truncate w-full text-primary">{currency} {finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center gap-2 flex-[1.2]">
                <button type="submit" onClick={() => setSubmitAction('draft')} className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 px-2 py-3 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs text-center whitespace-nowrap">
                  Draft
                </button>
                <button type="submit" onClick={() => setSubmitAction('sent')} className="flex-[1.5] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md px-2 py-3 rounded-xl font-bold transition-all active:scale-[0.98] text-sm text-center whitespace-nowrap">
                  Issue Now
                </button>
              </div>
            </div>
          </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Product Name *</label>
                    <input type="text" name="name" defaultValue={editingProduct.name} required className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block flex gap-1 items-center">Category <span className="text-[10px] lowercase text-zinc-400 normal-case tracking-normal">(Optional)</span></label>
                    <input type="text" name="category" defaultValue={(editingProduct as any).category || ''} placeholder="e.g. Website" className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white transition-colors" />
                  </div>
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
                <div className="overflow-y-auto max-h-[400px]">
                  {Object.keys(
                    filteredProducts.reduce((acc, p) => {
                      const cat = p.category || 'Uncategorized'
                      if (!acc[cat]) acc[cat] = []
                      acc[cat].push(p)
                      return acc
                    }, {} as Record<string, typeof filteredProducts>)
                  ).sort((a, b) => {
                    if (a === 'Uncategorized') return 1;
                    if (b === 'Uncategorized') return -1;
                    return a.localeCompare(b);
                  }).map(category => {
                    const categoryProducts = filteredProducts.filter(p => (p.category || 'Uncategorized') === category)
                    return (
                      <div key={category} className="mb-2">
                        <div className="sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-5 py-2 z-10 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{category}</span>
                        </div>
                        <div className="px-2 pt-1">
                          {categoryProducts.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 hover:bg-sidebar-bg rounded-xl group transition-colors mb-1">
                              <div className="flex-1 cursor-pointer pl-2" onClick={() => handleSelectProduct(p)}>
                                <div className="font-semibold text-foreground text-base mb-1">{p.name}</div>
                                <div className="text-sm text-zinc-500 font-medium">Base Price: {currency}{p.price} <span className="text-zinc-300 mx-2">|</span> GST: {p.gstRate}%</div>
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
                        </div>
                      </div>
                    )
                  })}
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
                  <button onClick={() => setEditingProduct({ name: productSearch, price: 0, gstRate: 18, category: '' })} className="text-zinc-900 dark:text-white font-semibold hover:underline flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
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




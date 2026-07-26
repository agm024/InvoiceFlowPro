'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function getCompanySettings() {
  let settings = await prisma.companySettings.findUnique({
    where: { id: 'default' }
  })

  // Create default settings if they don't exist yet
  if (!settings) {
    settings = await prisma.companySettings.create({
      data: {
        id: 'default',
        companyName: 'Your Company Name',
        upiId: 'demo@upi'
      }
    })
  }
  
  return settings
}

export async function updateCompanySettings(formData: FormData) {
  const companyName = formData.get('companyName') as string
  const brandName = formData.get('brandName') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string
  const gstin = formData.get('gstin') as string
  const businessType = formData.get('businessType') as string
  const altPhone = formData.get('altPhone') as string
  const website = formData.get('website') as string
  const panNo = formData.get('panNo') as string
  const logoUrl = formData.get('logoUrl') as string
  const upiId = formData.get('upiId') as string
  const lutNo = formData.get('lutNo') as string
  const stateCode = formData.get('stateCode') as string

  try {
    await prisma.companySettings.upsert({
      where: { id: 'default' },
      update: { companyName, brandName, phone, email, address, gstin, businessType, altPhone, website, panNo, logoUrl, upiId, lutNo, stateCode },
      create: { id: 'default', companyName, brandName, phone, email, address, gstin, businessType, altPhone, website, panNo, logoUrl, upiId, lutNo, stateCode }
    })
    
    revalidatePath('/settings')
    // Revalidate print and pay routes since they use these settings
    revalidatePath('/', 'layout') 
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update settings:', error)
    return { error: 'Failed to update settings' }
  }
}

export async function getBanks() {
  const banks = await prisma.bank.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      invoices: true,
      expenses: true,
      transfersOut: true,
      transfersIn: true
    }
  })

  return banks.map(bank => {
    const totalIn = bank.invoices
      .filter(i => i.status === 'paid' || i.status === 'partially_paid')
      .reduce((sum, i) => {
        const paid = i.amountPaid || (i.status === 'paid' ? i.total : 0)
        return sum + (paid * (i.exchangeRate || 1))
      }, 0) 
      + bank.transfersIn.reduce((sum, t) => sum + t.amount, 0)
    
    const totalOut = bank.expenses.reduce((sum, e) => sum + e.totalAmount, 0) 
      + bank.transfersOut.reduce((sum, t) => sum + t.amount, 0)
    
    return {
      ...bank,
      currentBalance: totalIn - totalOut
    }
  })
}

export async function createBank(formData: FormData) {
  const bankName = formData.get('bankName') as string
  let accountNumber = formData.get('accountNumber') as string
  const ifsc = formData.get('ifsc') as string
  const swiftCode = formData.get('swiftCode') as string
  const routingNumber = formData.get('routingNumber') as string
  const iban = formData.get('iban') as string

  // Europe accounts may only have IBAN
  if (!accountNumber && iban) {
    accountNumber = iban
  }

  try {
    await prisma.bank.create({
      data: { bankName, accountNumber, ifsc, swiftCode, routingNumber, iban }
    })
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to create bank:', error)
    return { error: 'Failed to create bank' }
  }
}

export async function deleteBank(id: string) {
  try {
    await prisma.bank.delete({ where: { id } })
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete bank:', error)
    return { error: 'Failed to delete bank' }
  }
}

export async function getExchangeRates() {
  return await prisma.exchangeRate.findMany({
    orderBy: { currency: 'asc' }
  })
}

export async function createExchangeRate(formData: FormData) {
  const currency = formData.get('currency') as string
  const rate = parseFloat(formData.get('rate') as string)

  if (!currency || isNaN(rate)) return { error: 'Invalid data' }

  try {
    await prisma.exchangeRate.upsert({
      where: { currency: currency.toUpperCase() },
      update: { rate },
      create: { currency: currency.toUpperCase(), rate }
    })
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to save exchange rate:', error)
    return { error: 'Failed to save exchange rate' }
  }
}

export async function deleteExchangeRate(id: string) {
  try {
    await prisma.exchangeRate.delete({ where: { id } })
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete exchange rate:', error)
    return { error: 'Failed to delete exchange rate' }
  }
}

export async function fetchLiveExchangeRate(currency: string) {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${currency.toUpperCase()}&symbols=INR`, { cache: 'no-store' })
    if (!response.ok) throw new Error('Failed to fetch from Frankfurter')
    const data = await response.json()
    if (data.rates && data.rates.INR) {
      return { success: true, rate: data.rates.INR }
    }
    return { error: 'Rate not found' }
  } catch (error) {
    console.error('Fetch live rate error:', error)
    return { error: 'Failed to fetch live rate' }
  }
}

export async function syncAllExchangeRates() {
  try {
    const rates = await prisma.exchangeRate.findMany()
    let updatedCount = 0
    for (const r of rates) {
      const res = await fetchLiveExchangeRate(r.currency)
      if (res.success && res.rate && res.rate !== r.rate) {
        await prisma.exchangeRate.update({ where: { id: r.id }, data: { rate: res.rate } })
        updatedCount++
      }
    }
    if (updatedCount > 0) revalidatePath('/settings')
    return { success: true, updatedCount }
  } catch (error) {
    console.error('Failed to sync all rates:', error)
    return { error: 'Failed to sync all rates' }
  }
}

export async function getInternalTransfers() {
  return await prisma.internalTransfer.findMany({
    orderBy: { date: 'desc' },
    include: { fromBank: true, toBank: true }
  })
}

export async function createInternalTransfer(formData: FormData) {
  const fromBankId = formData.get('fromBankId') as string
  const toBankId = formData.get('toBankId') as string
  const amount = parseFloat(formData.get('amount') as string)
  const reference = formData.get('reference') as string
  const notes = formData.get('notes') as string
  const dateStr = formData.get('date') as string

  if (!fromBankId || !toBankId || isNaN(amount) || amount <= 0) return { error: 'Invalid data' }
  if (fromBankId === toBankId) return { error: 'Cannot transfer to the same bank' }

  try {
    await prisma.internalTransfer.create({
      data: {
        fromBankId,
        toBankId,
        amount,
        reference,
        notes,
        date: dateStr ? new Date(dateStr) : new Date()
      }
    })
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to create transfer:', error)
    return { error: 'Failed to create transfer' }
  }
}

export async function deleteInternalTransfer(id: string) {
  try {
    await prisma.internalTransfer.delete({ where: { id } })
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete transfer:', error)
    return { error: 'Failed to delete transfer' }
  }
}

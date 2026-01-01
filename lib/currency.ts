/**
 * Currency Conversion System
 * Exchange rates as of December 22, 2025
 */

export type Currency = 'VND' | 'JPY' | 'USD' | 'IDR' | 'BDT' | 'MMK'

export interface CurrencyInfo {
  code: Currency
  symbol: string
  name: string
  flag: string
  rate: number // Rate to VND (1 unit = X VND)
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  VND: {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    flag: '🇻🇳',
    rate: 1
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    rate: 165 // 1 JPY = 165 VND
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rate: 25000 // 1 USD = 25,000 VND
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    flag: '🇮🇩',
    rate: 1.6 // 1 IDR = 1.6 VND
  },
  BDT: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    flag: '🇧🇩',
    rate: 210 // 1 BDT = 210 VND
  },
  MMK: {
    code: 'MMK',
    symbol: 'K',
    name: 'Myanmar Kyat',
    flag: '🇲🇲',
    rate: 12 // 1 MMK = 12 VND
  }
}

/**
 * Convert VND to target currency
 */
export const convertFromVND = (amountVND: number, targetCurrency: Currency): number => {
  const rate = CURRENCIES[targetCurrency].rate
  return amountVND / rate
}

/**
 * Convert any currency to VND
 */
export const convertToVND = (amount: number, sourceCurrency: Currency): number => {
  const rate = CURRENCIES[sourceCurrency].rate
  return amount * rate
}

/**
 * Format currency with proper symbol and decimals
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
  const currencyInfo = CURRENCIES[currency]
  const converted = convertFromVND(amount, currency)
  
  // Different decimal places for different currencies
  let decimals = 0
  if (currency === 'USD') decimals = 2
  else if (currency === 'JPY' || currency === 'IDR' || currency === 'MMK') decimals = 0
  else if (currency === 'BDT') decimals = 0
  else if (currency === 'VND') decimals = 0

  const formatted = converted.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

  // Symbol position
  if (currency === 'USD') return `${currencyInfo.symbol}${formatted}`
  if (currency === 'JPY') return `${currencyInfo.symbol}${formatted}`
  if (currency === 'IDR') return `${currencyInfo.symbol} ${formatted}`
  if (currency === 'BDT') return `${currencyInfo.symbol}${formatted}`
  if (currency === 'MMK') return `${formatted}${currencyInfo.symbol}`
  
  return `${formatted}${currencyInfo.symbol}` // VND default
}

/**
 * Get currency display with flag
 */
export const getCurrencyDisplay = (currency: Currency): string => {
  const info = CURRENCIES[currency]
  return `${info.flag} ${info.code}`
}

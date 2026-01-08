/**
 * Currency Conversion System
 * Base currency: JPY (Japanese Yen)
 * Exchange rates as of December 22, 2025
 */

export type Currency = 'VND' | 'JPY' | 'USD' | 'IDR' | 'BDT' | 'MMK'

export interface CurrencyInfo {
  code: Currency
  symbol: string
  name: string
  flag: string
  rate: number // Rate to JPY (1 unit = X JPY)
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    rate: 1 // Base currency
  },
  VND: {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    flag: '🇻🇳',
    rate: 0.006 // 1 VND = 0.006 JPY (165 VND = 1 JPY)
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rate: 150 // 1 USD = 150 JPY
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    flag: '🇮🇩',
    rate: 0.0097 // 1 IDR = 0.0097 JPY
  },
  BDT: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    flag: '🇧🇩',
    rate: 1.27 // 1 BDT = 1.27 JPY
  },
  MMK: {
    code: 'MMK',
    symbol: 'K',
    name: 'Myanmar Kyat',
    flag: '🇲🇲',
    rate: 0.071 // 1 MMK = 0.071 JPY
  }
}

/**
 * Convert JPY to target currency
 */
export const convertFromJPY = (amountJPY: number, targetCurrency: Currency): number => {
  if (targetCurrency === 'JPY') return amountJPY
  const rate = CURRENCIES[targetCurrency].rate
  return amountJPY / rate
}

/**
 * Convert any currency to JPY
 */
export const convertToJPY = (amount: number, sourceCurrency: Currency): number => {
  const rate = CURRENCIES[sourceCurrency].rate
  return amount * rate
}

// Legacy functions for backward compatibility
export const convertFromVND = convertFromJPY
export const convertToVND = convertToJPY

/**
 * Format currency with proper symbol and decimals
 * Amount is treated as JPY by default
 */
export const formatCurrency = (amount: number, currency: Currency = 'JPY'): string => {
  const currencyInfo = CURRENCIES[currency]
  
  // For JPY, display the amount directly without conversion
  // For other currencies, convert from JPY
  const displayAmount = currency === 'JPY' ? amount : convertFromJPY(amount, currency)
  
  // Different decimal places for different currencies
  let decimals = 0
  if (currency === 'USD') decimals = 2
  else if (currency === 'JPY' || currency === 'IDR' || currency === 'MMK') decimals = 0
  else if (currency === 'BDT') decimals = 0
  else if (currency === 'VND') decimals = 0

  const formatted = displayAmount.toLocaleString('en-US', {
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

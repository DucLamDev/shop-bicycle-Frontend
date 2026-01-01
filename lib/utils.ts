import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatCurrency as formatCurrencyLib } from './currency'
import { Currency } from './currency'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number, currency: Currency = 'VND') => {
  return formatCurrencyLib(amount, currency)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getConditionColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-500'
  if (percentage >= 70) return 'text-blue-500'
  if (percentage >= 50) return 'text-yellow-500'
  return 'text-orange-500'
}

export function getConditionLabel(percentage: number): string {
  if (percentage >= 90) return 'Excellent'
  if (percentage >= 70) return 'Good'
  if (percentage >= 50) return 'Fair'
  return 'Average'
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

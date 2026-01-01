'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { affiliateAPI } from '@/lib/api'
import toast from 'react-hot-toast'

// Cookie helper functions
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export default function AffiliateTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    
    if (ref) {
      // Validate the affiliate token
      affiliateAPI.validateToken(ref)
        .then(response => {
          if (response.data.valid) {
            // Save to both cookie and localStorage for redundancy
            setCookie('affiliate_ref', ref, 30) // 30 days
            localStorage.setItem('affiliate_ref', ref)
            localStorage.setItem('affiliate_ref_time', new Date().toISOString())
            
            // Show discount info if available
            if (response.data.data?.discountCode) {
              toast.success(
                `🎁 Mã giảm giá từ CTV: ${response.data.data.discountCode} (${response.data.data.discountPercent}% OFF)`,
                { duration: 5000 }
              )
            }
          }
        })
        .catch(err => {
          console.log('Affiliate validation error:', err)
        })
    }
  }, [searchParams])

  return null // This is a tracking component, no UI
}

// Utility function to get stored affiliate ref
export function getAffiliateRef(): string | null {
  if (typeof window === 'undefined') return null
  
  // Check cookie first, then localStorage
  const cookieRef = getCookie('affiliate_ref')
  if (cookieRef) return cookieRef
  
  const localRef = localStorage.getItem('affiliate_ref')
  const refTime = localStorage.getItem('affiliate_ref_time')
  
  // Check if ref is still valid (30 days)
  if (localRef && refTime) {
    const refDate = new Date(refTime)
    const now = new Date()
    const diffDays = (now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (diffDays <= 30) {
      return localRef
    } else {
      // Expired, clear it
      localStorage.removeItem('affiliate_ref')
      localStorage.removeItem('affiliate_ref_time')
    }
  }
  
  return null
}

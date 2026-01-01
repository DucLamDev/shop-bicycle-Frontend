'use client'

import { Suspense } from 'react'
import AffiliateTracker from './AffiliateTracker'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AffiliateTracker />
      </Suspense>
      {children}
    </>
  )
}

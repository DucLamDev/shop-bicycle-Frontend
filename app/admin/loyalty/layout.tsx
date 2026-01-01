'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import AdminSidebar from '@/components/admin/Sidebar'

export default function LoyaltyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}

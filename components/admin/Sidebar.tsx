'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  QrCode,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  Home,
  Tag,
  PackagePlus,
  Receipt,
  Crown,
  TrendingUp,
  GraduationCap,
  MessageCircle,
  Menu,
  X
} from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { getAdminText } from '@/lib/i18n/admin'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    {
      title: t('dashboard'),
      icon: LayoutDashboard,
      href: '/admin',
      exact: true
    },
    {
      title: t('products'),
      icon: Package,
      href: '/admin/products'
    },
    {
      title: t('orders'),
      icon: ShoppingCart,
      href: '/admin/orders'
    },
    {
      title: t('imports'),
      icon: PackagePlus,
      href: '/admin/imports'
    },
    {
      title: t('expenses'),
      icon: Receipt,
      href: '/admin/expenses'
    },
    {
      title: t('loyalty'),
      icon: Crown,
      href: '/admin/loyalty'
    },
    {
      title: t('customers'),
      icon: Users,
      href: '/admin/customers'
    },
    {
      title: t('partners'),
      icon: QrCode,
      href: '/admin/partners'
    },
    {
      title: t('coupons'),
      icon: Tag,
      href: '/admin/coupons'
    },
    {
      title: t('studentVerification'),
      icon: GraduationCap,
      href: '/admin/student-verification'
    },
    {
      title: t('chat'),
      icon: MessageCircle,
      href: '/admin/chat'
    },
    {
      title: t('reports'),
      icon: BarChart3,
      href: '/admin/reports'
    },
    {
      title: t('settings'),
      icon: Settings,
      href: '/admin/settings'
    }
  ]

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0a0e17] text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#0a0e17] min-h-screen flex flex-col border-r border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg">ADMIN</div>
              <div className="text-xs text-gray-500">HBike Vietnam</div>
            </div>
          </Link>
        </div>

        <div className="px-4 py-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('dashboard')}</div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href, item.exact)
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">{language === 'ja' ? 'ログアウト' : 'Đăng xuất'}</span>
          </button>
        </div>
      </div>
    </>
  )
}

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
import { useAuthStore } from '@/lib/store'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    {
      title: 'Tổng quan',
      icon: LayoutDashboard,
      href: '/admin',
      exact: true
    },
    {
      title: 'Sản phẩm',
      icon: Package,
      href: '/admin/products'
    },
    {
      title: 'Đơn hàng',
      icon: ShoppingCart,
      href: '/admin/orders'
    },
    {
      title: 'Nhập hàng',
      icon: PackagePlus,
      href: '/admin/imports'
    },
    {
      title: 'Chi phí',
      icon: Receipt,
      href: '/admin/expenses'
    },
    {
      title: 'Khách hàng thân thiết',
      icon: Crown,
      href: '/admin/loyalty'
    },
    {
      title: 'Khách hàng',
      icon: Users,
      href: '/admin/customers'
    },
    {
      title: 'Đối tác',
      icon: QrCode,
      href: '/admin/partners'
    },
    {
      title: 'Mã khuyến mãi',
      icon: Tag,
      href: '/admin/coupons'
    },
    {
      title: 'Xác minh sinh viên',
      icon: GraduationCap,
      href: '/admin/student-verification'
    },
    {
      title: 'Tin nhắn',
      icon: MessageCircle,
      href: '/admin/chat'
    },
    {
      title: 'Báo cáo',
      icon: BarChart3,
      href: '/admin/reports'
    },
    {
      title: 'Cài đặt',
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
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tổng quan</div>
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
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  )
}

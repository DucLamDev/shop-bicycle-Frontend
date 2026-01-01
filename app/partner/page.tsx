'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Package,
  Eye,
  Calendar,
  Award
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PartnerDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCommission: 0,
    totalOrders: 0,
    conversionRate: 0
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'partner') {
      router.push('/login')
      return
    }

    // TODO: Fetch partner stats from API
    setStats({
      totalCustomers: 45,
      totalCommission: 15000000,
      totalOrders: 78,
      conversionRate: 12.5
    })
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'partner') {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const statCards = [
    {
      title: 'Tổng khách hàng',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Hoa hồng tháng này',
      value: formatCurrency(stats.totalCommission),
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+2%'
    }
  ]

  const recentOrders = [
    { id: '001', customer: 'Nguyễn Văn A', product: 'Xe đạp điện Yamaha', amount: 8500000, status: 'Đã giao' },
    { id: '002', customer: 'Trần Thị B', product: 'Xe đạp thể thao', amount: 6200000, status: 'Đang xử lý' },
    { id: '003', customer: 'Lê Văn C', product: 'Xe đạp điện Panasonic', amount: 9800000, status: 'Đã giao' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Xin chào, {user?.name}!
          </h1>
          <p className="text-gray-600">Chào mừng bạn đến với bảng điều khiển đối tác</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng gần đây</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã ĐH</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sản phẩm</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Số tiền</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">#{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.customer}</td>
                    <td className="py-3 px-4 text-sm">{order.product}</td>
                    <td className="py-3 px-4 text-sm font-semibold">{formatCurrency(order.amount)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Đã giao' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Package className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sản phẩm của tôi</h3>
            <p className="text-gray-600 text-sm">Quản lý danh sách sản phẩm bạn giới thiệu</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Eye className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Lượt xem</h3>
            <p className="text-gray-600 text-sm">Theo dõi lượt truy cập từ liên kết của bạn</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Award className="w-10 h-10 text-primary-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Chương trình khuyến mãi</h3>
            <p className="text-gray-600 text-sm">Xem các chương trình hoa hồng hiện tại</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

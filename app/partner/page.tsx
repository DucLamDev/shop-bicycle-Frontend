'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { partnersAPI } from '@/lib/api'
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Package,
  Eye,
  Calendar,
  Award,
  Loader2
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function PartnerDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalCommission: 0,
    paidCommission: 0,
    unpaidCommission: 0,
    thisMonth: {
      orders: 0,
      revenue: 0,
      commission: 0
    },
    recentOrders: [] as any[]
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'partner') {
      router.push('/login')
      return
    }

    fetchPartnerStats()
  }, [isAuthenticated, user, router])

  const fetchPartnerStats = async () => {
    try {
      setLoading(true)
      // Get partner ID from user's partnerId field
      const partnerId = (user as any)?.partnerId
      if (partnerId) {
        const response = await partnersAPI.getStats(partnerId)
        if (response.data.success) {
          setStats(response.data.data)
        }
      }
    } catch (error: any) {
      console.error('Error fetching partner stats:', error)
      toast.error('Không thể tải thống kê')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== 'partner') {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatYen = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Chờ xử lý'
      case 'processing': return 'Đang xử lý'
      case 'shipping': return 'Đang giao'
      case 'delivered': return 'Đã giao'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const statCards = [
    {
      title: 'Tổng doanh số',
      value: formatYen(stats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Hoa hồng tháng này',
      value: formatYen(stats.thisMonth.commission),
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Hoa hồng chưa thanh toán',
      value: formatYen(stats.unpaidCommission),
      icon: Award,
      color: 'bg-orange-500',
    }
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

          {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {!loading && (
          <>
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
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Số tiền</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Hoa hồng</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Chưa có đơn hàng nào
                        </td>
                      </tr>
                    ) : (
                      stats.recentOrders.map((order: any) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">#{order.orderNumber || order._id?.slice(-8)}</td>
                          <td className="py-3 px-4 text-sm">{order.customer}</td>
                          <td className="py-3 px-4 text-sm font-semibold">{formatYen(order.totalAmount)}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-green-600">{formatYen(order.commission)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered' 
                                ? 'bg-green-100 text-green-700' 
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

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

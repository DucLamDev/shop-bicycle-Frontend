'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Calendar, CreditCard, Package, User, Clock } from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { getAdminText } from '@/lib/i18n/admin'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    if (params.id) {
      fetchCustomerDetails()
    }
  }, [isAuthenticated, user, params.id])

  const fetchCustomerDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Fetch customer info
      const customerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (customerRes.ok) {
        const customerData = await customerRes.json()
        setCustomer(customerData.data)
      }

      // Fetch customer orders
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders?customerId=${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.data || [])
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
      toast.error('Không thể tải thông tin khách hàng')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'shipping': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: language === 'ja' ? '処理待ち' : 'Chờ xử lý',
      confirmed: language === 'ja' ? '確認済み' : 'Đã xác nhận',
      processing: language === 'ja' ? '処理中' : 'Đang xử lý',
      shipping: language === 'ja' ? '配送中' : 'Đang giao',
      delivered: language === 'ja' ? '完了' : 'Hoàn thành',
      cancelled: language === 'ja' ? 'キャンセル' : 'Đã hủy'
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f1419]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex min-h-screen bg-[#0f1419]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-4">Không tìm thấy khách hàng</div>
            <button
              onClick={() => router.push('/admin/customers')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/admin/customers')}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('details')} {t('customers')}</h1>
              <p className="text-gray-400">ID: {params.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-4xl font-bold">
                    {customer.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{customer.name || 'Không có tên'}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                  customer.role === 'admin' 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {customer.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="text-white">{customer.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-400">{t('phone')}</div>
                    <div className="text-white">{customer.phone || 'Chưa cập nhật'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-400">{t('address')}</div>
                    <div className="text-white text-sm">
                      {customer.address 
                        ? (typeof customer.address === 'string' 
                            ? customer.address 
                            : [customer.address.street, customer.address.city, customer.address.prefecture].filter(Boolean).join(', ') || 'Chưa cập nhật')
                        : 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-400">{t('joinDate')}</div>
                    <div className="text-white">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'vi-VN') : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700">
                <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <div className="text-3xl font-bold text-white">{orders.length}</div>
                  <div className="text-sm text-gray-400">{t('totalOrders')}</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400">{formatCurrency(totalSpent)}</div>
                  <div className="text-sm text-gray-400">{t('totalSpent')}</div>
                </div>
              </div>
            </motion.div>

            {/* Orders List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {language === 'ja' ? '注文履歴' : 'Lịch sử đơn hàng'}
                </h3>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400">
                  {orders.length} {language === 'ja' ? '件' : 'đơn'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'ja' ? '注文履歴がありません' : 'Chưa có đơn hàng nào'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order._id}
                      className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order._id}`)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400 font-mono text-sm">
                            #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(order.orderStatus)}`}>
                            {getStatusLabel(order.orderStatus)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">{formatCurrency(order.totalAmount || 0)}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'vi-VN')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items?.length || 0} {language === 'ja' ? '商品' : 'sản phẩm'}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'bank' ? 'Bank' : order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

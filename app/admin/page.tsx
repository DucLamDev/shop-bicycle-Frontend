'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, ArrowRight, RefreshCw, Plus, Edit, Trash2, Eye, Download, Bike, QrCode, ShoppingCart, ArrowUpRight, ArrowDownRight, Star, Wifi, WifiOff } from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { dashboardAPI, productsAPI, ordersAPI } from '@/lib/api'
import { getAdminText } from '@/lib/i18n/admin'
import { formatCurrency } from '@/lib/utils'
import { connectSocket, subscribeToDashboard } from '@/lib/socket'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [stats, setStats] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchDashboardData()

    // Connect to socket for real-time updates
    const socket = connectSocket()
    subscribeToDashboard()

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Dashboard connected to socket')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    // Listen for real-time dashboard updates
    socket.on('dashboardUpdate', (data: any) => {
      console.log('Received dashboard update:', data)
      if (data.stats) setStats(data.stats)
      if (data.recentOrders) setRecentOrders(data.recentOrders)
      toast.success(language === 'ja' ? 'データが更新されました!' : 'Dữ liệu đã được cập nhật!', { duration: 2000, icon: '🔄' })
    })

    // Listen for new orders
    socket.on('newOrder', (order: any) => {
      setRecentOrders(prev => [order, ...prev.slice(0, 9)])
      setStats((prev: any) => ({
        ...prev,
        totalOrders: (prev?.totalOrders || 0) + 1,
        totalRevenue: (prev?.totalRevenue || 0) + (order.totalAmount || 0)
      }))
      toast.success(language === 'ja' ? '新しい注文があります!' : 'Có đơn hàng mới!', { icon: '🛒' })
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('dashboardUpdate')
      socket.off('newOrder')
    }
  }, [isAuthenticated, user, router, timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardRes, revenueRes, topProductsRes, ordersRes] = await Promise.all([
        dashboardAPI.getStats({ range: timeRange }),
        dashboardAPI.getRevenue({ range: timeRange }),
        dashboardAPI.getTopProducts(),
        ordersAPI.getAll({ limit: 10 })
      ])
      setStats(dashboardRes.data.stats)
      // Format revenue data for chart
      const formattedRevenue = (revenueRes.data.data || []).map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: item.revenue || 0,
        orders: item.orders || 0
      }))
      setRevenueData(formattedRevenue)
      setTopProducts(topProductsRes.data.data || [])
      setRecentOrders(ordersRes.data.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  const statCards = [
    {
      title: t('totalRevenue'),
      value: formatCurrency(stats?.totalRevenue || 0),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-600 to-green-700'
    },
    {
      title: t('totalOrders'),
      value: (stats?.totalOrders || 0).toString(),
      change: `${stats?.thisMonth?.orders || 0} ${t('thisMonth')}`,
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: t('products'),
      value: (stats?.activeProducts || 0).toString(),
      change: t('active'),
      trend: 'up',
      icon: Package,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: t('customers'),
      value: (stats?.totalCustomers || 0).toString(),
      change: language === 'ja' ? '登録済み' : 'Đã đăng ký',
      trend: 'up',
      icon: Users,
      color: 'from-orange-600 to-orange-700'
    }
  ]

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('dashboard')} Admin</h1>
              <p className="text-gray-400">{language === 'ja' ? 'システム管理の概要' : 'Tổng quan hệ thống quản lý'}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeRange('24h')}
                className={`px-4 py-2 rounded-lg transition-colors ${timeRange === '24h' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'}`}
              >
                24 {language === 'ja' ? '時間' : 'giờ'}
              </button>
              <button 
                onClick={() => setTimeRange('7d')}
                className={`px-4 py-2 rounded-lg transition-colors ${timeRange === '7d' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'}`}
              >
                7 {language === 'ja' ? '日間' : 'ngày'}
              </button>
              <button 
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-lg transition-colors ${timeRange === '30d' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'}`}
              >
                30 {language === 'ja' ? '日間' : 'ngày'}
              </button>
              <button 
                onClick={() => setTimeRange('90d')}
                className={`px-4 py-2 rounded-lg transition-colors ${timeRange === '90d' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'}`}
              >
                90 {language === 'ja' ? '日間' : 'ngày'}
              </button>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.title}</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{language === 'ja' ? '日別売上' : 'Doanh thu theo ngày'}</h2>
                <p className="text-sm text-gray-400">{language === 'ja' ? '過去7日間の売上チャート' : 'Biểu đồ doanh thu 7 ngày gần nhất'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <RefreshCw className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#2d3748' }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b' }}
                  axisLine={{ stroke: '#2d3748' }}
                  tickFormatter={(value) => `${value/1000000}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid #2d3748',
                    borderRadius: '0.75rem'
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="← Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{t('topProducts')}</h2>
                <p className="text-sm text-gray-400">{language === 'ja' ? '売上トップ' : 'Doanh thu cao nhất'}</p>
              </div>
              <Star className="w-6 h-6 text-yellow-400" />
            </div>

            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  {t('noData')}
                </div>
              ) : (
                topProducts.slice(0, 5).map((item: any, index: number) => (
                  <div key={item._id || index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-700'
                    } text-white font-bold text-sm`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm truncate">{item.product?.name || t('products')}</div>
                      <div className="text-xs text-gray-400">{language === 'ja' ? '販売数' : 'Đã bán'}: {item.totalSold || 0}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-sm">{formatCurrency(item.totalRevenue || 0)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{t('recentOrders')}</h2>
              <p className="text-sm text-gray-400">{language === 'ja' ? '最新の取引' : 'Các giao dịch mới nhất'}</p>
            </div>
            <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
              {language === 'ja' ? 'すべて表示' : 'Xem tất cả'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left border-b border-gray-800">
                <tr>
                  <th className="pb-4 text-sm font-semibold text-gray-400">{t('orderNumber')}</th>
                  <th className="pb-4 text-sm font-semibold text-gray-400">{t('customers')}</th>
                  <th className="pb-4 text-sm font-semibold text-gray-400">{t('products')}</th>
                  <th className="pb-4 text-sm font-semibold text-gray-400">{t('orderTotal')}</th>
                  <th className="pb-4 text-sm font-semibold text-gray-400">{t('orderStatus')}</th>
                  <th className="pb-4 text-sm font-semibold text-gray-400">{t('orderDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {recentOrders.slice(0, 8).map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4">
                      <span className="text-sm font-mono text-blue-400">
                        #{order.orderNumber || order._id?.slice(-6).toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {order.customer?.name?.charAt(0) || 'K'}
                        </div>
                        <span className="text-sm text-white">{order.customer?.name || (language === 'ja' ? '顧客' : 'Khách')}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-300">{order.items?.length || 0} {language === 'ja' ? '商品' : 'sản phẩm'}</td>
                    <td className="py-4 text-sm font-semibold text-white">{formatCurrency(order.totalAmount || 0)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        order.orderStatus === 'shipping' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        order.orderStatus === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {order.orderStatus === 'delivered' ? t('delivered') :
                         order.orderStatus === 'shipping' ? t('shipped') :
                         order.orderStatus === 'cancelled' ? t('cancelled') : t('pending')}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}

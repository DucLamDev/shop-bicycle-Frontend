
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  TrendingUp, DollarSign, ShoppingCart, Copy, Check, 
  Users, Calendar, Package, CreditCard, LogOut,
  BarChart3, Wallet, Clock, CheckCircle, XCircle
} from 'lucide-react'
import { collaboratorAPI, authAPI } from '@/lib/api'
import { useLanguageStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface DashboardData {
  collaborator: {
    id: string
    name: string
    email: string
    commissionRate: {
      electricBike: number
      normalBike: number
      sportBike: number
    }
  }
  stats: {
    totalOrders: number
    totalRevenue: number
    totalCommission: number
    paidCommission: number
    pendingCommission: number
    referralCode: string
  }
  monthlyStats: Array<{
    month: string
    orders: number
    revenue: number
    commission: number
  }>
  categoryStats: {
    electric: { count: number; commission: number }
    normal: { count: number; commission: number }
    sport: { count: number; commission: number }
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    totalAmount: number
    commission: number
    status: string
    paymentStatus: string
    createdAt: string
  }>
}

export default function CollaboratorDashboardPage() {
  const router = useRouter()
  const { language } = useLanguageStore()
  const t = useTranslation(language)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await authAPI.getMe()
      const userData = response.data.user
      
      if (!userData.partnerId) {
        toast.error(t('collaborator.notAuthorized'))
        router.push('/')
        return
      }

      setUser(userData)
      fetchDashboard()
    } catch (err) {
      router.push('/login')
    }
  }

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await collaboratorAPI.getDashboard()
      setData(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || t('collaborator.fetchError'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(t('collaborator.copied'))
    setTimeout(() => setCopied(false), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-500'
      case 'cancelled': return 'text-red-500'
      case 'processing': return 'text-blue-500'
      default: return 'text-yellow-500'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, Record<string, string>> = {
      pending: { ja: '保留中', en: 'Pending', vi: 'Chờ xử lý' },
      confirmed: { ja: '確認済み', en: 'Confirmed', vi: 'Đã xác nhận' },
      processing: { ja: '処理中', en: 'Processing', vi: 'Đang xử lý' },
      shipping: { ja: '配送中', en: 'Shipping', vi: 'Đang giao' },
      delivered: { ja: '配達完了', en: 'Delivered', vi: 'Đã giao' },
      cancelled: { ja: 'キャンセル', en: 'Cancelled', vi: 'Đã hủy' }
    }
    return statusMap[status]?.[language] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-red-900/50 p-8 rounded-2xl border border-red-500">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t('common.error')}</h1>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-8 h-8 text-purple-400" />
                {t('collaborator.dashboard')}
              </h1>
              <p className="text-gray-400 mt-1">
                {t('collaborator.welcome')}, {data.collaborator.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Referral Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 mb-8 border border-purple-500/30"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            {t('collaborator.referralCode')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-black/30 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">{t('collaborator.yourCode')}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-400 font-mono">
                  {data.stats.referralCode}
                </span>
                <button
                  onClick={() => copyToClipboard(data.stats.referralCode, 'code')}
                  className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{data.stats.totalOrders}</p>
            <p className="text-sm text-gray-400">{t('collaborator.totalOrders')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl p-6 border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(data.stats.totalCommission)}</p>
            <p className="text-sm text-gray-400">{t('collaborator.totalCommission')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-2xl p-6 border border-yellow-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-yellow-400" />
              </div>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(data.stats.pendingCommission)}</p>
            <p className="text-sm text-gray-400">{t('collaborator.pendingCommission')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(data.stats.paidCommission)}</p>
            <p className="text-sm text-gray-400">{t('collaborator.paidCommission')}</p>
          </motion.div>
        </div>

        {/* Commission Rates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-400" />
            {t('collaborator.commissionRates')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
              <p className="text-blue-400 text-sm mb-1">{t('collaborator.electricBike')}</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.collaborator.commissionRate.electricBike)}</p>
              <p className="text-xs text-gray-400">/ {t('collaborator.perUnit')}</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
              <p className="text-green-400 text-sm mb-1">{t('collaborator.normalBike')}</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.collaborator.commissionRate.normalBike)}</p>
              <p className="text-xs text-gray-400">/ {t('collaborator.perUnit')}</p>
            </div>
            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
              <p className="text-orange-400 text-sm mb-1">{t('collaborator.sportBike')}</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.collaborator.commissionRate.sportBike)}</p>
              <p className="text-xs text-gray-400">/ {t('collaborator.perUnit')}</p>
            </div>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              {t('collaborator.monthlyCommission')}
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="commission" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-400" />
              {t('collaborator.categorySales')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl">
                <div>
                  <p className="text-blue-400 font-medium">{t('collaborator.electricBike')}</p>
                  <p className="text-sm text-gray-400">{data.categoryStats.electric.count} {t('collaborator.unitsSold')}</p>
                </div>
                <p className="text-xl font-bold text-white">{formatCurrency(data.categoryStats.electric.commission)}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl">
                <div>
                  <p className="text-green-400 font-medium">{t('collaborator.normalBike')}</p>
                  <p className="text-sm text-gray-400">{data.categoryStats.normal.count} {t('collaborator.unitsSold')}</p>
                </div>
                <p className="text-xl font-bold text-white">{formatCurrency(data.categoryStats.normal.commission)}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-xl">
                <div>
                  <p className="text-orange-400 font-medium">{t('collaborator.sportBike')}</p>
                  <p className="text-sm text-gray-400">{data.categoryStats.sport.count} {t('collaborator.unitsSold')}</p>
                </div>
                <p className="text-xl font-bold text-white">{formatCurrency(data.categoryStats.sport.commission)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            {t('collaborator.recentOrders')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('collaborator.orderNumber')}</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">{t('collaborator.customer')}</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('collaborator.amount')}</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('collaborator.commission')}</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">{t('collaborator.status')}</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">{t('collaborator.date')}</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      {t('collaborator.noOrders')}
                    </td>
                  </tr>
                ) : (
                  data.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-mono">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-gray-300">{order.customer}</td>
                      <td className="py-3 px-4 text-right text-white">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-3 px-4 text-right text-green-400 font-semibold">{formatCurrency(order.commission)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'vi' ? 'vi-VN' : 'en-US')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

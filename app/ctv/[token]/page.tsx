'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  TrendingUp, DollarSign, ShoppingCart, Copy, Check, 
  Users, Calendar, Package, CreditCard, ExternalLink,
  BarChart3, Wallet, Clock, CheckCircle, XCircle
} from 'lucide-react'
import { affiliateAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface DashboardData {
  partner: {
    id: string
    name: string
    email: string
    phone: string
    token: string
    partnerType: string
    ctvCommission: {
      electricBike: number
      normalBike: number
      sportBike: number
    }
    exclusiveDiscount?: {
      code: string
      discountPercent: number
    }
  }
  stats: {
    totalOrders: number
    totalRevenue: number
    totalCommissionEarned: number
    commissionPaid: number
    commissionPending: number
    affiliateLink: string
    discountCode: string | null
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

export default function CTVDashboardPage() {
  const params = useParams()
  const token = params.token as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (token) {
      fetchDashboard()
    }
  }, [token])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await affiliateAPI.getDashboard(token)
      setData(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(`Đã sao chép ${label}`)
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
    const statusMap: Record<string, string> = {
      'pending': '保留中',
      'confirmed': '確認済み',
      'processing': '処理中',
      'shipping': '配送中',
      'delivered': '配達完了',
      'cancelled': 'キャンセル'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-red-900/50 p-8 rounded-2xl border border-red-500">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">エラー</h1>
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
                CTV Dashboard
              </h1>
              <p className="text-gray-400 mt-1">ようこそ、{data.partner.name}さん</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">パートナータイプ</p>
              <span className="px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm font-medium uppercase">
                {data.partner.partnerType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Affiliate Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 mb-8 border border-purple-500/30"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-purple-400" />
            アフィリエイトリンク / Link giới thiệu
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-2">紹介リンク</p>
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-3">
                <input
                  type="text"
                  value={data.stats.affiliateLink}
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
                <button
                  onClick={() => copyToClipboard(data.stats.affiliateLink, 'リンク')}
                  className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
            {data.stats.discountCode && (
              <div className="md:w-64">
                <p className="text-sm text-gray-400 mb-2">割引コード</p>
                <div className="flex items-center gap-2 bg-black/30 rounded-lg p-3">
                  <span className="flex-1 text-yellow-400 font-mono font-bold">{data.stats.discountCode}</span>
                  <button
                    onClick={() => copyToClipboard(data.stats.discountCode!, 'コード')}
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            )}
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
            <p className="text-sm text-gray-400">総注文数</p>
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
            <p className="text-3xl font-bold text-white">{formatCurrency(data.stats.totalCommissionEarned)}</p>
            <p className="text-sm text-gray-400">総コミッション</p>
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
            <p className="text-3xl font-bold text-white">{formatCurrency(data.stats.commissionPending)}</p>
            <p className="text-sm text-gray-400">未払いコミッション</p>
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
            <p className="text-3xl font-bold text-white">{formatCurrency(data.stats.commissionPaid)}</p>
            <p className="text-sm text-gray-400">支払い済み</p>
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
            コミッション率 / Tỷ lệ hoa hồng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
              <p className="text-blue-400 text-sm mb-1">電動アシスト自転車</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.partner.ctvCommission.electricBike)}</p>
              <p className="text-xs text-gray-400">/ 台</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
              <p className="text-green-400 text-sm mb-1">普通自転車</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.partner.ctvCommission.normalBike)}</p>
              <p className="text-xs text-gray-400">/ 台</p>
            </div>
            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
              <p className="text-orange-400 text-sm mb-1">スポーツ自転車</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(data.partner.ctvCommission.sportBike)}</p>
              <p className="text-xs text-gray-400">/ 台</p>
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
              月別コミッション
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
              カテゴリ別販売
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl">
                <div>
                  <p className="text-blue-400 font-medium">電動アシスト</p>
                  <p className="text-sm text-gray-400">{data.categoryStats.electric.count} 台販売</p>
                </div>
                <p className="text-xl font-bold text-white">{formatCurrency(data.categoryStats.electric.commission)}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl">
                <div>
                  <p className="text-green-400 font-medium">普通自転車</p>
                  <p className="text-sm text-gray-400">{data.categoryStats.normal.count} 台販売</p>
                </div>
                <p className="text-xl font-bold text-white">{formatCurrency(data.categoryStats.normal.commission)}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-xl">
                <div>
                  <p className="text-orange-400 font-medium">スポーツ</p>
                  <p className="text-sm text-gray-400">{data.categoryStats.sport.count} 台販売</p>
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
            最近の注文
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">注文番号</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">顧客</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">金額</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">コミッション</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">ステータス</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">日付</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      まだ注文がありません
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
                        {new Date(order.createdAt).toLocaleDateString('ja-JP')}
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

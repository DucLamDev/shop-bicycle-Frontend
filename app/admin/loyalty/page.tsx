'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Crown, Gift, Star, TrendingUp, Search,
  Award, Heart, Calendar, Mail, Phone, ShoppingBag,
  Eye, Tag, Cake, Medal
} from 'lucide-react'
import { customersAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const TIER_COLORS: any = {
  bronze: 'bg-orange-100 text-orange-800 border-orange-200',
  silver: 'bg-gray-100 text-gray-800 border-gray-200',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  platinum: 'bg-purple-100 text-purple-800 border-purple-200',
  diamond: 'bg-blue-100 text-blue-800 border-blue-200'
}

const TIER_ICONS: any = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  diamond: '👑'
}

export default function LoyaltyPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [appreciation, setAppreciation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState({ tier: '', search: '', sortBy: 'totalSpent' })
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchCustomers()
    fetchStats()
    fetchTopCustomers()
    fetchAppreciation()
  }, [filter])

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll(filter)
      setCustomers(response.data.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopCustomers = async () => {
    try {
      const response = await customersAPI.getTop({ limit: 10, by: 'spent' })
      setTopCustomers(response.data.data)
    } catch (error) {
      console.error('Error fetching top customers:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await customersAPI.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchAppreciation = async () => {
    try {
      const response = await customersAPI.getAppreciation()
      setAppreciation(response.data.data)
    } catch (error) {
      console.error('Error fetching appreciation:', error)
    }
  }

  const viewCustomerDetails = async (id: string) => {
    try {
      const response = await customersAPI.getById(id)
      setSelectedCustomer(response.data.data)
      setShowModal(true)
    } catch (error) {
      toast.error('Không thể tải thông tin khách hàng')
    }
  }

  const getTierBadge = (tier: string) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${TIER_COLORS[tier]}`}>
        {TIER_ICONS[tier]} {tier.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khách hàng thân thiết</h1>
          <p className="text-gray-600">Quản lý và tri ân khách hàng VIP</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Khách VIP</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vipCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Khách mới tháng này</p>
                <p className="text-2xl font-bold text-green-600">{stats.newThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sinh nhật tháng này</p>
                <p className="text-2xl font-bold text-pink-600">{appreciation?.birthdayCustomers?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Cake className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tier Distribution */}
      {stats?.byTier && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bố hạng thành viên</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.byTier.map((tier: any) => (
              <div key={tier._id} className={`p-4 rounded-xl border-2 ${TIER_COLORS[tier._id]}`}>
                <div className="text-3xl mb-2">{TIER_ICONS[tier._id]}</div>
                <p className="font-bold text-lg">{tier._id.toUpperCase()}</p>
                <p className="text-2xl font-bold">{tier.count}</p>
                <p className="text-sm opacity-75">khách hàng</p>
                <p className="text-xs mt-2">Tổng chi: {formatCurrency(tier.totalSpent)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Tất cả khách hàng
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'top'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Medal className="w-4 h-4 inline mr-2" />
              Top khách hay mua
            </button>
            <button
              onClick={() => setActiveTab('vip')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'vip'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Crown className="w-4 h-4 inline mr-2" />
              Khách VIP
            </button>
            <button
              onClick={() => setActiveTab('birthday')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'birthday'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Cake className="w-4 h-4 inline mr-2" />
              Sinh nhật
            </button>
          </nav>
        </div>

        {/* Filters (only for 'all' tab) */}
        {activeTab === 'all' && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  placeholder="Tìm theo tên, email, SĐT..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filter.tier}
                onChange={(e) => setFilter({ ...filter, tier: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả hạng</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
              </select>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="totalSpent">Tổng chi tiêu</option>
                <option value="totalOrders">Số đơn hàng</option>
                <option value="lastOrder">Đơn gần nhất</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {activeTab === 'all' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn hàng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng chi tiêu</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm tích lũy</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              {customer.name}
                              {customer.isVIP && <Crown className="w-4 h-4 text-yellow-500" />}
                            </p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                            <p className="text-xs text-gray-400">{customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getTierBadge(customer.loyaltyTier)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-gray-900">{customer.totalOrders}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-green-600">{formatCurrency(customer.totalSpent)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          -{customer.discountPercent}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{customer.loyaltyPoints?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => viewCustomerDetails(customer._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'top' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                Top 10 khách hàng hay mua nhất (để tri ân)
              </h3>
              <div className="grid gap-4">
                {topCustomers.map((customer, index) => (
                  <motion.div
                    key={customer._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border-2 ${
                      index === 0 ? 'border-yellow-300 bg-yellow-50' :
                      index === 1 ? 'border-gray-300 bg-gray-50' :
                      index === 2 ? 'border-orange-300 bg-orange-50' :
                      'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                          index === 0 ? 'bg-yellow-200' :
                          index === 1 ? 'bg-gray-200' :
                          index === 2 ? 'bg-orange-200' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-2">
                            {customer.name}
                            {customer.isVIP && <Crown className="w-4 h-4 text-yellow-500" />}
                          </p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                        <p className="text-sm text-gray-500">{customer.totalOrders} đơn hàng</p>
                      </div>
                      <div>
                        {getTierBadge(customer.loyaltyTier)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vip' && appreciation?.vipCustomers && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-500" />
                Khách hàng VIP ({appreciation.vipCustomers.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appreciation.vipCustomers.map((customer: any) => (
                  <div key={customer._id} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {customer.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{customer.name}</p>
                        {getTierBadge(customer.loyaltyTier)}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tổng chi tiêu:</span>
                        <span className="font-bold text-green-600">{formatCurrency(customer.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số đơn hàng:</span>
                        <span className="font-bold">{customer.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Giảm giá:</span>
                        <span className="font-bold text-blue-600">-{customer.discountPercent}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'birthday' && appreciation?.birthdayCustomers && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Cake className="w-5 h-5 text-pink-500" />
                Sinh nhật trong tháng ({appreciation.birthdayCustomers.length})
              </h3>
              {appreciation.birthdayCustomers.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {appreciation.birthdayCustomers.map((customer: any) => (
                    <div key={customer._id} className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-2xl">
                          🎂
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                          <p className="text-xs text-pink-600 font-medium mt-1">
                            Sinh nhật: {new Date(customer.birthday).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-pink-100 rounded-lg text-center">
                        <p className="text-sm text-pink-800">
                          🎁 Gợi ý: Tặng voucher giảm {customer.birthdayDiscount}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Cake className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Không có khách hàng sinh nhật trong tháng này</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Chi tiết khách hàng</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.customer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {selectedCustomer.customer.name}
                    {selectedCustomer.customer.isVIP && <Crown className="w-5 h-5 text-yellow-500" />}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedCustomer.customer.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedCustomer.customer.phone}</span>
                  </div>
                  <div className="mt-2">{getTierBadge(selectedCustomer.customer.loyaltyTier)}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.customer.totalOrders}</p>
                  <p className="text-xs text-gray-500">Đơn hàng</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedCustomer.customer.totalSpent)}</p>
                  <p className="text-xs text-gray-500">Tổng chi</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">-{selectedCustomer.customer.discountPercent}%</p>
                  <p className="text-xs text-gray-500">Giảm giá</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{selectedCustomer.customer.loyaltyPoints?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Điểm</p>
                </div>
              </div>

              {/* Tier Benefits */}
              {selectedCustomer.tierBenefits && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-yellow-600" />
                    Quyền lợi hạng {selectedCustomer.customer.loyaltyTier.toUpperCase()}
                  </h4>
                  <p className="text-gray-600">{selectedCustomer.tierBenefits.description}</p>
                </div>
              )}

              {/* Recent Orders */}
              {selectedCustomer.orders?.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Đơn hàng gần đây
                  </h4>
                  <div className="space-y-2">
                    {selectedCustomer.orders.slice(0, 5).map((order: any) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                          <p className="text-xs text-gray-500">{order.items?.length} sản phẩm</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

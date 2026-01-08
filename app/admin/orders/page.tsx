'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, Search, Filter, Download, Trash2, Edit, Printer } from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { ordersAPI, invoiceAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'
import { getAdminText } from '@/lib/i18n/admin'

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated, user])

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll()
      setOrders(response.data.data)
    } catch (error) {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, { orderStatus: newStatus })
      toast.success(t('saveSuccess'))
      fetchOrders()
    } catch (error) {
      toast.error(t('saveFailed'))
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await ordersAPI.delete(orderId)
      toast.success(t('deleteSuccess'))
      fetchOrders()
    } catch (error) {
      toast.error(t('deleteFailed'))
    }
  }

  const handlePrintInvoice = (orderId: string) => {
    window.open(invoiceAPI.getInvoiceHtml(orderId), '_blank')
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'confirmed': return 'bg-blue-500/20 text-blue-400'
      case 'processing': return 'bg-purple-500/20 text-purple-400'
      case 'shipping': return 'bg-cyan-500/20 text-cyan-400'
      case 'delivered': return 'bg-green-500/20 text-green-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return t('pending')
      case 'confirmed': return t('completed')
      case 'processing': return t('processing')
      case 'shipping': return t('shipped')
      case 'delivered': return t('delivered')
      case 'cancelled': return t('cancelled')
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">{t('loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('orderManagement')}</h1>
              <p className="text-gray-400">{t('totalOrders')}: {filteredOrders.length}</p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              {t('exportExcel')}
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('search') + '...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="all">{t('all')} {t('orderStatus')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="confirmed">{t('completed')}</option>
                <option value="processing">{t('processing')}</option>
                <option value="shipping">{t('shipped')}</option>
                <option value="delivered">{t('delivered')}</option>
                <option value="cancelled">{t('cancelled')}</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">{t('orderNumber')}</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">{t('customers')}</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">{t('products')}</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">{t('orderTotal')}</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">{t('orderStatus')}</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">{t('orderDate')}</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-mono text-sm">
                          #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{order.customer?.name || t('customers')}</div>
                        <div className="text-gray-400 text-sm">{order.customer?.email || order.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{order.items?.length || 0} {t('products')}</div>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {formatCurrency(order.totalAmount || 0)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus || 'pending'}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm outline-none cursor-pointer ${getStatusColor(order.orderStatus)}`}
                        >
                          <option value="pending">{t('pending')}</option>
                          <option value="confirmed">{t('completed')}</option>
                          <option value="processing">{t('processing')}</option>
                          <option value="shipping">{t('shipped')}</option>
                          <option value="delivered">{t('delivered')}</option>
                          <option value="cancelled">{t('cancelled')}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePrintInvoice(order._id)}
                            className="p-2 text-green-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title={t('printInvoice')}
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/orders/${order._id}`)}
                            className="p-2 text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title={t('details')}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title={t('delete')}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                {t('noResults')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

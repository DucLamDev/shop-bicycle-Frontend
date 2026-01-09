'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, Search, Download, Trash2, Edit, Printer, Receipt, Image as ImageIcon, X, CheckCircle, Clock, Package, Truck, XCircle, CreditCard, Wallet } from 'lucide-react'
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
  const [filterOrderStatus, setFilterOrderStatus] = useState('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null)
  const [viewingOrder, setViewingOrder] = useState<any>(null)
  const [editingOrder, setEditingOrder] = useState<any>(null)

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
      toast.error('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus?: string) => {
    try {
      await ordersAPI.updateStatus(orderId, { 
        orderStatus,
        ...(paymentStatus && { paymentStatus })
      })
      toast.success('Đã cập nhật trạng thái')
      fetchOrders()
      setEditingOrder(null)
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) return
    try {
      await ordersAPI.delete(orderId)
      toast.success('Đã xóa đơn hàng')
      fetchOrders()
    } catch (error) {
      toast.error('Không thể xóa đơn hàng')
    }
  }

  const handlePrintInvoice = async (orderId: string) => {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    iframe.src = invoiceAPI.getInvoiceHtml(orderId)
    
    document.body.appendChild(iframe)
    
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print()
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 1000)
      }, 500)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.phone?.includes(searchTerm)
    const matchesOrderStatus = filterOrderStatus === 'all' || order.orderStatus === filterOrderStatus
    const matchesPaymentStatus = filterPaymentStatus === 'all' || order.paymentStatus === filterPaymentStatus
    return matchesSearch && matchesOrderStatus && matchesPaymentStatus
  })

  const getOrderStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'shipping': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getOrderStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'shipping': return 'Đang giao'
      case 'delivered': return 'Đã giao'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getOrderStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'shipping': return <Truck className="w-4 h-4" />
      case 'delivered': return <Package className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch(status) {
      case 'paid': return 'Đã thanh toán'
      case 'pending': return 'Chưa thanh toán'
      default: return status
    }
  }

  // Stats
  const totalRevenue = orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length
  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f1419]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Quản lý đơn hàng</h1>
              <p className="text-gray-400">Tổng: {orders.length} đơn hàng</p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              Xuất Excel
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white"
            >
              <div className="text-3xl font-bold mb-2">{orders.length}</div>
              <div className="text-sm opacity-90">Tổng đơn hàng</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl p-6 text-white"
            >
              <div className="text-3xl font-bold mb-2">{pendingOrders}</div>
              <div className="text-sm opacity-90">Chờ xác nhận</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white"
            >
              <div className="text-3xl font-bold mb-2">{deliveredOrders}</div>
              <div className="text-sm opacity-90">Đã giao thành công</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white"
            >
              <div className="text-3xl font-bold mb-2">¥{totalRevenue.toLocaleString()}</div>
              <div className="text-sm opacity-90">Tổng doanh thu</div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-[#1a1f2e] rounded-2xl p-6 mb-6 border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, tên, email, SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none border border-gray-700"
                />
              </div>
              <select
                value={filterOrderStatus}
                onChange={(e) => setFilterOrderStatus(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none border border-gray-700"
              >
                <option value="all">Tất cả trạng thái đơn</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none border border-gray-700"
              >
                <option value="all">Tất cả trạng thái thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="pending">Chưa thanh toán</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#1a1f2e] rounded-2xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Mã đơn</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Khách hàng</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Tổng tiền</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Thanh toán</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">TT Đơn hàng</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">TT Thanh toán</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Ngày đặt</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-mono text-sm font-medium">
                          #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {order.items?.length || 0} sản phẩm
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{order.customer?.name}</div>
                        <div className="text-gray-400 text-sm">{order.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-bold">¥{(order.totalAmount || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            order.paymentMethod === 'bank_transfer' ? 'bg-blue-500/20 text-blue-400' :
                            order.paymentMethod === 'cod' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' :
                             order.paymentMethod === 'cod' ? 'COD' : 'Visa'}
                          </span>
                          {(order.paymentMethod === 'bank_transfer' || order.paymentMethod === 'visa_card') && (
                            <button
                              onClick={() => {
                                const receiptUrl = order.bankTransferInfo?.receiptImage || order.visaCardInfo?.receiptImage
                                if (receiptUrl) {
                                  setViewingReceipt(receiptUrl)
                                } else {
                                  toast.error('Chưa có ảnh bill chuyển khoản')
                                }
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                order.bankTransferInfo?.receiptImage || order.visaCardInfo?.receiptImage
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-gray-500/20 text-gray-500'
                              }`}
                              title={order.bankTransferInfo?.receiptImage || order.visaCardInfo?.receiptImage 
                                ? 'Xem bill chuyển khoản' 
                                : 'Chưa có bill'}
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getOrderStatusColor(order.orderStatus)}`}>
                          {getOrderStatusIcon(order.orderStatus)}
                          {getOrderStatusText(order.orderStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === 'paid' ? <CreditCard className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                          {getPaymentStatusText(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            title="Sửa trạng thái"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          {/* Print */}
                          <button
                            onClick={() => handlePrintInvoice(order._id)}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="In hóa đơn"
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Xóa đơn hàng"
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
                Không tìm thấy đơn hàng nào
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setViewingOrder(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1f2e] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Chi tiết đơn hàng #{viewingOrder.orderNumber || viewingOrder._id?.slice(-8)}</h2>
              <button onClick={() => setViewingOrder(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-400">Tên:</span> <span className="text-white ml-2">{viewingOrder.customer?.name}</span></div>
                  <div><span className="text-gray-400">SĐT:</span> <span className="text-white ml-2">{viewingOrder.customer?.phone}</span></div>
                  <div><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{viewingOrder.customer?.email}</span></div>
                  <div><span className="text-gray-400">Địa chỉ:</span> <span className="text-white ml-2">{viewingOrder.customer?.address?.street}, {viewingOrder.customer?.address?.city}</span></div>
                </div>
              </div>
              
              {/* Products */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3">Sản phẩm ({viewingOrder.items?.length || 0})</h3>
                <div className="space-y-3">
                  {viewingOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-white">{item.name || 'Sản phẩm'}</span>
                        <span className="text-gray-400 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-white font-medium">¥{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-gray-400 text-sm mb-2">Trạng thái đơn hàng</h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getOrderStatusColor(viewingOrder.orderStatus)}`}>
                    {getOrderStatusIcon(viewingOrder.orderStatus)}
                    {getOrderStatusText(viewingOrder.orderStatus)}
                  </span>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-gray-400 text-sm mb-2">Trạng thái thanh toán</h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getPaymentStatusColor(viewingOrder.paymentStatus)}`}>
                    {viewingOrder.paymentStatus === 'paid' ? <CreditCard className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                    {getPaymentStatusText(viewingOrder.paymentStatus)}
                  </span>
                </div>
              </div>

              {/* Receipt Image */}
              {(viewingOrder.bankTransferInfo?.receiptImage || viewingOrder.visaCardInfo?.receiptImage) && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3">Bill chuyển khoản</h3>
                  <img 
                    src={viewingOrder.bankTransferInfo?.receiptImage || viewingOrder.visaCardInfo?.receiptImage}
                    alt="Receipt"
                    className="w-full max-h-64 object-contain rounded-lg cursor-pointer"
                    onClick={() => setViewingReceipt(viewingOrder.bankTransferInfo?.receiptImage || viewingOrder.visaCardInfo?.receiptImage)}
                  />
                </div>
              )}

              {/* Total */}
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-medium">Tổng cộng</span>
                  <span className="text-2xl font-bold text-white">¥{(viewingOrder.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setEditingOrder(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1f2e] rounded-2xl w-full max-w-md border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Cập nhật trạng thái</h2>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trạng thái đơn hàng</label>
                <select
                  value={editingOrder.orderStatus}
                  onChange={(e) => setEditingOrder({ ...editingOrder, orderStatus: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-red-500 outline-none"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao thành công</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Trạng thái thanh toán</label>
                <select
                  value={editingOrder.paymentStatus}
                  onChange={(e) => setEditingOrder({ ...editingOrder, paymentStatus: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-red-500 outline-none"
                >
                  <option value="pending">Chưa thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => updateOrderStatus(editingOrder._id, editingOrder.orderStatus, editingOrder.paymentStatus)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Receipt Image Modal */}
      {viewingReceipt && (
        <div 
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingReceipt(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-green-400" />
                Bill chuyển khoản
              </h3>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img 
                src={viewingReceipt} 
                alt="Transfer Receipt" 
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

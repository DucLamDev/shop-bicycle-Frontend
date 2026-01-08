'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, Plus, Search, Filter, TrendingUp, DollarSign, 
  Truck, CheckCircle, Clock, XCircle, Eye, Edit, Trash2,
  BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { importsAPI, productsAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useLanguageStore } from '@/lib/store'
import { getAdminText } from '@/lib/i18n/admin'

export default function ImportsPage() {
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [imports, setImports] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedImport, setSelectedImport] = useState<any>(null)
  const [filter, setFilter] = useState({ status: '', page: 1 })

  const [formData, setFormData] = useState({
    product: '',
    supplier: { name: '', phone: '', email: '', address: '' },
    quantity: 1,
    costPrice: 0,
    sellingPrice: 0,
    shippingCost: 0,
    otherCosts: 0,
    notes: ''
  })

  useEffect(() => {
    fetchImports()
    fetchProducts()
    fetchStats()
  }, [filter])

  const fetchImports = async () => {
    try {
      const response = await importsAPI.getAll(filter)
      setImports(response.data.data)
    } catch (error) {
      console.error('Error fetching imports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 100 })
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await importsAPI.getStats({})
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedImport) {
        await importsAPI.update(selectedImport._id, formData)
        toast.success(t('saveSuccess'))
      } else {
        await importsAPI.create(formData)
        toast.success(t('saveSuccess'))
      }
      setShowModal(false)
      resetForm()
      fetchImports()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('error'))
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await importsAPI.updateStatus(id, { status })
      toast.success(t('saveSuccess'))
      fetchImports()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('error'))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await importsAPI.delete(id)
      toast.success(t('deleteSuccess'))
      fetchImports()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const resetForm = () => {
    setFormData({
      product: '',
      supplier: { name: '', phone: '', email: '', address: '' },
      quantity: 1,
      costPrice: 0,
      sellingPrice: 0,
      shippingCost: 0,
      otherCosts: 0,
      notes: ''
    })
    setSelectedImport(null)
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      received: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    const labels: any = {
      pending: t('pending'),
      received: t('completed'),
      cancelled: t('cancelled')
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const calculatedProfit = formData.sellingPrice - formData.costPrice
  const calculatedMargin = formData.costPrice > 0 ? ((calculatedProfit / formData.costPrice) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhập hàng</h1>
          <p className="text-gray-600">Quản lý giá nhập, giá bán và tính lợi nhuận</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo phiếu nhập
        </button>
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
                <p className="text-sm text-gray-500">Tổng phiếu nhập</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImports}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-500">Tổng chi phí</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCost)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-red-600" />
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
                <p className="text-sm text-gray-500">Lợi nhuận dự kiến</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.expectedProfit)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-500">Chờ nhận hàng</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.byStatus?.pending || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ nhận</option>
            <option value="received">Đã nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Imports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã phiếu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NCC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá nhập</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá bán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lợi nhuận</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {imports.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.importNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {item.product?.images?.[0] && (
                        <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">{item.product?.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.supplier?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.costPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-green-600">+{formatCurrency(item.profit)}</p>
                      <p className="text-xs text-gray-500">{item.profitMargin}%</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {item.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'received')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Xác nhận đã nhận"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {selectedImport ? 'Cập nhật phiếu nhập' : 'Tạo phiếu nhập mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm *</label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>{p.name} - {p.brand}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên NCC *</label>
                    <input
                      type="text"
                      value={formData.supplier.name}
                      onChange={(e) => setFormData({ ...formData, supplier: { ...formData.supplier, name: e.target.value } })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SĐT NCC</label>
                    <input
                      type="text"
                      value={formData.supplier.phone}
                      onChange={(e) => setFormData({ ...formData, supplier: { ...formData.supplier, phone: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá nhập (VNĐ) *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá bán (VNĐ) *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Profit Preview */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">Dự tính lợi nhuận</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Lợi nhuận/sp</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(calculatedProfit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tỷ lệ lợi nhuận</p>
                      <p className="text-xl font-bold text-blue-600">{calculatedMargin}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tổng lợi nhuận</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(calculatedProfit * formData.quantity)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phí ship</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.shippingCost}
                      onChange={(e) => setFormData({ ...formData, shippingCost: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chi phí khác</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.otherCosts}
                      onChange={(e) => setFormData({ ...formData, otherCosts: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedImport ? 'Cập nhật' : 'Tạo phiếu nhập'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

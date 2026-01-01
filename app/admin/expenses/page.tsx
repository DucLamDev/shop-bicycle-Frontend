'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Receipt, Plus, Search, Filter, TrendingDown, DollarSign, 
  Zap, Droplets, Wifi, Home, Users, Shield, Wrench, Megaphone,
  CheckCircle, Clock, XCircle, Edit, Trash2, Calendar
} from 'lucide-react'
import { expensesAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const CATEGORY_ICONS: any = {
  electricity: Zap,
  water: Droplets,
  internet: Wifi,
  rent: Home,
  salary: Users,
  insurance: Shield,
  maintenance: Wrench,
  marketing: Megaphone,
  equipment: Receipt,
  transport: Receipt,
  tax: Receipt,
  other: Receipt
}

const CATEGORY_COLORS: any = {
  electricity: 'bg-yellow-100 text-yellow-600',
  water: 'bg-blue-100 text-blue-600',
  internet: 'bg-purple-100 text-purple-600',
  rent: 'bg-orange-100 text-orange-600',
  salary: 'bg-green-100 text-green-600',
  insurance: 'bg-red-100 text-red-600',
  maintenance: 'bg-gray-100 text-gray-600',
  marketing: 'bg-pink-100 text-pink-600',
  equipment: 'bg-indigo-100 text-indigo-600',
  transport: 'bg-cyan-100 text-cyan-600',
  tax: 'bg-red-100 text-red-600',
  other: 'bg-gray-100 text-gray-600'
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [categories, setCategories] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [filter, setFilter] = useState({ 
    category: '', 
    status: '', 
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  const [formData, setFormData] = useState({
    category: 'electricity',
    amount: 0,
    description: '',
    paymentMethod: 'cash',
    period: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
    isRecurring: false,
    recurringDay: 1,
    dueDate: '',
    notes: ''
  })

  useEffect(() => {
    fetchExpenses()
    fetchCategories()
    fetchStats()
  }, [filter])

  const fetchExpenses = async () => {
    try {
      const response = await expensesAPI.getAll(filter)
      setExpenses(response.data.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await expensesAPI.getCategories()
      setCategories(response.data.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await expensesAPI.getStats({ month: filter.month, year: filter.year })
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedExpense) {
        await expensesAPI.update(selectedExpense._id, formData)
        toast.success('Cập nhật chi phí thành công')
      } else {
        await expensesAPI.create(formData)
        toast.success('Thêm chi phí thành công')
      }
      setShowModal(false)
      resetForm()
      fetchExpenses()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await expensesAPI.updateStatus(id, { status })
      toast.success('Cập nhật trạng thái thành công')
      fetchExpenses()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa chi phí này?')) return
    try {
      await expensesAPI.delete(id)
      toast.success('Đã xóa chi phí')
      fetchExpenses()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const resetForm = () => {
    setFormData({
      category: 'electricity',
      amount: 0,
      description: '',
      paymentMethod: 'cash',
      period: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      isRecurring: false,
      recurringDay: 1,
      dueDate: '',
      notes: ''
    })
    setSelectedExpense(null)
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    const labels: any = {
      pending: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      cancelled: 'Đã hủy'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chi phí</h1>
          <p className="text-gray-600">Theo dõi các chi phí điện, nước, nhân viên, ...</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm chi phí
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
                <p className="text-sm text-gray-500">Tổng chi phí tháng {filter.month}</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
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
                <p className="text-sm text-gray-500">Đã thanh toán</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.byStatus?.paid?.total || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-500">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.byStatus?.pending?.total || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
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
                <p className="text-sm text-gray-500">Số khoản chi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byCategory?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats?.byCategory && stats.byCategory.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Chi phí theo danh mục</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stats.byCategory.map((cat: any) => {
              const Icon = CATEGORY_ICONS[cat._id] || Receipt
              return (
                <div key={cat._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${CATEGORY_COLORS[cat._id]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{cat.categoryName}</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(cat.total)}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <select
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: parseInt(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>
          <select
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {Object.entries(categories).map(([key, name]) => (
              <option key={key} value={key}>{name as string}</option>
            ))}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chưa thanh toán</option>
            <option value="paid">Đã thanh toán</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kỳ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense) => {
                const Icon = CATEGORY_ICONS[expense.category] || Receipt
                return (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${CATEGORY_COLORS[expense.category]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900">{expense.categoryName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{expense.description}</p>
                      {expense.notes && (
                        <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-lg font-bold text-red-600">{formatCurrency(expense.amount)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.period.month}/{expense.period.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(expense.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {expense.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(expense._id, 'paid')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Đánh dấu đã thanh toán"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedExpense(expense)
                            setFormData({
                              category: expense.category,
                              amount: expense.amount,
                              description: expense.description,
                              paymentMethod: expense.paymentMethod,
                              period: expense.period,
                              isRecurring: expense.isRecurring,
                              recurringDay: expense.recurringDay || 1,
                              dueDate: expense.dueDate || '',
                              notes: expense.notes || ''
                            })
                            setShowModal(true)
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {selectedExpense ? 'Cập nhật chi phí' : 'Thêm chi phí mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(categories).map(([key, name]) => (
                      <option key={key} value={key}>{name as string}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền (VNĐ) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="VD: Tiền điện tháng 12/2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tháng</label>
                    <select
                      value={formData.period.month}
                      onChange={(e) => setFormData({ ...formData, period: { ...formData.period, month: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Năm</label>
                    <select
                      value={formData.period.year}
                      onChange={(e) => setFormData({ ...formData, period: { ...formData.period, year: parseInt(e.target.value) } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {[2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                    <option value="card">Thẻ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
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
                    {selectedExpense ? 'Cập nhật' : 'Thêm chi phí'}
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

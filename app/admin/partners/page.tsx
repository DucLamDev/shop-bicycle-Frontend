'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, Search, Mail, Phone, MapPin, TrendingUp, DollarSign, Package, X, Copy, Link, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import AdminSidebar from '@/components/admin/Sidebar'
import { partnersAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminPartnersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<any>(null)
  const [selectedPartner, setSelectedPartner] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnerType: 'ctv',
    ctvCommission: {
      electricBike: 5000,
      normalBike: 1500,
      sportBike: 2000
    }
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchPartners()
  }, [isAuthenticated, user])

  const fetchPartners = async () => {
    try {
      const response = await partnersAPI.getAll()
      setPartners(response.data.data || [])
    } catch (error) {
      toast.error('Không thể tải danh sách đối tác')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingPartner(null)
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      partnerType: 'ctv',
      ctvCommission: {
        electricBike: 5000,
        normalBike: 1500,
        sportBike: 2000
      }
    })
    setShowModal(true)
  }

  const handleOpenEdit = (partner: any) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name || '',
      contactPerson: partner.contactPerson || '',
      email: partner.email || '',
      phone: partner.phone || '',
      partnerType: partner.partnerType || 'ctv',
      ctvCommission: partner.ctvCommission || {
        electricBike: 5000,
        normalBike: 1500,
        sportBike: 2000
      }
    })
    setShowModal(true)
  }

  const handleViewDetail = (partner: any) => {
    setSelectedPartner(partner)
    setShowDetailModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPartner) {
        await partnersAPI.update(editingPartner._id, formData)
        toast.success('Đã cập nhật đối tác')
      } else {
        await partnersAPI.create(formData)
        toast.success('Đã thêm đối tác mới')
      }
      setShowModal(false)
      fetchPartners()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép!')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đối tác này?')) return
    
    try {
      await partnersAPI.delete(id)
      toast.success('Đã xóa đối tác')
      fetchPartners()
    } catch (error) {
      toast.error('Không thể xóa đối tác')
    }
  }

  const filteredPartners = partners.filter(partner => 
    partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Quản lý đối tác</h1>
              <p className="text-gray-400">Cộng tác viên & đại lý phân phối</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Thêm đối tác
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">↗ +15%</div>
              </div>
              <div className="text-3xl font-bold mb-2">{filteredPartners.length}</div>
              <div className="text-sm opacity-90">Tổng đối tác</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">↗ +22%</div>
              </div>
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(partners.reduce((sum, p) => sum + (p.totalSales || 0), 0))}
              </div>
              <div className="text-sm opacity-90">Tổng doanh số</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">Tháng này</div>
              </div>
              <div className="text-3xl font-bold mb-2">
                {partners.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm opacity-90">Đang hoạt động</div>
            </motion.div>
          </div>

          {/* Search */}
          <div className="bg-[#1a1f2e] rounded-2xl p-6 mb-6 border border-gray-800">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đối tác theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 text-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none border border-gray-700"
              />
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <motion.div
                key={partner._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {partner.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        partner.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {partner.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{partner.email || 'Chưa có email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{partner.phone || 'Chưa có SĐT'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{partner.address || 'Chưa có địa chỉ'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-800">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {partner.totalOrders || 0}
                    </div>
                    <div className="text-xs text-gray-400">Đơn hàng</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {partner.commission || 0}%
                    </div>
                    <div className="text-xs text-gray-400">Hoa hồng</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleViewDetail(partner)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleOpenEdit(partner)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(partner._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">Không tìm thấy đối tác nào</div>
              <button
                onClick={handleOpenAdd}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Thêm đối tác mới
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1f2e] rounded-2xl p-6 w-full max-w-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingPartner ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tên đối tác *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Người liên hệ</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Loại đối tác</label>
                  <select
                    value={formData.partnerType}
                    onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-red-500 outline-none"
                  >
                    <option value="ctv">CTV (Cộng tác viên)</option>
                    <option value="agency">Đại lý</option>
                    <option value="affiliate">Affiliate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-red-500 outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-white font-medium mb-3">Hoa hồng theo loại xe</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Xe điện (¥)</label>
                    <input
                      type="number"
                      value={formData.ctvCommission.electricBike}
                      onChange={(e) => setFormData({
                        ...formData,
                        ctvCommission: { ...formData.ctvCommission, electricBike: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Xe thường (¥)</label>
                    <input
                      type="number"
                      value={formData.ctvCommission.normalBike}
                      onChange={(e) => setFormData({
                        ...formData,
                        ctvCommission: { ...formData.ctvCommission, normalBike: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Xe thể thao (¥)</label>
                    <input
                      type="number"
                      value={formData.ctvCommission.sportBike}
                      onChange={(e) => setFormData({
                        ...formData,
                        ctvCommission: { ...formData.ctvCommission, sportBike: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  {editingPartner ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1f2e] rounded-2xl p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Chi tiết đối tác</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Partner Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {selectedPartner.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedPartner.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    selectedPartner.isActive !== false
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {selectedPartner.partnerType?.toUpperCase() || 'CTV'}
                  </span>
                </div>
              </div>

              {/* Affiliate Link */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <label className="block text-sm text-gray-400 mb-2">Link giới thiệu</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}?ref=${selectedPartner.token}`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}?ref=${selectedPartner.token}`)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <a
                    href={`/ctv/${selectedPartner.token}`}
                    target="_blank"
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-2xl font-bold text-white">{selectedPartner.totalOrders || 0}</div>
                  <div className="text-sm text-gray-400">Đơn hàng</div>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                  <div className="text-2xl font-bold text-green-400">¥{(selectedPartner.totalCommissionEarned || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Tổng hoa hồng</div>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                  <div className="text-2xl font-bold text-yellow-400">¥{(selectedPartner.commissionPending || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Chưa thanh toán</div>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-2xl font-bold text-purple-400">¥{(selectedPartner.commissionPaid || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Đã thanh toán</div>
                </div>
              </div>

              {/* Commission Rates */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-white font-medium mb-3">Mức hoa hồng</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">¥{(selectedPartner.ctvCommission?.electricBike || 5000).toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Xe điện</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">¥{(selectedPartner.ctvCommission?.normalBike || 1500).toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Xe thường</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-400">¥{(selectedPartner.ctvCommission?.sportBike || 2000).toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Xe thể thao</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <div className="text-white">{selectedPartner.email || 'Chưa có'}</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Điện thoại</span>
                  </div>
                  <div className="text-white">{selectedPartner.phone || 'Chưa có'}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleOpenEdit(selectedPartner)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Chỉnh sửa
                </button>
                <a
                  href={`/ctv/${selectedPartner.token}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Xem Dashboard CTV
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

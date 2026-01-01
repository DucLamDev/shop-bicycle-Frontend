'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, Check, X, Eye, Clock, CheckCircle, XCircle, Search } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { studentVerificationAPI } from '@/lib/api'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function AdminStudentVerificationPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [verifications, setVerifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [filter, setFilter] = useState('all')
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, user, filter])

  const fetchData = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filter !== 'all') params.status = filter

      const [verificationsRes, statsRes] = await Promise.all([
        studentVerificationAPI.getAll(params),
        studentVerificationAPI.getStats()
      ])

      setVerifications(verificationsRes.data.data)
      setStats(statsRes.data.data)
    } catch (error) {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setApproving(true)
    try {
      const response = await studentVerificationAPI.approve(id, {
        discountPercent: 10,
        validDays: 30
      })
      toast.success(`Đã phê duyệt! Mã giảm giá: ${response.data.data.discountCode}`)
      setShowModal(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Lý do từ chối (tùy chọn):')
    try {
      await studentVerificationAPI.reject(id, { adminNotes: reason })
      toast.success('Đã từ chối yêu cầu')
      setShowModal(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const openDetail = (verification: any) => {
    setSelectedVerification(verification)
    setShowModal(true)
  }

  if (loading && !verifications.length) {
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Xác minh sinh viên</h1>
            <p className="text-gray-400">Quản lý yêu cầu giảm giá sinh viên</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-90">Tổng yêu cầu</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-5 text-white"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm opacity-90">Chờ duyệt</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 text-white"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.approved}</div>
                  <div className="text-sm opacity-90">Đã duyệt</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-5 text-white"
            >
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{stats.rejected}</div>
                  <div className="text-sm opacity-90">Từ chối</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1a1f2e] text-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'Tất cả' :
                 status === 'pending' ? 'Chờ duyệt' :
                 status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
              </button>
            ))}
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f1419] text-gray-400 text-sm">
                  <tr>
                    <th className="px-6 py-4 text-left">Thông tin</th>
                    <th className="px-6 py-4 text-left">Trường</th>
                    <th className="px-6 py-4 text-left">MSSV</th>
                    <th className="px-6 py-4 text-left">Trạng thái</th>
                    <th className="px-6 py-4 text-left">Ngày gửi</th>
                    <th className="px-6 py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {verifications.map((v) => (
                    <tr key={v._id} className="hover:bg-[#252b3b] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{v.customerName}</div>
                          <div className="text-sm text-gray-400">{v.email}</div>
                          <div className="text-sm text-gray-500">{v.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{v.schoolName}</td>
                      <td className="px-6 py-4 text-gray-300">{v.studentId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          v.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          v.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {v.status === 'approved' ? 'Đã duyệt' :
                           v.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                        </span>
                        {v.discountCode && (
                          <div className="text-xs text-blue-400 mt-1">{v.discountCode}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(v.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetail(v)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {v.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(v._id)}
                                className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                title="Phê duyệt"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReject(v._id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Từ chối"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {verifications.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  Không có yêu cầu nào
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Chi tiết yêu cầu xác minh</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Họ tên</label>
                  <div className="font-medium">{selectedVerification.customerName}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="font-medium">{selectedVerification.email}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Số điện thoại</label>
                  <div className="font-medium">{selectedVerification.phone}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Trường</label>
                  <div className="font-medium">{selectedVerification.schoolName}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Mã số sinh viên</label>
                  <div className="font-medium">{selectedVerification.studentId}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Trạng thái</label>
                  <div className={`font-medium ${
                    selectedVerification.status === 'approved' ? 'text-green-600' :
                    selectedVerification.status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {selectedVerification.status === 'approved' ? 'Đã duyệt' :
                     selectedVerification.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                  </div>
                </div>
              </div>

              {selectedVerification.studentIdImage && (
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Ảnh thẻ sinh viên</label>
                  <img
                    src={selectedVerification.studentIdImage}
                    alt="Student ID"
                    className="max-w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {selectedVerification.discountCode && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="text-sm text-green-600 block mb-1">Mã giảm giá đã cấp</label>
                  <div className="text-2xl font-bold text-green-700">{selectedVerification.discountCode}</div>
                  <div className="text-sm text-green-600 mt-1">
                    Giảm {selectedVerification.discountPercent}% - 
                    Hết hạn: {new Date(selectedVerification.discountExpiresAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              )}

              {selectedVerification.adminNotes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-500 block mb-1">Ghi chú</label>
                  <div className="text-gray-700">{selectedVerification.adminNotes}</div>
                </div>
              )}

              {selectedVerification.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedVerification._id)}
                    disabled={approving}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {approving ? 'Đang xử lý...' : 'Phê duyệt & Cấp mã giảm giá'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedVerification._id)}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

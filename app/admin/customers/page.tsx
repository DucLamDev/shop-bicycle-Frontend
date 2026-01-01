'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, Search, Mail, Phone, MapPin } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function AdminCustomersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchCustomers()
  }, [isAuthenticated, user])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Vui lòng đăng nhập lại')
        router.push('/login')
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }
      
      const data = await response.json()
      setCustomers(data.data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Quản lý khách hàng</h1>
            <p className="text-gray-400">Tổng số: {filteredCustomers.length} khách hàng</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <motion.div
                key={customer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-bold">
                      {customer.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1 truncate">
                      {customer.name || 'Không có tên'}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      customer.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {customer.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{customer.phone || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm truncate">
                      {customer.address 
                        ? (typeof customer.address === 'string' 
                            ? customer.address 
                            : [customer.address.street, customer.address.city, customer.address.prefecture, customer.address.country].filter(Boolean).join(', ') || 'Chưa cập nhật')
                        : 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {customer.totalOrders || 0}
                      </div>
                      <div className="text-xs text-gray-400">Đơn hàng</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {customer.totalSpent ? `${(customer.totalSpent / 1000000).toFixed(1)}M` : '0'}
                      </div>
                      <div className="text-xs text-gray-400">Tổng chi</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/admin/customers/${customer._id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Không tìm thấy khách hàng nào
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

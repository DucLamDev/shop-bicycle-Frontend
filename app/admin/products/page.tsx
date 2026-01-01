'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { productsAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchProducts()
  }, [isAuthenticated, user])

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll()
      setProducts(response.data.data)
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    
    try {
      await productsAPI.delete(id)
      toast.success('Đã xóa sản phẩm')
      fetchProducts()
    } catch (error) {
      toast.error('Không thể xóa sản phẩm')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Quản lý sản phẩm</h1>
              <p className="text-gray-400">Tổng số: {filteredProducts.length} sản phẩm</p>
            </div>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm sản phẩm
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="normal">Xe đạp thường</option>
                <option value="electric">Xe đạp điện</option>
                <option value="sport">Xe đạp thể thao</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Hình ảnh</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Tên sản phẩm</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Danh mục</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Giá</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Tình trạng</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Tồn kho</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{product.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">
                          {product.category === 'normal' ? 'Xe thường' :
                           product.category === 'electric' ? 'Xe điện' : 'Xe thể thao'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          product.condition === 'new' ? 'bg-green-500/20 text-green-400' :
                          product.condition === 'like-new' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {product.condition === 'new' ? 'Mới' :
                           product.condition === 'like-new' ? 'Như mới' : 'Đã qua sử dụng'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          product.stock > 10 ? 'text-green-400' :
                          product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {product.stock} chiếc
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/products/${product._id}`)}
                            className="p-2 text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Xem"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                            className="p-2 text-green-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Xóa"
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

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

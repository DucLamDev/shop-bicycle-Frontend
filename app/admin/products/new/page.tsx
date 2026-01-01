'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { productsAPI, uploadAPI } from '@/lib/api'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function NewProductPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<number[]>([])
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'electric',
    price: '',
    condition: 'used',
    conditionPercentage: 90,
    stock: 1,
    description: {
      vi: '',
      en: '',
      ja: ''
    },
    specifications: {
      batteryType: '',
      rangeKm: '',
      motorPower: '',
      frameSize: '',
      weight: '',
      color: ''
    },
    images: [''],
    videoUrl: '',
    replacedParts: [''],
    warranty: {
      battery: 3,
      motor: 3,
      discountPercent: 10
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        specifications: {
          ...formData.specifications,
          rangeKm: Number(formData.specifications.rangeKm) || undefined,
          weight: Number(formData.specifications.weight) || undefined
        },
        images: formData.images.filter(img => img.trim() !== ''),
        replacedParts: formData.replacedParts.filter(part => part.trim() !== '')
      }

      await productsAPI.create(submitData)
      toast.success('Đã tạo sản phẩm mới')
      router.push('/admin/products')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tạo sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] })
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages.length ? newImages : [''] })
  }

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const addPart = () => {
    setFormData({ ...formData, replacedParts: [...formData.replacedParts, ''] })
  }

  const removePart = (index: number) => {
    const newParts = formData.replacedParts.filter((_, i) => i !== index)
    setFormData({ ...formData, replacedParts: newParts.length ? newParts : [''] })
  }

  const updatePart = (index: number, value: string) => {
    const newParts = [...formData.replacedParts]
    newParts[index] = value
    setFormData({ ...formData, replacedParts: newParts })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result as string
      setUploadingImages(prev => [...prev, index])
      
      try {
        const response = await uploadAPI.uploadProductImages([base64Image])
        const imageUrl = response.data.data.images[0]
        const newImages = [...formData.images]
        newImages[index] = imageUrl
        setFormData({ ...formData, images: newImages })
        toast.success('Đã tải ảnh lên thành công!')
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Tải ảnh lên thất bại')
      } finally {
        setUploadingImages(prev => prev.filter(i => i !== index))
      }
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (isClient && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login')
    }
  }, [isClient, isAuthenticated, user, router])

  if (!isClient) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Thêm sản phẩm mới</h1>
              <p className="text-gray-400">Điền thông tin sản phẩm bên dưới</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Thông tin cơ bản</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thương hiệu *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Panasonic">Panasonic</option>
                    <option value="Bridgestone">Bridgestone</option>
                    <option value="Giant">Giant</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Danh mục *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="electric">Xe đạp điện</option>
                    <option value="normal">Xe đạp thường</option>
                    <option value="sport">Xe đạp thể thao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tình trạng
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="new">Mới</option>
                    <option value="like-new">Như mới</option>
                    <option value="used">Đã qua sử dụng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phần trăm tình trạng (%)
                  </label>
                  <input
                    type="number"
                    value={formData.conditionPercentage}
                    onChange={(e) => setFormData({ ...formData, conditionPercentage: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Mô tả sản phẩm</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mô tả (Tiếng Việt)
                  </label>
                  <textarea
                    value={formData.description.vi}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description, vi: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mô tả (English)
                  </label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description, en: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Thông số kỹ thuật</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Loại pin
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.batteryType}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, batteryType: e.target.value }
                    })}
                    placeholder="VD: Lithium-ion 15.4Ah"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quãng đường (km)
                  </label>
                  <input
                    type="number"
                    value={formData.specifications.rangeKm}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, rangeKm: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Công suất động cơ
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.motorPower}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, motorPower: e.target.value }
                    })}
                    placeholder="VD: 250W"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kích thước khung
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.frameSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, frameSize: e.target.value }
                    })}
                    placeholder="VD: 26 inch"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trọng lượng (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.specifications.weight}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, weight: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.color}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, color: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Hình ảnh & Video</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL Video (YouTube)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hình ảnh sản phẩm
                  </label>
                  <p className="text-gray-400 text-xs mb-3">Tải ảnh lên hoặc nhập URL trực tiếp</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        {uploadingImages.includes(index) ? (
                          <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                          </div>
                        ) : img && img.startsWith('http') ? (
                          <div className="relative group">
                            <img
                              src={img}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="w-full h-32 bg-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors border-2 border-dashed border-gray-500">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-gray-400 text-xs">Tải ảnh lên</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addImage}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      + Thêm ô ảnh
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hoặc nhập URL ảnh trực tiếp
                    </label>
                    {formData.images.map((img, index) => (
                      <div key={`url-${index}`} className="flex gap-2 mb-2">
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => updateImage(index, e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 text-red-400 hover:bg-gray-600 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Replaced Parts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Bộ phận đã thay</h2>
              
              {formData.replacedParts.map((part, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={part}
                    onChange={(e) => updatePart(index, e.target.value)}
                    placeholder="VD: Lốp, Phanh, Xích..."
                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePart(index)}
                    className="p-3 text-red-400 hover:bg-gray-600 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPart}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                + Thêm bộ phận
              </button>
            </motion.div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

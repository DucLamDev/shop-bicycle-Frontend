'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { productsAPI } from '@/lib/api'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'
import { getAdminText } from '@/lib/i18n/admin'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'electric',
    price: '',
    condition: 'used',
    conditionPercentage: 90,
    stock: 1,
    status: 'active',
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

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(params.id as string)
      const product = response.data.data
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || 'electric',
        price: product.price?.toString() || '',
        condition: product.condition || 'used',
        conditionPercentage: product.conditionPercentage || 90,
        stock: product.stock || 1,
        status: product.status || 'active',
        description: {
          vi: product.description?.vi || '',
          en: product.description?.en || '',
          ja: product.description?.ja || ''
        },
        specifications: {
          batteryType: product.specifications?.batteryType || '',
          rangeKm: product.specifications?.rangeKm?.toString() || '',
          motorPower: product.specifications?.motorPower || '',
          frameSize: product.specifications?.frameSize || '',
          weight: product.specifications?.weight?.toString() || '',
          color: product.specifications?.color || ''
        },
        images: product.images?.length ? product.images : [''],
        videoUrl: product.videoUrl || '',
        replacedParts: product.replacedParts?.length ? product.replacedParts : [''],
        warranty: {
          battery: product.warranty?.battery || 3,
          motor: product.warranty?.motor || 3,
          discountPercent: product.warranty?.discountPercent || 10
        }
      })
    } catch (error) {
      toast.error(t('productUpdateFailed'))
      router.push('/admin/products')
    } finally {
      setFetching(false)
    }
  }

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

      await productsAPI.update(params.id as string, submitData)
      toast.success(t('productUpdated'))
      router.push('/admin/products')
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('productUpdateFailed'))
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

  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/login')
    return null
  }

  if (fetching) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('editProductTitle')}</h1>
              <p className="text-gray-400">{t('fillProductInfo')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">{t('basicInfo')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('productName')} *
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
                    {t('brand')} *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">{t('selectBrand')}</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Panasonic">Panasonic</option>
                    <option value="Bridgestone">Bridgestone</option>
                    <option value="Giant">Giant</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('category')} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="electric">{t('electricBike')}</option>
                    <option value="normal">{t('normalBike')}</option>
                    <option value="sport">{t('sportBike')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('priceJPY')} *
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
                    {t('stock')}
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
                    {t('condition')}
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="new">{t('conditionNew')}</option>
                    <option value="like-new">{t('conditionLikeNew')}</option>
                    <option value="used">{t('conditionUsed')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('conditionPercentage')}
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('orderStatus')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="active">{t('active')}</option>
                    <option value="inactive">{t('inactive')}</option>
                    <option value="reserved">{t('pending')}</option>
                    <option value="sold">{t('completed')}</option>
                  </select>
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
              <h2 className="text-xl font-bold text-white mb-6">{t('productDescription')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('descriptionVi')}
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
                    🇬🇧 {t('descriptionEn')}
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
              <h2 className="text-xl font-bold text-white mb-6">{t('technicalSpecs')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('batteryType')}
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.batteryType}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, batteryType: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('rangeKm')}
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
                    {t('motorPower')}
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.motorPower}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, motorPower: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('frameSize')}
                  </label>
                  <input
                    type="text"
                    value={formData.specifications.frameSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, frameSize: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('weight')}
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
                    {t('color')}
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
              <h2 className="text-xl font-bold text-white mb-6">{t('imagesAndVideo')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('videoUrl')}
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('productImages')}
                  </label>
                  {formData.images.map((img, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => updateImage(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-3 text-red-400 hover:bg-gray-600 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    + {t('addImageSlot')}
                  </button>
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
              <h2 className="text-xl font-bold text-white mb-6">{t('replacedParts')}</h2>
              
              {formData.replacedParts.map((part, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={part}
                    onChange={(e) => updatePart(index, e.target.value)}
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
                + {t('addPart')}
              </button>
            </motion.div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? t('saving') : t('updateProduct')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { productsAPI, uploadAPI } from '@/lib/api'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'
import { getAdminText } from '@/lib/i18n/admin'

export default function NewProductPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<number[]>([])
  const [formData, setFormData] = useState({
    name: '',
    nameJa: '',
    nameEn: '',
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
    },
    // Battery options for electric bikes
    batteryOptions: [] as Array<{
      type: string
      name: string
      capacity: string
      range: number
      priceAdjustment: number
      inStock: boolean
    }>
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
        replacedParts: formData.replacedParts.filter(part => part.trim() !== ''),
        batteryOptions: formData.category === 'electric' ? formData.batteryOptions : []
      }

      await productsAPI.create(submitData)
      toast.success(t('productCreated'))
      router.push('/admin/products')
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('productCreateFailed'))
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

  // Battery options management
  const addBatteryOption = () => {
    setFormData({
      ...formData,
      batteryOptions: [
        ...formData.batteryOptions,
        {
          type: 'lithium_basic',
          name: '',
          capacity: '',
          range: 0,
          priceAdjustment: 0,
          inStock: true
        }
      ]
    })
  }

  const removeBatteryOption = (index: number) => {
    const newOptions = formData.batteryOptions.filter((_, i) => i !== index)
    setFormData({ ...formData, batteryOptions: newOptions })
  }

  const updateBatteryOption = (index: number, field: string, value: any) => {
    const newOptions = [...formData.batteryOptions]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setFormData({ ...formData, batteryOptions: newOptions })
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
        toast.success(t('imageUploadSuccess'))
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(t('imageUploadFailed'))
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
              <h1 className="text-3xl font-bold text-white">{t('addNewProduct')}</h1>
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
                    {t('productNameVi')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={t('exampleYamahaPas')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🇯🇵 {t('productNameJa')}
                  </label>
                  <input
                    type="text"
                    value={formData.nameJa}
                    onChange={(e) => setFormData({ ...formData, nameJa: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="例: ヤマハPAS電動アシスト自転車"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🇬🇧 {t('productNameEn')}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="E.g: Yamaha PAS Electric Bicycle"
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
                    placeholder="Product description in English..."
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🇯🇵 {t('descriptionJa')}
                  </label>
                  <textarea
                    value={formData.description.ja}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description, ja: e.target.value }
                    })}
                    rows={3}
                    placeholder="商品説明を日本語で入力..."
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
                    placeholder={t('exampleBatteryType')}
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
                    placeholder={t('exampleMotorPower')}
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
                    placeholder={t('exampleFrameSize')}
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

            {/* Battery Options - Only for electric bikes */}
            {formData.category === 'electric' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">🔋 Loại Pin & Giá</h2>
                    <p className="text-gray-400 text-sm mt-1">Thêm các loại pin với mức giá khác nhau (giống chọn size quần áo)</p>
                  </div>
                  <button
                    type="button"
                    onClick={addBatteryOption}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    + Thêm loại pin
                  </button>
                </div>

                {formData.batteryOptions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                    <p className="text-gray-400 mb-2">Chưa có loại pin nào</p>
                    <p className="text-gray-500 text-sm">Bấm "Thêm loại pin" để thêm các tùy chọn pin với giá khác nhau</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.batteryOptions.map((option, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white font-medium">Loại pin #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeBatteryOption(index)}
                            className="p-1 text-red-400 hover:bg-gray-600 rounded"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Loại pin *
                            </label>
                            <select
                              value={option.type}
                              onChange={(e) => updateBatteryOption(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              required
                            >
                              <option value="lithium_basic">Lithium Basic (36V 10Ah)</option>
                              <option value="lithium_standard">Lithium Standard (48V 12Ah)</option>
                              <option value="lithium_premium">Lithium Premium (48V 20Ah)</option>
                              <option value="lead_acid">Lead Acid (Ắc quy chì)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Tên loại pin *
                            </label>
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) => updateBatteryOption(index, 'name', e.target.value)}
                              placeholder="VD: Pin Lithium 36V 10Ah"
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Dung lượng
                            </label>
                            <input
                              type="text"
                              value={option.capacity}
                              onChange={(e) => updateBatteryOption(index, 'capacity', e.target.value)}
                              placeholder="VD: 36V 10Ah"
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Quãng đường (km)
                            </label>
                            <input
                              type="number"
                              value={option.range || ''}
                              onChange={(e) => updateBatteryOption(index, 'range', Number(e.target.value))}
                              placeholder="VD: 50"
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Chênh lệch giá (¥) *
                            </label>
                            <input
                              type="number"
                              value={option.priceAdjustment}
                              onChange={(e) => updateBatteryOption(index, 'priceAdjustment', Number(e.target.value))}
                              placeholder="VD: 5000 hoặc -3000"
                              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              0 = giá gốc, +5000 = thêm ¥5,000, -3000 = giảm ¥3,000
                            </p>
                          </div>

                          <div className="flex items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={option.inStock}
                                onChange={(e) => updateBatteryOption(index, 'inStock', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-300">Còn hàng</span>
                            </label>
                          </div>
                        </div>

                        {/* Price preview */}
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <p className="text-sm text-gray-400">
                            Giá hiển thị: <span className="text-green-400 font-medium">
                              ¥{((Number(formData.price) || 0) + option.priceAdjustment).toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Lowest price info */}
                    {formData.batteryOptions.length > 0 && formData.price && (
                      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-blue-300 text-sm">
                          💡 <strong>Giá hiển thị trên trang sản phẩm:</strong> ¥
                          {Math.min(
                            ...formData.batteryOptions.map(opt => (Number(formData.price) || 0) + opt.priceAdjustment)
                          ).toLocaleString()}
                          {' '}(giá thấp nhất trong các loại pin)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

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
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('productImages')}
                  </label>
                  <p className="text-gray-400 text-xs mb-3">{t('uploadOrEnterUrl')}</p>
                  
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
                            <span className="text-gray-400 text-xs">{t('uploadImage')}</span>
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
                      + {t('addImageSlot')}
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('orEnterImageUrl')}
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
              <h2 className="text-xl font-bold text-white mb-6">{t('replacedParts')}</h2>
              
              {formData.replacedParts.map((part, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={part}
                    onChange={(e) => updatePart(index, e.target.value)}
                    placeholder={t('partPlaceholder')}
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
                {loading ? t('saving') : t('saveProduct')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

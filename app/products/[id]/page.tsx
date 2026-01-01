'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Shield, Truck, CheckCircle, Battery, Gauge, Heart, Share2, Star, Zap, Award, MapPin, Clock, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { productsAPI } from '@/lib/api'
import { useCartStore, useCurrencyStore, useLanguageStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/ChatWidget'
import toast from 'react-hot-toast'

// Get translations for product detail page
const getProductDetailText = (language: string) => {
  const texts: Record<string, Record<string, string>> = {
    home: { vi: 'Trang chủ', ja: 'ホーム', en: 'Home' },
    products: { vi: 'Sản phẩm', ja: '製品', en: 'Products' },
    notFound: { vi: 'Không tìm thấy sản phẩm', ja: '製品が見つかりません', en: 'Product not found' },
    backToProducts: { vi: 'Quay lại danh sách sản phẩm', ja: '製品一覧に戻る', en: 'Back to products' },
    new100: { vi: '✨ Mới 100%', ja: '✨ 新品100%', en: '✨ 100% New' },
    featured: { vi: '⭐ Nổi bật', ja: '⭐ おすすめ', en: '⭐ Featured' },
    copied: { vi: 'Đã sao chép liên kết', ja: 'リンクをコピーしました', en: 'Link copied' },
    conditionNew: { vi: '✨ Mới', ja: '✨ 新品', en: '✨ New' },
    conditionUsed: { vi: '🔄 Đã qua sử dụng', ja: '🔄 中古', en: '🔄 Used' },
    vehicleCondition: { vi: '🚲 Tình trạng xe', ja: '🚲 車両状態', en: '🚲 Vehicle Condition' },
    usedVehicle: { vi: 'Xe đã qua sử dụng', ja: '中古車', en: 'Used Vehicle' },
    newVehicle: { vi: 'Xe mới 100%', ja: '新車100%', en: '100% New Vehicle' },
    bestPrice: { vi: 'Giá tốt nhất', ja: '最安値', en: 'Best price' },
    sealedNew: { vi: 'Nguyên seal, chưa qua sử dụng', ja: '未開封、未使用', en: 'Sealed, never used' },
    default: { vi: 'Mặc định', ja: 'デフォルト', en: 'Default' },
    premium: { vi: 'Premium', ja: 'プレミアム', en: 'Premium' },
    selectBattery: { vi: 'Chọn loại Pin', ja: 'バッテリータイプを選択', en: 'Select Battery Type' },
    outOfStock: { vi: 'Hết hàng', ja: '在庫切れ', en: 'Out of stock' },
    canTravel: { vi: 'Đi được', ja: '走行可能', en: 'Can travel' },
    price: { vi: 'Giá bán', ja: '価格', en: 'Price' },
    originalPrice: { vi: 'Giá gốc', ja: '元価格', en: 'Original price' },
    freeShip: { vi: 'Freeship 20km', ja: '20km無料配送', en: 'Free shipping 20km' },
    specifications: { vi: 'Thông số kỹ thuật', ja: '仕様', en: 'Specifications' },
    batteryType: { vi: 'Loại pin', ja: 'バッテリータイプ', en: 'Battery type' },
    range: { vi: 'Quãng đường', ja: '走行距離', en: 'Range' },
    motor: { vi: 'Động cơ', ja: 'モーター', en: 'Motor' },
    weight: { vi: 'Trọng lượng', ja: '重量', en: 'Weight' },
    replacedParts: { vi: 'Bộ phận đã thay mới', ja: '交換済み部品', en: 'Replaced Parts' },
    warrantyService: { vi: 'Bảo hành & Dịch vụ', ja: '保証とサービス', en: 'Warranty & Service' },
    batteryMotorWarranty: { vi: 'Bảo hành Pin & Động cơ', ja: 'バッテリー＆モーター保証', en: 'Battery & Motor Warranty' },
    monthsWarranty: { vi: 'tháng chính hãng', ja: 'ヶ月保証', en: 'months warranty' },
    repairDiscount: { vi: 'Giảm giá sửa chữa', ja: '修理割引', en: 'Repair Discount' },
    repairDiscountDesc: { vi: 'phí sửa chữa trọn đời', ja: '生涯修理費用', en: 'lifetime repair cost' },
    freeDelivery: { vi: 'Giao hàng miễn phí', ja: '無料配送', en: 'Free Delivery' },
    freeDeliveryDesc: { vi: 'Miễn phí giao hàng trong bán kính 20km', ja: '半径20km以内無料配送', en: 'Free delivery within 20km radius' },
    addToCart: { vi: 'Thêm vào giỏ', ja: 'カートに追加', en: 'Add to Cart' },
    buyNow: { vi: '🛒 Mua ngay', ja: '🛒 今すぐ購入', en: '🛒 Buy Now' },
    soldOut: { vi: 'Sản phẩm đã bán hết', ja: '売り切れ', en: 'Product sold out' },
    reserved: { vi: 'Sản phẩm đã được đặt trước', ja: '予約済み', en: 'Product reserved' },
    officialWarranty: { vi: 'Bảo hành chính hãng', ja: '正規保証', en: 'Official warranty' },
    fastDelivery: { vi: 'Giao hàng nhanh', ja: '迅速配送', en: 'Fast delivery' },
    addedToCart: { vi: 'Đã thêm vào giỏ hàng', ja: 'カートに追加しました', en: 'Added to cart' },
  }
  return (key: string) => texts[key]?.[language] || texts[key]?.vi || key
}

// Battery type options with display names
const getBatteryOptions = (language: string) => ({
  lithium_basic: { 
    name: language === 'ja' ? 'リチウム電池 ベーシック' : language === 'en' ? 'Basic Lithium' : 'Pin Lithium cơ bản', 
    description: '36V 10Ah' 
  },
  lithium_standard: { 
    name: language === 'ja' ? 'リチウム電池 スタンダード' : language === 'en' ? 'Standard Lithium' : 'Pin Lithium tiêu chuẩn', 
    description: '48V 12Ah' 
  },
  lithium_premium: { 
    name: language === 'ja' ? 'リチウム電池 プレミアム' : language === 'en' ? 'Premium Lithium' : 'Pin Lithium cao cấp', 
    description: '48V 20Ah' 
  },
  lead_acid: { 
    name: language === 'ja' ? '鉛蓄電池' : language === 'en' ? 'Lead Acid' : 'Ắc quy chì', 
    description: language === 'ja' ? '低価格・重い' : language === 'en' ? 'Affordable - Heavier' : 'Giá rẻ - Nặng hơn' 
  }
})

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)
  
  // Selected options state
  const [selectedBattery, setSelectedBattery] = useState<string>('lithium_basic')
  const [selectedCondition, setSelectedCondition] = useState<string>('used')
  
  const { addItem } = useCartStore()
  const { currency } = useCurrencyStore()
  const { language } = useLanguageStore()
  const getText = getProductDetailText(language)
  const BATTERY_OPTIONS = getBatteryOptions(language)
  
  // Get product name based on language
  const getProductName = () => {
    if (language === 'ja' && product?.nameJa) return product.nameJa
    if (language === 'en' && product?.nameEn) return product.nameEn
    return product?.name || ''
  }
  
  // Calculate price adjustments
  const getBatteryPriceAdjustment = () => {
    if (!product?.batteryOptions?.length) return 0
    const option = product.batteryOptions.find((opt: any) => opt.type === selectedBattery)
    return option?.priceAdjustment || 0
  }
  
  const getConditionPriceAdjustment = () => {
    if (!product?.conditionPricing) return 0
    if (selectedCondition === 'new' && product.conditionPricing.newConditionAvailable) {
      return (product.conditionPricing.newConditionPrice || 0) - (product.conditionPricing.usedConditionPrice || product.price)
    }
    return 0
  }
  
  const calculateFinalPrice = () => {
    const basePrice = product?.price || 0
    return basePrice + getBatteryPriceAdjustment() + getConditionPriceAdjustment()
  }

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(params.id as string)
      setProduct(response.data.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error(getText('notFound'))
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1, {
        selectedBattery,
        selectedCondition,
        batteryPriceAdjustment: getBatteryPriceAdjustment(),
        conditionPriceAdjustment: getConditionPriceAdjustment()
      })
      toast.success(getText('addedToCart'))
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addItem(product, 1, {
        selectedBattery,
        selectedCondition,
        batteryPriceAdjustment: getBatteryPriceAdjustment(),
        conditionPriceAdjustment: getConditionPriceAdjustment()
      })
      router.push('/cart')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{getText('notFound')}</h1>
            <button
              onClick={() => router.push('/products')}
              className="text-primary-600 hover:text-primary-700"
            >
              {getText('backToProducts')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors">{getText('home')}</button>
          <span>/</span>
          <button onClick={() => router.push('/products')} className="hover:text-blue-600 transition-colors">{getText('products')}</button>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{getProductName()}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div 
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden mb-4 shadow-2xl group cursor-zoom-in"
              onClick={() => setImageZoom(!imageZoom)}
            >
              <AnimatePresence mode="wait">
                {!showVideo ? (
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: imageZoom ? 1.3 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                    alt={product.name}
                    className="w-full h-[350px] sm:h-[450px] lg:h-[550px] object-contain bg-white"
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] bg-black"
                  >
                    <iframe
                      className="w-full h-full"
                      src={product.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                      title="Product Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Navigation Arrows */}
              {!showVideo && product.images?.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1) }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0) }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.condition === 'new' && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold shadow-lg">
                    {getText('new100')}
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                    {getText('featured')}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted) }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); toast.success(getText('copied')) }}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* Video Thumbnail */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVideo(true)}
                className={`relative flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden group ${
                  showVideo ? 'ring-3 ring-blue-500 ring-offset-2' : ''
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[10px] py-1 text-center font-medium">
                  Video
                </div>
              </motion.button>
              
              {/* Image Thumbnails */}
              {product.images?.map((image: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedImage(index); setShowVideo(false) }}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                    selectedImage === index && !showVideo ? 'ring-3 ring-blue-500 ring-offset-2' : 'ring-1 ring-gray-200'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:sticky lg:top-8"
          >
            {/* Brand & Condition Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-md">
                {product.brand}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                product.condition === 'new' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-orange-400 to-amber-500 text-white'
              }`}>
                {product.condition === 'new' ? getText('conditionNew') : getText('conditionUsed')}
              </span>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>{product.conditionPercentage}%</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">{getProductName()}</h1>

            {/* Condition Selection */}
            {product.conditionPricing && (product.conditionPricing.newConditionAvailable || product.conditionPricing.usedConditionAvailable) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white rounded-2xl p-6 mb-4 shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {getText('vehicleCondition')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.conditionPricing.usedConditionAvailable && (
                    <button
                      onClick={() => setSelectedCondition('used')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedCondition === 'used'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{getText('usedVehicle')}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {getText('default')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{getText('bestPrice')}</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        {formatCurrency(product.conditionPricing.usedConditionPrice || product.price, currency)}
                      </p>
                    </button>
                  )}
                  {product.conditionPricing.newConditionAvailable && (
                    <button
                      onClick={() => setSelectedCondition('new')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedCondition === 'new'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{getText('newVehicle')}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          {getText('premium')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{getText('sealedNew')}</p>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        {formatCurrency(product.conditionPricing.newConditionPrice, currency)}
                      </p>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Battery Options */}
            {product.batteryOptions && product.batteryOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                className="bg-white rounded-2xl p-6 mb-4 shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Battery className="w-5 h-5 text-green-600" />
                  {getText('selectBattery')}
                </h3>
                <div className="space-y-3">
                  {product.batteryOptions.map((option: any) => (
                    <button
                      key={option.type}
                      onClick={() => option.inStock && setSelectedBattery(option.type)}
                      disabled={!option.inStock}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedBattery === option.type
                          ? 'border-green-500 bg-green-50'
                          : option.inStock 
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {BATTERY_OPTIONS[option.type as keyof typeof BATTERY_OPTIONS]?.name || option.name}
                            </span>
                            {!option.inStock && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{getText('outOfStock')}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {option.capacity} • {getText('canTravel')} {option.range}km
                          </p>
                        </div>
                        <div className="text-right">
                          {option.priceAdjustment > 0 ? (
                            <span className="text-green-600 font-semibold">
                              +{formatCurrency(option.priceAdjustment, currency)}
                            </span>
                          ) : option.priceAdjustment < 0 ? (
                            <span className="text-orange-600 font-semibold">
                              {formatCurrency(option.priceAdjustment, currency)}
                            </span>
                          ) : (
                            <span className="text-gray-500 font-medium">{getText('default')}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Price Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100"
            >
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{getText('price')}</p>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {formatCurrency(calculateFinalPrice(), currency)}
                  </span>
                  {(getBatteryPriceAdjustment() !== 0 || getConditionPriceAdjustment() !== 0) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {getText('originalPrice')}: <span className="line-through">{formatCurrency(product.price, currency)}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <Truck className="w-4 h-4" />
                    {getText('freeShip')}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                {getText('specifications')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {product.specifications?.batteryType && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Battery className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{getText('batteryType')}</div>
                      <div className="font-semibold text-sm">{product.specifications.batteryType}</div>
                    </div>
                  </div>
                )}
                {product.specifications?.rangeKm && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{getText('range')}</div>
                      <div className="font-semibold text-sm">{product.specifications.rangeKm} km</div>
                    </div>
                  </div>
                )}
                {product.specifications?.motorPower && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{getText('motor')}</div>
                      <div className="font-semibold text-sm">{product.specifications.motorPower}</div>
                    </div>
                  </div>
                )}
                {product.specifications?.weight && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">⚖️</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{getText('weight')}</div>
                      <div className="font-semibold text-sm">{product.specifications.weight} kg</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Replaced Parts */}
            {product.replacedParts?.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  {getText('replacedParts')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.replacedParts.map((part: string, index: number) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 bg-white text-green-700 rounded-full text-sm font-medium border border-green-200 shadow-sm"
                    >
                      ✓ {part}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty & Services */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                {getText('warrantyService')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{getText('batteryMotorWarranty')}</div>
                    <div className="text-sm text-gray-600">{product.warranty?.battery || 3} {getText('monthsWarranty')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{getText('repairDiscount')}</div>
                    <div className="text-sm text-gray-600">
                      -{product.warranty?.discountPercent || 10}% {getText('repairDiscountDesc')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{getText('freeDelivery')}</div>
                    <div className="text-sm text-gray-600">{getText('freeDeliveryDesc')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.status !== 'active'}
                  className="flex-1 px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getText('addToCart')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={product.status !== 'active'}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                >
                  {getText('buyNow')}
                </motion.button>
              </div>

              {product.status !== 'active' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                >
                  <p className="text-red-700 text-center font-semibold flex items-center justify-center gap-2">
                    ⚠️ {product.status === 'sold' ? getText('soldOut') : getText('reserved')}
                  </p>
                </motion.div>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>{getText('officialWarranty')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Truck className="w-4 h-4" />
                  <span>{getText('fastDelivery')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  )
}

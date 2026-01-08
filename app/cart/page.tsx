'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag, Tag, Battery, Bike } from 'lucide-react'
import { useCartStore, useCurrencyStore, useLanguageStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { couponsAPI } from '@/lib/api'

// Cart page translations
const getCartText = (language: string) => {
  const texts: Record<string, Record<string, string>> = {
    emptyCart: { vi: 'Giỏ hàng trống', ja: 'カートは空です', en: 'Cart is empty' },
    addProductsToStart: { vi: 'Thêm sản phẩm để bắt đầu mua sắm', ja: '製品を追加してお買い物を始めましょう', en: 'Add products to start shopping' },
    viewProducts: { vi: 'Xem sản phẩm', ja: '製品を見る', en: 'View Products' },
    cart: { vi: 'Giỏ hàng', ja: 'カート', en: 'Cart' },
    new: { vi: 'Mới', ja: '新品', en: 'New' },
    used: { vi: 'Đã qua sử dụng', ja: '中古', en: 'Used' },
    newVehicle: { vi: 'Xe mới', ja: '新車', en: 'New Vehicle' },
    usedVehicle: { vi: 'Xe cũ', ja: '中古車', en: 'Used Vehicle' },
    lithiumBasic: { vi: 'Pin Lithium cơ bản', ja: 'リチウム電池 ベーシック', en: 'Basic Lithium' },
    lithiumStandard: { vi: 'Pin Lithium tiêu chuẩn', ja: 'リチウム電池 スタンダード', en: 'Standard Lithium' },
    lithiumPremium: { vi: 'Pin Lithium cao cấp', ja: 'リチウム電池 プレミアム', en: 'Premium Lithium' },
    leadAcid: { vi: 'Ắc quy chì', ja: '鉛蓄電池', en: 'Lead Acid' },
    orderSummary: { vi: 'Tổng đơn hàng', ja: '注文概要', en: 'Order Summary' },
    couponCode: { vi: 'Mã khuyến mãi', ja: 'クーポンコード', en: 'Coupon Code' },
    enterCoupon: { vi: 'Nhập mã khuyến mãi', ja: 'クーポンコードを入力', en: 'Enter coupon code' },
    cancel: { vi: 'Hủy', ja: 'キャンセル', en: 'Cancel' },
    apply: { vi: 'Áp dụng', ja: '適用', en: 'Apply' },
    checking: { vi: 'Đang kiểm tra...', ja: '確認中...', en: 'Checking...' },
    subtotal: { vi: 'Tạm tính', ja: '小計', en: 'Subtotal' },
    discount: { vi: 'Giảm giá', ja: '割引', en: 'Discount' },
    shippingFee: { vi: 'Phí vận chuyển', ja: '送料', en: 'Shipping Fee' },
    free: { vi: 'Miễn phí', ja: '無料', en: 'Free' },
    total: { vi: 'Tổng cộng', ja: '合計', en: 'Total' },
    proceedToCheckout: { vi: 'Tiến hành thanh toán', ja: 'お支払いへ進む', en: 'Proceed to Checkout' },
    continueShopping: { vi: 'Tiếp tục mua sắm', ja: 'お買い物を続ける', en: 'Continue Shopping' },
    couponApplied: { vi: 'Áp dụng mã khuyến mãi thành công!', ja: 'クーポンが適用されました！', en: 'Coupon applied successfully!' },
    couponInvalid: { vi: 'Mã khuyến mãi không hợp lệ', ja: '無効なクーポンコード', en: 'Invalid coupon code' },
    couponCanceled: { vi: 'Đã hủy mã khuyến mãi', ja: 'クーポンがキャンセルされました', en: 'Coupon canceled' },
  }
  return (key: string) => texts[key]?.[language] || texts[key]?.vi || key
}
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const { currency } = useCurrencyStore()
  const { language } = useLanguageStore()
  const getText = getCartText(language)
  
  // Get product name based on language
  const getProductName = (product: any) => {
    if (language === 'ja' && product?.nameJa) return product.nameJa
    if (language === 'en' && product?.nameEn) return product.nameEn
    return product?.name || ''
  }
  
  // Get battery name based on language
  const getBatteryName = (batteryType: string) => {
    const names: Record<string, string> = {
      lithium_basic: getText('lithiumBasic'),
      lithium_standard: getText('lithiumStandard'),
      lithium_premium: getText('lithiumPremium'),
      lead_acid: getText('leadAcid')
    }
    return names[batteryType] || batteryType
  }
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    
    try {
      setCouponLoading(true)
      const categories = items.map(item => item.product.category)
      const response = await couponsAPI.validate({
        code: couponCode,
        orderAmount: getTotalPrice(),
        categories
      })
      
      setAppliedCoupon(response.data.data)
      toast.success(getText('couponApplied'))
    } catch (error: any) {
      toast.error(error.response?.data?.message || getText('couponInvalid'))
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const getFinalTotal = () => {
    const total = getTotalPrice()
    const discount = appliedCoupon?.discount || 0
    return Math.max(0, total - discount)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{getText('emptyCart')}</h2>
            <p className="text-gray-600 mb-8">{getText('addProductsToStart')}</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {getText('viewProducts')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{getText('cart')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <Link
                          href={`/products/${item.product._id}`}
                          className="text-lg font-bold text-gray-900 hover:text-primary-600"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.product.brand} • {item.product.condition === 'new' ? getText('new') : getText('used')}
                        </div>
                        {/* Selected Options */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.selectedCondition && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              <Bike className="w-3 h-3" />
                              {item.selectedCondition === 'new' ? getText('newVehicle') : getText('usedVehicle')}
                              {item.conditionPriceAdjustment !== 0 && (
                                <span className="text-blue-600">
                                  ({item.conditionPriceAdjustment! > 0 ? '+' : ''}{formatCurrency(item.conditionPriceAdjustment || 0)})
                                </span>
                              )}
                            </span>
                          )}
                          {item.selectedBattery && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              <Battery className="w-3 h-3" />
                              {getBatteryName(item.selectedBattery)}
                              {item.batteryPriceAdjustment !== 0 && (
                                <span className="text-green-600">
                                  ({item.batteryPriceAdjustment! > 0 ? '+' : ''}{formatCurrency(item.batteryPriceAdjustment || 0)})
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <div className="text-2xl font-bold text-primary-600">
                          {formatCurrency(item.product.price + (item.batteryPriceAdjustment || 0) + (item.conditionPriceAdjustment || 0))}
                        </div>
                        {((item.batteryPriceAdjustment || 0) !== 0 || (item.conditionPriceAdjustment || 0) !== 0) && (
                          <div className="text-xs text-gray-400 line-through">
                            {formatCurrency(item.product.price)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{getText('orderSummary')}</h2>

              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('couponCode')}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={getText('enterCoupon')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                      disabled={!!appliedCoupon}
                    />
                  </div>
                  {appliedCoupon ? (
                    <button
                      onClick={() => {
                        setAppliedCoupon(null)
                        setCouponCode('')
                        toast.success(getText('couponCanceled'))
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      {getText('cancel')}
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || couponLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? getText('checking') : getText('apply')}
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ {appliedCoupon.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{getText('subtotal')}</span>
                  <span className="font-semibold">{formatCurrency(getTotalPrice(), currency)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">{getText('discount')}</span>
                    <span className="font-semibold">-{formatCurrency(appliedCoupon.discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{getText('shippingFee')}</span>
                  <span className="font-semibold text-green-600">{getText('free')}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">{getText('total')}</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(getFinalTotal(), currency)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  // Pass coupon data to checkout via URL params
                  if (appliedCoupon) {
                    const params = new URLSearchParams({
                      couponCode: appliedCoupon.code,
                      couponDiscount: appliedCoupon.discount.toString(),
                      couponDescription: appliedCoupon.description || ''
                    })
                    router.push(`/checkout?${params.toString()}`)
                  } else {
                    router.push('/checkout')
                  }
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-3"
              >
                {getText('proceedToCheckout')}
              </button>

              <Link
                href="/products"
                className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-50 transition-colors"
              >
                {getText('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

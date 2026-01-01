'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { CheckCircle, QrCode, Copy, Check, Clock, Calendar, CreditCard, Truck, Gift, Crown, Printer, MapPin, Store, Package } from 'lucide-react'
import { useCartStore, useLanguageStore } from '@/lib/store'
import { ordersAPI, customersAPI, invoiceAPI, shippingAPI } from '@/lib/api'

// Checkout page translations
const getCheckoutText = (language: string) => {
  const texts: Record<string, Record<string, string>> = {
    checkout: { vi: 'Thanh toán', ja: 'お支払い', en: 'Checkout' },
    customerInfo: { vi: 'Thông tin khách hàng', ja: 'お客様情報', en: 'Customer Information' },
    fullName: { vi: 'Họ và tên', ja: '氏名', en: 'Full Name' },
    email: { vi: 'Email', ja: 'メール', en: 'Email' },
    phone: { vi: 'Số điện thoại', ja: '電話番号', en: 'Phone Number' },
    address: { vi: 'Địa chỉ', ja: '住所', en: 'Address' },
    city: { vi: 'Thành phố', ja: '市区町村', en: 'City' },
    prefecture: { vi: 'Tỉnh/Thành', ja: '都道府県', en: 'Prefecture' },
    postalCode: { vi: 'Mã bưu điện', ja: '郵便番号', en: 'Postal Code' },
    shippingMethod: { vi: 'Phương thức giao hàng', ja: '配送方法', en: 'Shipping Method' },
    paymentMethod: { vi: 'Phương thức thanh toán', ja: '支払方法', en: 'Payment Method' },
    cod: { vi: 'Thanh toán khi nhận hàng', ja: '代金引換', en: 'Cash on Delivery' },
    bankTransfer: { vi: 'Chuyển khoản ngân hàng', ja: '銀行振込', en: 'Bank Transfer' },
    creditCard: { vi: 'Thẻ tín dụng', ja: 'クレジットカード', en: 'Credit Card' },
    deliveryTime: { vi: 'Thời gian giao hàng', ja: '配達時間', en: 'Delivery Time' },
    preferredDate: { vi: 'Ngày giao hàng mong muốn', ja: '希望配達日', en: 'Preferred Delivery Date' },
    notes: { vi: 'Ghi chú', ja: '備考', en: 'Notes' },
    orderSummary: { vi: 'Tóm tắt đơn hàng', ja: '注文概要', en: 'Order Summary' },
    subtotal: { vi: 'Tạm tính', ja: '小計', en: 'Subtotal' },
    shippingFee: { vi: 'Phí vận chuyển', ja: '送料', en: 'Shipping Fee' },
    codFee: { vi: 'Phí COD', ja: '代引き手数料', en: 'COD Fee' },
    discount: { vi: 'Giảm giá', ja: '割引', en: 'Discount' },
    total: { vi: 'Tổng cộng', ja: '合計', en: 'Total' },
    placeOrder: { vi: 'Đặt hàng', ja: '注文する', en: 'Place Order' },
    processing: { vi: 'Đang xử lý...', ja: '処理中...', en: 'Processing...' },
    orderSuccess: { vi: 'Đặt hàng thành công!', ja: 'ご注文ありがとうございます！', en: 'Order Successful!' },
    orderNumber: { vi: 'Mã đơn hàng', ja: '注文番号', en: 'Order Number' },
    thankYou: { vi: 'Cảm ơn bạn đã mua hàng', ja: 'お買い上げありがとうございます', en: 'Thank you for your purchase' },
    backToHome: { vi: 'Về trang chủ', ja: 'ホームへ戻る', en: 'Back to Home' },
    printInvoice: { vi: 'In hóa đơn', ja: '請求書を印刷', en: 'Print Invoice' },
    required: { vi: 'Bắt buộc', ja: '必須', en: 'Required' },
    invalidEmail: { vi: 'Email không hợp lệ', ja: '無効なメール', en: 'Invalid email' },
    morning: { vi: 'Buổi sáng (8h - 12h)', ja: '午前 (8時-12時)', en: 'Morning (8am - 12pm)' },
    afternoon: { vi: 'Buổi chiều (13h - 17h)', ja: '午後 (13時-17時)', en: 'Afternoon (1pm - 5pm)' },
    evening: { vi: 'Buổi tối (18h - 21h)', ja: '夜間 (18時-21時)', en: 'Evening (6pm - 9pm)' },
    anytime: { vi: 'Bất kỳ lúc nào', ja: 'いつでも', en: 'Anytime' },
    loyaltyDiscount: { vi: 'Giảm giá thành viên', ja: '会員割引', en: 'Loyalty Discount' },
    newCustomer: { vi: 'Khách hàng mới', ja: '新規顧客', en: 'New Customer' },
    free: { vi: 'Miễn phí', ja: '無料', en: 'Free' },
    pickup: { vi: 'Tự đến lấy tại cửa hàng', ja: '店舗受取', en: 'Store Pickup' },
    freeDelivery: { vi: 'Miễn phí ship (trong 20km)', ja: '無料配送 (20km以内)', en: 'Free Delivery (within 20km)' },
  }
  return (key: string) => texts[key]?.[language] || texts[key]?.vi || key
}
import { getAffiliateRef } from '@/components/AffiliateTracker'
import { formatCurrency } from '@/lib/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

// Bank account info for QR code (Japan)
const BANK_INFO = {
  bankName: 'Japan Post Bank',
  accountNumber: '12345678',
  accountName: 'HBIKE JAPAN',
  bankCode: '9900'
}

// COD fee (500 yen)
const COD_FEE = 500

// Store address
const STORE_ADDRESS = '〒651-0077 神戸市中央区日暮通2-4-18-1F'

// Shipping options - IDs must match backend Order model enum
const SHIPPING_OPTIONS = [
  { id: 'pickup', name: '店舗受取', nameVi: 'Tự đến lấy tại cửa hàng', fee: 0, icon: Store, description: STORE_ADDRESS },
  { id: 'free_delivery', name: '無料配送 (20km以内)', nameVi: 'Miễn phí ship (trong 20km)', fee: 0, icon: Truck, description: '1-2日以内にお届け' },
  { id: 'zone_1', name: '配送 (20-50km)', nameVi: 'Ship 20-50km', fee: 2500, icon: Truck, description: '2-3日以内にお届け' },
  { id: 'zone_2', name: '配送 (50-100km)', nameVi: 'Ship 50-100km', fee: 5000, icon: Truck, description: '3-4日以内にお届け' },
  { id: 'postal', name: '郵便配送 (100km以上)', nameVi: 'Gửi bưu điện (trên 100km)', fee: 5500, icon: Package, description: '5-7日程度' }
]

// Company bank card info for Visa/card payment
const COMPANY_CARD_INFO = {
  bankName: 'SMBC三井住友銀行',
  branchName: '神戸支店',
  accountType: '普通預金',
  accountNumber: '1234567',
  accountHolder: 'HBIKE JAPAN株式会社',
  swiftCode: 'SMBCJPJT',
  note: '振込手数料はお客様ご負担となります'
}

// Time slots for delivery
const TIME_SLOTS = [
  { value: 'morning', label: 'Buổi sáng (8h - 12h)', icon: '🌅' },
  { value: 'afternoon', label: 'Buổi chiều (13h - 17h)', icon: '☀️' },
  { value: 'evening', label: 'Buổi tối (18h - 21h)', icon: '🌙' },
  { value: 'anytime', label: 'Bất kỳ lúc nào', icon: '📦' },
]

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, clearCart, getTotalPrice } = useCartStore()
  const { language } = useLanguageStore()
  const getText = getCheckoutText(language)
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [orderId, setOrderId] = useState('')
  const [copied, setCopied] = useState(false)
  
  // Loyalty discount state
  const [loyaltyDiscount, setLoyaltyDiscount] = useState<{
    isNewCustomer: boolean
    discount: number
    tier: string | null
    tierName: string
    message: string
  } | null>(null)
  const [checkingDiscount, setCheckingDiscount] = useState(false)
  
  // Shipping state
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[1]) // Default to free_delivery
  const [restaurantCoupon, setRestaurantCoupon] = useState<any>(null)
  const [calculatingDistance, setCalculatingDistance] = useState(false)
  const [calculatedDistance, setCalculatedDistance] = useState<{
    distanceKm: number
    fee: number
    method: string
    description: string
  } | null>(null)

  const { register, handleSubmit, formState: { errors }, control, watch } = useForm()
  const paymentMethod = useWatch({ control, name: 'paymentMethod' })
  const watchedEmail = watch('email')
  const watchedPhone = watch('phone')

  // Get partner token from URL or stored affiliate ref
  const urlPartnerToken = searchParams.get('partner') || searchParams.get('ref')
  const [partnerToken, setPartnerToken] = useState<string | null>(null)
  
  // Load affiliate ref on mount
  useEffect(() => {
    const storedRef = getAffiliateRef()
    setPartnerToken(urlPartnerToken || storedRef)
  }, [urlPartnerToken])
  
  // Check for returning customer discount
  const checkCustomerDiscount = useCallback(async (email?: string, phone?: string) => {
    if (!email && !phone) return
    
    setCheckingDiscount(true)
    try {
      const response = await customersAPI.checkDiscount({ email, phone })
      setLoyaltyDiscount(response.data.data)
    } catch (error) {
      console.error('Error checking discount:', error)
    } finally {
      setCheckingDiscount(false)
    }
  }, [])

  // Calculate shipping distance from postal code
  const calculateShippingDistance = useCallback(async (postalCode: string) => {
    if (!postalCode || postalCode.length < 3) return
    
    setCalculatingDistance(true)
    try {
      const response = await shippingAPI.calculate({ postalCode })
      const data = response.data.data
      setCalculatedDistance({
        distanceKm: data.estimatedDistance || data.distanceKm || 0,
        fee: data.fee,
        method: data.method,
        description: data.description
      })
      
      // Auto-select the appropriate shipping option
      const matchingOption = SHIPPING_OPTIONS.find(opt => opt.id === data.method)
      if (matchingOption) {
        setSelectedShipping(matchingOption)
        toast.success(`配送料を計算しました: ${data.description}`)
      }
    } catch (error) {
      console.error('Error calculating shipping:', error)
      toast.error('配送料の計算に失敗しました')
    } finally {
      setCalculatingDistance(false)
    }
  }, [])

  // Debounce check discount when email/phone changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedEmail || watchedPhone) {
        checkCustomerDiscount(watchedEmail, watchedPhone)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [watchedEmail, watchedPhone, checkCustomerDiscount])

  // Calculate totals
  const subtotal = getTotalPrice()
  const loyaltyDiscountAmount = loyaltyDiscount?.discount ? Math.round(subtotal * (loyaltyDiscount.discount / 100)) : 0
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0
  const shippingFee = selectedShipping.fee
  const totalAmount = subtotal - loyaltyDiscountAmount + codFee + shippingFee

  // Generate order code for bank transfer
  const tempOrderCode = `DH${Date.now().toString().slice(-8)}`
  
  // Generate QR URL for bank transfer
  const generateQRUrl = () => {
    const amount = totalAmount
    const content = `Payment ${tempOrderCode}`
    // Using placeholder QR - in production would use actual Japan bank QR system
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`Bank: ${BANK_INFO.bankName}\nAccount: ${BANK_INFO.accountNumber}\nName: ${BANK_INFO.accountName}\nAmount: ¥${amount}\nRef: ${tempOrderCode}`)}`
  }

  const copyBankInfo = () => {
    const info = `Ngân hàng: ${BANK_INFO.bankName}\nSố tài khoản: ${BANK_INFO.accountNumber}\nChủ tài khoản: ${BANK_INFO.accountName}\nSố tiền: ${formatCurrency(getTotalPrice())}\nNội dung: Thanh toan ${tempOrderCode}`
    navigator.clipboard.writeText(info)
    setCopied(true)
    toast.success('Đã sao chép thông tin chuyển khoản')
    setTimeout(() => setCopied(false), 2000)
  }

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)

      const orderData = {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: {
            street: data.address,
            city: data.city,
            prefecture: data.prefecture,
            postalCode: data.postalCode
          }
        },
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          selectedBattery: item.selectedBattery || 'lithium_basic',
          selectedCondition: item.selectedCondition || 'used'
        })),
        paymentMethod: data.paymentMethod,
        shippingOption: {
          method: selectedShipping.id,
          type: selectedShipping.id,
          fee: selectedShipping.fee,
          description: selectedShipping.name
        },
        deliveryPreference: {
          preferredDate: data.preferredDate || null,
          preferredTimeSlot: data.preferredTimeSlot || 'anytime',
          timeFrom: data.timeFrom || null,
          timeTo: data.timeTo || null,
          specialInstructions: data.deliveryInstructions || null
        },
        notes: data.notes,
        partner: partnerToken
      }

      const response = await ordersAPI.create(orderData)
      setOrderNumber(response.data.data.orderNumber)
      setOrderId(response.data.data._id)
      setRestaurantCoupon(response.data.data.restaurantCoupon)
      setOrderComplete(true)
      clearCart()
      toast.success('ご注文ありがとうございます！')
    } catch (error: any) {
      console.error('Order error:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý đơn hàng')
    } finally {
      setLoading(false)
    }
  }
  
  // Print invoice
  const handlePrintInvoice = () => {
    if (orderId) {
      window.open(invoiceAPI.getInvoiceHtml(orderId), '_blank')
    }
  }

  if (items.length === 0 && !orderComplete) {
    router.push('/cart')
    return null
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ご注文ありがとうございます！</h1>
            <p className="text-lg text-gray-600 mb-6">
              注文番号: <strong>{orderNumber}</strong>
            </p>
            <p className="text-gray-600 mb-4">
              確認メールをお送りしました。
            </p>
            
            {/* Restaurant Coupon Gift */}
            {restaurantCoupon && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
                <div className="text-4xl mb-2">🎁</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">自転車購入特典!</h3>
                <p className="text-gray-600 text-sm mb-3">提携レストランで使えるクーポンをプレゼント</p>
                <div className="bg-white rounded-lg p-4 shadow-inner">
                  <p className="text-2xl font-mono font-bold text-orange-600">{restaurantCoupon.code}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {restaurantCoupon.discount ? `${restaurantCoupon.discount}% OFF` : `¥${restaurantCoupon.discountAmount} OFF`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    有効期限: {new Date(restaurantCoupon.validUntil).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handlePrintInvoice}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                領収書を印刷 / PDF出力
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                ホームに戻る
              </button>
            </div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin khách hàng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      {...register('name', { required: 'Vui lòng nhập họ tên' })}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        {...register('email', {
                          required: 'Vui lòng nhập email',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email không hợp lệ'
                          }
                        })}
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        {...register('phone', { required: 'Vui lòng nhập số điện thoại' })}
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">配送先住所 / Địa chỉ giao hàng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      郵便番号 / Mã bưu điện
                    </label>
                    <div className="flex gap-2">
                      <input
                        {...register('postalCode')}
                        type="text"
                        placeholder="651-0077"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const postalCode = watch('postalCode')
                          if (postalCode) {
                            calculateShippingDistance(postalCode)
                          } else {
                            toast.error('郵便番号を入力してください')
                          }
                        }}
                        disabled={calculatingDistance}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        {calculatingDistance ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            計算中...
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            配送料計算
                          </>
                        )}
                      </button>
                    </div>
                    {calculatedDistance && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>推定距離:</strong> {calculatedDistance.distanceKm.toFixed(1)}km
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>配送料:</strong> {calculatedDistance.fee === 0 ? '無料' : `¥${calculatedDistance.fee.toLocaleString()}`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố *
                      </label>
                      <input
                        {...register('prefecture', { required: 'Vui lòng nhập tỉnh/thành phố' })}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.prefecture && (
                        <p className="text-red-500 text-sm mt-1">{errors.prefecture.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện *
                      </label>
                      <input
                        {...register('city', { required: 'Vui lòng nhập quận/huyện' })}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message as string}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ chi tiết *
                    </label>
                    <input
                      {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message as string}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Method Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-blue-600" />
                  配送方法 / Phương thức giao hàng
                </h2>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((option) => {
                    const Icon = option.icon
                    return (
                      <label 
                        key={option.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedShipping.id === option.id 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedShipping(option)}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={selectedShipping.id === option.id}
                          onChange={() => setSelectedShipping(option)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <Icon className="w-5 h-5 ml-3 text-gray-600" />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{option.name}</span>
                            <span className={`font-semibold ${option.fee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                              {option.fee === 0 ? '無料' : `¥${option.fee.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
                
                {selectedShipping.id === 'pickup' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      <strong>店舗住所:</strong> {STORE_ADDRESS}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      営業時間: 月-土 10:00-19:00
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Time Preference */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  配達希望時間 / Thời gian nhận hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Ngày giao hàng mong muốn
                    </label>
                    <input
                      {...register('preferredDate')}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khung giờ nhận hàng
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_SLOTS.map((slot) => (
                        <label 
                          key={slot.value}
                          className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input
                            {...register('preferredTimeSlot')}
                            type="radio"
                            value={slot.value}
                            defaultChecked={slot.value === 'anytime'}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="ml-2 text-sm">
                            <span className="mr-1">{slot.icon}</span>
                            {slot.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Từ giờ (tùy chọn)
                      </label>
                      <input
                        {...register('timeFrom')}
                        type="time"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đến giờ (tùy chọn)
                      </label>
                      <input
                        {...register('timeTo')}
                        type="time"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú giao hàng
                    </label>
                    <input
                      {...register('deliveryInstructions')}
                      type="text"
                      placeholder="VD: Gọi trước 30 phút, để ở bảo vệ..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      {...register('paymentMethod', { required: 'Vui lòng chọn phương thức thanh toán' })}
                      type="radio"
                      value="bank_transfer"
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Chuyển khoản ngân hàng</span>
                        <span className="text-green-600 text-sm font-medium">Miễn phí</span>
                      </div>
                      <p className="text-sm text-gray-500">Quét mã QR để thanh toán nhanh chóng</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      {...register('paymentMethod', { required: 'Vui lòng chọn phương thức thanh toán' })}
                      type="radio"
                      value="visa_card"
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2">
                          Thẻ Visa/Mastercard
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">VNPAY</span>
                        </span>
                        <span className="text-green-600 text-sm font-medium">Miễn phí</span>
                      </div>
                      <p className="text-sm text-gray-500">Thanh toán qua cổng VNPAY - An toàn & Bảo mật</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                    <input
                      {...register('paymentMethod', { required: 'Vui lòng chọn phương thức thanh toán' })}
                      type="radio"
                      value="cod"
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                        <span className="text-orange-600 text-sm font-medium">+{formatCurrency(COD_FEE)}</span>
                      </div>
                      <p className="text-sm text-gray-500">Thanh toán tiền mặt khi nhận hàng - Có phí COD</p>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2">{errors.paymentMethod.message as string}</p>
                )}

                {/* Visa/Card Payment Info */}
                {paymentMethod === 'visa_card' && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">会社口座情報 / Thông tin tài khoản công ty</h3>
                    </div>
                    
                    <div className="bg-white rounded-lg p-5 shadow-sm space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">銀行名 / Ngân hàng</p>
                          <p className="font-semibold text-gray-900">{COMPANY_CARD_INFO.bankName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">支店名 / Chi nhánh</p>
                          <p className="font-semibold text-gray-900">{COMPANY_CARD_INFO.branchName}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">口座種別 / Loại tài khoản</p>
                          <p className="font-semibold text-gray-900">{COMPANY_CARD_INFO.accountType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">口座番号 / Số tài khoản</p>
                          <p className="font-semibold text-gray-900 font-mono text-lg">{COMPANY_CARD_INFO.accountNumber}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">口座名義 / Chủ tài khoản</p>
                        <p className="font-semibold text-gray-900">{COMPANY_CARD_INFO.accountHolder}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">SWIFT Code</p>
                        <p className="font-semibold text-gray-900 font-mono">{COMPANY_CARD_INFO.swiftCode}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">お振込金額 / Số tiền</p>
                        <p className="font-bold text-2xl text-purple-600">¥{totalAmount.toLocaleString()}</p>
                      </div>
                      
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>注意:</strong> {COMPANY_CARD_INFO.note}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      お振込み確認後、ご注文を処理いたします。
                    </p>
                  </div>
                )}

                {/* QR Code Section for Bank Transfer */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <QrCode className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-gray-900">Thông tin chuyển khoản</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* QR Code */}
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-3 rounded-xl shadow-lg">
                          <img 
                            src={generateQRUrl()} 
                            alt="QR Code chuyển khoản"
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-3 text-center">
                          Quét mã QR bằng app ngân hàng để thanh toán
                        </p>
                      </div>

                      {/* Bank Info */}
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Ngân hàng</p>
                          <p className="font-semibold text-gray-900">{BANK_INFO.bankName}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Số tài khoản</p>
                          <p className="font-semibold text-gray-900 font-mono">{BANK_INFO.accountNumber}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Chủ tài khoản</p>
                          <p className="font-semibold text-gray-900">{BANK_INFO.accountName}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Số tiền</p>
                          <p className="font-bold text-xl text-blue-600">{formatCurrency(getTotalPrice())}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Nội dung chuyển khoản</p>
                          <p className="font-semibold text-gray-900 font-mono">Thanh toan {tempOrderCode}</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={copyBankInfo}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          {copied ? 'Đã sao chép' : 'Sao chép thông tin'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Vui lòng nhập đúng nội dung chuyển khoản để đơn hàng được xử lý nhanh chóng.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ghi chú</h2>
                <textarea
                  {...register('notes')}
                  rows={4}
                  placeholder="Ghi chú về giao hàng hoặc yêu cầu đặc biệt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        <p className="text-sm font-semibold text-primary-600">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Loyalty Discount Badge */}
                {loyaltyDiscount && !loyaltyDiscount.isNewCustomer && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Khách hàng {loyaltyDiscount.tierName}
                        </p>
                        <p className="text-sm text-yellow-600">
                          Bạn được giảm {loyaltyDiscount.discount}% cho đơn hàng này!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {checkingDiscount && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-600 flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Đang kiểm tra ưu đãi khách hàng...
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">小計 / Tạm tính</span>
                    <span className="font-semibold">¥{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {loyaltyDiscountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        会員割引 ({loyaltyDiscount?.discount}%)
                      </span>
                      <span className="font-semibold">-¥{loyaltyDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      配送料 ({selectedShipping.name})
                    </span>
                    <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                      {shippingFee === 0 ? '無料' : `¥${shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  
                  {codFee > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>代引き手数料</span>
                      <span className="font-semibold">+¥{codFee.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">合計 / Tổng cộng</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ¥{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? '処理中...' : '注文を確定する'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Printer, Download, Package, User, MapPin, Phone, Mail, CreditCard, Calendar, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { getAdminText } from '@/lib/i18n/admin'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    if (params.id) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, user, params.id])

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.data)
      } else {
        toast.error('Không tìm thấy đơn hàng')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Không thể tải thông tin đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Không thể mở cửa sổ in. Vui lòng cho phép popup.')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa đơn #${order?.orderNumber || order?._id?.slice(-6).toUpperCase()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; }
          .invoice { max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e74c3c; padding-bottom: 20px; }
          .header h1 { color: #e74c3c; font-size: 28px; margin-bottom: 5px; }
          .header p { color: #666; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .info-box h3 { color: #e74c3c; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
          .info-box p { margin: 5px 0; font-size: 14px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; font-size: 12px; text-transform: uppercase; }
          .items-table td { padding: 12px; border-bottom: 1px solid #dee2e6; }
          .items-table .product-name { font-weight: 600; }
          .items-table .text-right { text-align: right; }
          .totals { margin-left: auto; width: 300px; }
          .totals .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .totals .row.total { font-size: 18px; font-weight: bold; color: #e74c3c; border-top: 2px solid #e74c3c; border-bottom: none; padding-top: 15px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
          @media print { body { padding: 0; } .invoice { max-width: 100%; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>🚲 XE ĐẠP NHẬT BẢN</h1>
            <p>Hóa đơn bán hàng / Invoice</p>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <h3>Thông tin đơn hàng</h3>
              <p><strong>Mã đơn:</strong> #${order?.orderNumber || order?._id?.slice(-6).toUpperCase()}</p>
              <p><strong>Ngày đặt:</strong> ${new Date(order?.createdAt).toLocaleDateString('vi-VN')}</p>
              <p><strong>Trạng thái:</strong> ${getStatusLabel(order?.orderStatus)}</p>
              <p><strong>Thanh toán:</strong> ${order?.paymentMethod === 'cod' ? 'COD' : order?.paymentMethod === 'bank' ? 'Chuyển khoản' : order?.paymentMethod}</p>
            </div>
            <div class="info-box">
              <h3>Thông tin khách hàng</h3>
              <p><strong>Tên:</strong> ${order?.customer?.name || 'N/A'}</p>
              <p><strong>SĐT:</strong> ${order?.customer?.phone || 'N/A'}</p>
              <p><strong>Email:</strong> ${order?.customer?.email || 'N/A'}</p>
              <p><strong>Địa chỉ:</strong> ${order?.customer?.address || 'N/A'}</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th class="text-right">Đơn giá</th>
                <th class="text-right">SL</th>
                <th class="text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${order?.items?.map((item: any) => `
                <tr>
                  <td class="product-name">${item.name || item.product?.name || 'Sản phẩm'}</td>
                  <td class="text-right">${formatCurrency(item.price || 0)}</td>
                  <td class="text-right">${item.quantity || 1}</td>
                  <td class="text-right">${formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>

          <div class="totals">
            <div class="row">
              <span>Tạm tính:</span>
              <span>${formatCurrency(order?.subtotal || 0)}</span>
            </div>
            ${order?.shippingFee ? `
            <div class="row">
              <span>Phí vận chuyển:</span>
              <span>${formatCurrency(order?.shippingFee)}</span>
            </div>
            ` : ''}
            ${order?.discount ? `
            <div class="row">
              <span>Giảm giá:</span>
              <span>-${formatCurrency(order?.discount)}</span>
            </div>
            ` : ''}
            <div class="row total">
              <span>Tổng cộng:</span>
              <span>${formatCurrency(order?.totalAmount || 0)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách đã mua hàng!</p>
            <p>Hotline: 0123-456-789 | Email: support@xedapnhatban.com</p>
          </div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${params.id}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${order?.orderNumber || order?._id?.slice(-6)}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
        toast.success('Đã tải hóa đơn PDF')
      } else {
        toast.error('Không thể tải hóa đơn PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Không thể tải hóa đơn PDF')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'shipping': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'confirmed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: language === 'ja' ? '処理待ち' : 'Chờ xử lý',
      confirmed: language === 'ja' ? '確認済み' : 'Đã xác nhận',
      processing: language === 'ja' ? '処理中' : 'Đang xử lý',
      shipping: language === 'ja' ? '配送中' : 'Đang giao',
      delivered: language === 'ja' ? '完了' : 'Hoàn thành',
      cancelled: language === 'ja' ? 'キャンセル' : 'Đã hủy'
    }
    return labels[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5" />
      case 'shipping': return <Truck className="w-5 h-5" />
      case 'cancelled': return <XCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f1419]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-[#0f1419]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-4">Không tìm thấy đơn hàng</div>
            <button
              onClick={() => router.push('/admin/orders')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/orders')}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {t('order')} #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {getStatusLabel(order.orderStatus)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleString(language === 'ja' ? 'ja-JP' : 'vi-VN')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                <Printer className="w-5 h-5" />
                {language === 'ja' ? '印刷' : 'In hóa đơn'}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" />
                PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" ref={printRef}>
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" />
                {language === 'ja' ? '商品リスト' : 'Danh sách sản phẩm'}
              </h3>

              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image || item.product?.images?.[0] ? (
                        <img 
                          src={item.image || item.product?.images?.[0]} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.name || item.product?.name || 'Sản phẩm'}</h4>
                      <p className="text-gray-400 text-sm">
                        {formatCurrency(item.price || 0)} x {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>{language === 'ja' ? '小計' : 'Tạm tính'}</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                {order.shippingFee > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>{language === 'ja' ? '送料' : 'Phí vận chuyển'}</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>{language === 'ja' ? '割引' : 'Giảm giá'}</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-gray-700">
                  <span>{language === 'ja' ? '合計' : 'Tổng cộng'}</span>
                  <span className="text-red-500">{formatCurrency(order.totalAmount || 0)}</span>
                </div>
              </div>
            </motion.div>

            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Customer Details */}
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {language === 'ja' ? '顧客情報' : 'Thông tin khách hàng'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{order.customer?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{order.customer?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{order.customer?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <span>
                      {order.customer?.address 
                        ? (typeof order.customer.address === 'string' 
                            ? order.customer.address 
                            : [
                                order.customer.address.street, 
                                order.customer.address.city, 
                                order.customer.address.prefecture,
                                order.customer.address.postalCode
                              ].filter(Boolean).join(', '))
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {language === 'ja' ? '支払情報' : 'Thanh toán'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === 'ja' ? '方法' : 'Phương thức'}</span>
                    <span className="text-white font-medium">
                      {order.paymentMethod === 'cod' ? 'COD' : 
                       order.paymentMethod === 'bank' ? (language === 'ja' ? '銀行振込' : 'Chuyển khoản') : 
                       order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === 'ja' ? '状態' : 'Trạng thái'}</span>
                    <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {order.paymentStatus === 'paid' ? (language === 'ja' ? '支払済' : 'Đã thanh toán') : (language === 'ja' ? '未払い' : 'Chưa thanh toán')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              {order.deliveryPreference && (
                <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    {language === 'ja' ? '配送情報' : 'Giao hàng'}
                  </h3>
                  <div className="space-y-3">
                    {order.deliveryPreference.preferredDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'ja' ? '希望日' : 'Ngày giao'}</span>
                        <span className="text-white">
                          {new Date(order.deliveryPreference.preferredDate).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'vi-VN')}
                        </span>
                      </div>
                    )}
                    {order.deliveryPreference.preferredTimeSlot && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'ja' ? '時間帯' : 'Khung giờ'}</span>
                        <span className="text-white">{order.deliveryPreference.preferredTimeSlot}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {language === 'ja' ? '備考' : 'Ghi chú'}
                  </h3>
                  <p className="text-gray-300">{order.notes}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

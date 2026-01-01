'use client'

import { Truck, RefreshCcw, Shield } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/ChatWidget'
import { useLanguageStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

export default function PolicyPage() {
  const { language } = useLanguageStore()
  const t = useTranslation(language)

  // Policy content translations
  const getPolicyContent = () => {
    const content: Record<string, any> = {
      vi: {
        deliveryArea: 'Khu vực giao hàng',
        deliveryItems: [
          'Giao hàng toàn quốc (trừ vùng xa xôi)',
          { text: 'Trong vòng', highlight: '20km', suffix: 'từ cửa hàng:', result: 'Miễn phí giao hàng' },
          'Trong vòng 70km từ cửa hàng: Có thể giao hàng trực tiếp (có phụ phí)',
          'Các khu vực khác: Giao hàng qua đối tác vận chuyển'
        ],
        deliveryFee: 'Phí giao hàng',
        feeItems: [
          { range: 'Trong 20km', price: 'Miễn phí' },
          { range: '21-50km', price: '¥500' },
          { range: '51-70km', price: '¥1,000' },
          { range: 'Trên 70km', price: 'Tùy theo khu vực (vui lòng liên hệ)' }
        ],
        deliveryTime: 'Thời gian giao hàng',
        timeInfo: 'Giao hàng trong vòng 3-7 ngày làm việc',
        timeNote: 'sau khi xác nhận đơn hàng',
        timeWarning: 'Có thể thay đổi tùy theo tình trạng hàng',
        timeCustom: 'Có thể chỉ định ngày giờ giao hàng (cần trao đổi)',
        returnConditions: 'Điều kiện đổi trả',
        returnItems: [
          'Có thể đổi trả trong vòng 7 ngày sau khi nhận hàng',
          'Miễn phí đổi trả nếu sản phẩm lỗi do nhà sản xuất',
          'Nếu đổi trả do lý do cá nhân, khách hàng chịu phí vận chuyển 2 chiều',
          'Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng'
        ],
        noReturn: 'Không áp dụng đổi trả',
        noReturnItems: [
          'Quá 8 ngày kể từ khi nhận hàng',
          'Sản phẩm bị hư hỏng do lỗi của khách hàng',
          'Sản phẩm đã qua sử dụng',
          'Mất hoặc hư hỏng tem mác sản phẩm'
        ],
        returnProcess: 'Quy trình đổi trả',
        returnSteps: [
          'Liên hệ bộ phận chăm sóc khách hàng (qua điện thoại hoặc email)',
          'Xác nhận lý do đổi trả và tình trạng sản phẩm',
          'Sau khi được chấp nhận, gửi sản phẩm về địa chỉ chỉ định',
          'Hoàn tiền trong 3-5 ngày làm việc sau khi kiểm tra sản phẩm'
        ],
        batteryWarranty: 'Bảo hành pin',
        batteryItems: [
          'Bảo hành miễn phí 3 tháng kể từ ngày mua',
          'Áp dụng cho hư hỏng trong điều kiện sử dụng bình thường',
          'Sửa chữa hoặc thay thế miễn phí trong thời gian bảo hành'
        ],
        motorWarranty: 'Bảo hành động cơ',
        motorItems: [
          'Bảo hành miễn phí 3 tháng kể từ ngày mua',
          'Áp dụng cho hư hỏng do lỗi sản xuất',
          'Sửa chữa hoặc thay thế miễn phí trong thời gian bảo hành'
        ],
        repairService: 'Dịch vụ sửa chữa',
        repairItems: [
          'Giảm 10% phí sửa chữa cho xe mua tại cửa hàng',
          'Cung cấp dịch vụ bảo dưỡng định kỳ',
          'Sửa chữa chất lượng cao với phụ tùng chính hãng'
        ],
        noWarranty: 'Không áp dụng bảo hành',
        noWarrantyItems: [
          'Hư hỏng do sử dụng hoặc bảo quản không đúng cách',
          'Hư hỏng do tai nạn hoặc va chạm',
          'Tự ý sửa chữa hoặc cải tạo',
          'Hư hỏng do thiên tai'
        ]
      },
      ja: {
        deliveryArea: '配送エリア',
        deliveryItems: [
          '全国配送（離島を除く）',
          { text: '店舗から', highlight: '20km', suffix: '以内:', result: '送料無料' },
          '店舗から70km以内: 直接配送可能（追加料金あり）',
          'その他の地域: 配送パートナー経由'
        ],
        deliveryFee: '配送料',
        feeItems: [
          { range: '20km以内', price: '無料' },
          { range: '21-50km', price: '¥500' },
          { range: '51-70km', price: '¥1,000' },
          { range: '70km以上', price: '地域により異なる（お問い合わせください）' }
        ],
        deliveryTime: '配送時間',
        timeInfo: '注文確認後3-7営業日以内に配送',
        timeNote: '注文確認後',
        timeWarning: '在庫状況により変動する場合があります',
        timeCustom: '配送日時の指定可能（要相談）',
        returnConditions: '返品条件',
        returnItems: [
          '商品到着後7日以内に返品可能',
          '製造上の欠陥の場合は無料で返品',
          '個人的な理由での返品は往復送料をご負担ください',
          '商品は未使用の状態である必要があります'
        ],
        noReturn: '返品不可',
        noReturnItems: [
          '商品到着後8日以上経過',
          'お客様の過失による破損',
          '使用済みの商品',
          'タグや包装の紛失・破損'
        ],
        returnProcess: '返品手続き',
        returnSteps: [
          'カスタマーサポートに連絡（電話またはメール）',
          '返品理由と商品状態の確認',
          '承認後、指定住所に商品を送付',
          '商品確認後3-5営業日以内に返金'
        ],
        batteryWarranty: 'バッテリー保証',
        batteryItems: [
          '購入日から3ヶ月間無料保証',
          '通常使用での故障に適用',
          '保証期間内は無料で修理または交換'
        ],
        motorWarranty: 'モーター保証',
        motorItems: [
          '購入日から3ヶ月間無料保証',
          '製造上の欠陥に適用',
          '保証期間内は無料で修理または交換'
        ],
        repairService: '修理サービス',
        repairItems: [
          '当店で購入した自転車は修理費10%割引',
          '定期メンテナンスサービス提供',
          '純正部品を使用した高品質修理'
        ],
        noWarranty: '保証対象外',
        noWarrantyItems: [
          '不適切な使用または保管による故障',
          '事故や衝突による故障',
          '無断での修理や改造',
          '自然災害による故障'
        ]
      },
      en: {
        deliveryArea: 'Delivery Area',
        deliveryItems: [
          'Nationwide delivery (except remote areas)',
          { text: 'Within', highlight: '20km', suffix: 'from store:', result: 'Free shipping' },
          'Within 70km from store: Direct delivery available (additional fee)',
          'Other areas: Delivery via shipping partners'
        ],
        deliveryFee: 'Delivery Fee',
        feeItems: [
          { range: 'Within 20km', price: 'Free' },
          { range: '21-50km', price: '¥500' },
          { range: '51-70km', price: '¥1,000' },
          { range: 'Over 70km', price: 'Varies by area (please contact us)' }
        ],
        deliveryTime: 'Delivery Time',
        timeInfo: 'Delivery within 3-7 business days',
        timeNote: 'after order confirmation',
        timeWarning: 'May vary depending on stock availability',
        timeCustom: 'Delivery date/time can be specified (subject to discussion)',
        returnConditions: 'Return Conditions',
        returnItems: [
          'Returns accepted within 7 days of receiving the product',
          'Free returns for manufacturing defects',
          'For personal reasons, customer bears round-trip shipping costs',
          'Product must be in original, unused condition'
        ],
        noReturn: 'Non-returnable Cases',
        noReturnItems: [
          'More than 8 days after receiving the product',
          'Damage caused by customer',
          'Used products',
          'Missing or damaged tags/packaging'
        ],
        returnProcess: 'Return Process',
        returnSteps: [
          'Contact customer support (phone or email)',
          'Confirm return reason and product condition',
          'After approval, send product to designated address',
          'Refund within 3-5 business days after product inspection'
        ],
        batteryWarranty: 'Battery Warranty',
        batteryItems: [
          'Free 3-month warranty from purchase date',
          'Applies to damage under normal use',
          'Free repair or replacement during warranty period'
        ],
        motorWarranty: 'Motor Warranty',
        motorItems: [
          'Free 3-month warranty from purchase date',
          'Applies to manufacturing defects',
          'Free repair or replacement during warranty period'
        ],
        repairService: 'Repair Service',
        repairItems: [
          '10% discount on repairs for bikes purchased from our store',
          'Regular maintenance service available',
          'High-quality repairs using genuine parts'
        ],
        noWarranty: 'Warranty Exclusions',
        noWarrantyItems: [
          'Damage from improper use or storage',
          'Damage from accidents or collisions',
          'Unauthorized repairs or modifications',
          'Damage from natural disasters'
        ]
      }
    }
    return content[language] || content.vi
  }

  const policy = getPolicyContent()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('policy.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('policy.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('policy.shipping')}</h2>
                <p className="text-sm text-gray-500">{t('policy.shippingDesc')}</p>
              </div>
            </div>
            <div className="prose max-w-none text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {policy.deliveryArea}
              </h3>
              <ul className="space-y-2 mb-6">
                {policy.deliveryItems.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>
                      {typeof item === 'string' ? item : (
                        <>{item.text} <strong className="text-blue-600">{item.highlight}</strong> {item.suffix} <strong className="text-green-600">{item.result}</strong></>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {policy.deliveryFee}
              </h3>
              <ul className="space-y-2 mb-6">
                {policy.feeItems.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{item.range}: <strong className={idx === 0 ? "text-green-600" : "text-blue-600"}>{item.price}</strong></span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {policy.deliveryTime}
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="font-semibold text-gray-900">{policy.timeInfo}</p>
                    <p className="text-sm text-gray-600 mt-1">{policy.timeNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-sm text-gray-700">{policy.timeWarning}</p>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <span className="text-2xl">📅</span>
                  <p className="text-sm text-gray-700">{policy.timeCustom}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-green-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <RefreshCcw className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('policy.return')}</h2>
                <p className="text-sm text-gray-500">{t('policy.returnDesc')}</p>
              </div>
            </div>
            <div className="prose max-w-none text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {policy.returnConditions}
              </h3>
              <ul className="space-y-2 mb-6">
                {policy.returnItems.map((item: string, idx: number) => (
                  <li key={idx} className={`flex items-start gap-3 ${idx === 2 ? 'bg-yellow-50' : 'bg-green-50'} p-3 rounded-lg`}>
                    <span className={`${idx === 2 ? 'text-yellow-600' : 'text-green-600'} font-bold mt-0.5`}>{idx === 2 ? '⚠' : '✓'}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.noReturn}</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {policy.noReturnItems.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.returnProcess}</h3>
              <ol className="list-decimal pl-6 space-y-2">
                {policy.returnSteps.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-purple-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('policy.warranty')}</h2>
                <p className="text-sm text-gray-500">{t('policy.warrantyDesc')}</p>
              </div>
            </div>
            <div className="prose max-w-none text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.batteryWarranty}</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {policy.batteryItems.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.motorWarranty}</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {policy.motorItems.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.repairService}</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {policy.repairItems.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.noWarranty}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {policy.noWarrantyItems.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  )
}

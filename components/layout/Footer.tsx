'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, MessageCircle, ExternalLink, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '@/components/Logo'

// Shop address for Google Maps
const SHOP_ADDRESS = '神戸市中央区日暮通2-4-18-1F'
const SHOP_COORDINATES = { lat: 34.6937, lng: 135.1956 } // Kobe coordinates
const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.0!2d135.19!3d34.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQxJzI0LjAiTiAxMzXCsDExJzI0LjAiRQ!5e0!3m2!1sja!2sjp!4v1609459200000!5m2!1sja!2sjp'
const GOOGLE_MAPS_LINK = 'https://maps.app.goo.gl/47ZhRxjddeZ61xK29?g_st=ipc'

// Social media links
const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/1A9Znebd24/?mibextid=wwXIfr',
  line: 'https://line.me/ti/p/99US8WrXZ3',
  zalo: 'https://zalo.me/hungthinhbike',
  instagram: 'https://instagram.com/hungthinhbike'
}

// Line icon component
const LineIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
)

// Zalo icon component
const ZaloIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12.49 10.272v-.45h1.347v6.322h-.77l-.144-.432a2.27 2.27 0 01-1.62.576c-1.476 0-2.532-1.164-2.532-2.7 0-1.548 1.056-2.7 2.532-2.7.636 0 1.164.204 1.548.576l-.361.808zm-1.26 4.86c.996 0 1.62-.756 1.62-1.8 0-1.032-.624-1.8-1.62-1.8s-1.62.768-1.62 1.8c0 1.044.624 1.8 1.62 1.8zm5.508-4.86v6.322h-1.347v-6.322h1.347zm3.504 5.916c1.044 0 1.692-.756 1.692-1.8s-.648-1.8-1.692-1.8-1.692.756-1.692 1.8.648 1.8 1.692 1.8zm0-4.86c1.596 0 2.676 1.152 2.676 3.06s-1.08 3.06-2.676 3.06-2.676-1.152-2.676-3.06 1.08-3.06 2.676-3.06zM6.828 8.832H2.376v.924h3.06L2.16 14.268v.876h4.668v-.924H3.552l3.276-4.512v-.876zM12 0C5.373 0 0 4.925 0 11s5.373 11 12 11 12-4.925 12-11S18.627 0 12 0z"/>
  </svg>
)

export default function Footer() {
  const [showMapModal, setShowMapModal] = useState(false)

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Logo size="md" className="mb-4" />
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p className="font-semibold text-red-400">HƯNG THỊNH 自転車店</p>
              <p>Thu mua – Bán – Sửa chữa</p>
              <p>• Xe trợ lực • Xe thể thao • Xe đạp thường</p>
              <p>Nhận đổi xe • Bảo hành • Tư vấn</p>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <p>買取・販売・修理</p>
                <p>・電動アシスト自転車 ・スポーツ自転車 ・一般自転車</p>
                <p>下取り • 保証 • 相談OK</p>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <p>Buy – Sell – Repair</p>
                <p>• Electric-assist bicycles • Sports bicycles • Standard bicycles</p>
                <p>Trade-in • Warranty • Consultation</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <a 
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={SOCIAL_LINKS.line} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                title="Line"
              >
                <LineIcon />
              </a>
              <a 
                href={SOCIAL_LINKS.zalo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                title="Zalo"
              >
                <ZaloIcon />
              </a>
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                title="Instagram"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-primary-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm hover:text-primary-400 transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary-400 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-sm hover:text-primary-400 transition-colors">
                  Chính sách
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=normal" className="text-sm hover:text-primary-400 transition-colors">
                  Xe đạp thường
                </Link>
              </li>
              <li>
                <Link href="/products?category=electric" className="text-sm hover:text-primary-400 transition-colors">
                  Xe đạp điện
                </Link>
              </li>
              <li>
                <Link href="/products?category=sport" className="text-sm hover:text-primary-400 transition-colors">
                  Xe đạp thể thao
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">お問い合わせ</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div>+81-XX-XXXX-XXXX</div>
                  <div className="text-gray-500">月-土 10:00-19:00</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  info@hungthinhbike.com
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <button 
                  onClick={() => setShowMapModal(true)}
                  className="text-sm text-left hover:text-primary-400 transition-colors cursor-pointer group"
                >
                  〒651-0077<br />
                  <span className="group-hover:underline">神戸市中央区日暮通2-4-18-1F</span>
                  <span className="ml-1 text-xs text-gray-500">(地図を見る)</span>
                </button>
              </li>
            </ul>
            
            {/* Quick contact buttons */}
            <div className="mt-4 space-y-2">
              <a 
                href={SOCIAL_LINKS.line}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <LineIcon />
                LINEで問い合わせ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HƯNG THỊNH 自転車店. All rights reserved.</p>
        </div>
      </div>

      {/* Google Maps Modal */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowMapModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">HƯNG THỊNH 自転車店</h3>
                    <p className="text-sm text-gray-500">{SHOP_ADDRESS}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Map */}
              <div className="aspect-video w-full">
                <iframe
                  src={GOOGLE_MAPS_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HƯNG THỊNH 自転車店 Location"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 flex flex-col sm:flex-row gap-3">
                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Google Mapsで開く
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SHOP_ADDRESS)
                    alert('住所をコピーしました')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  住所をコピー
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

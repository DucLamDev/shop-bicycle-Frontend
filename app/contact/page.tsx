'use client'

import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/ChatWidget'
import { useLanguageStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

export default function ContactPage() {
  const { language } = useLanguageStore()
  const t = useTranslation(language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              {t('contact.contactInfo')}
            </h2>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{t('contact.phone')}</h3>
                  <p className="text-gray-600 font-semibold">+84 XXX-XXXX-XXXX</p>
                  <p className="text-sm text-gray-500 mt-1">
                    🕒 Thứ 2 - Thứ 6: 9:00-18:00
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{t('contact.email')}</h3>
                  <p className="text-gray-600 font-semibold">info@hbikevietnam.vn</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ⏱️ Phản hồi trong vòng 24 giờ
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{t('contact.lineZalo')}</h3>
                  <p className="text-gray-600 font-semibold">@hbikejapan</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ⚡ Hỗ trợ nhanh chóng
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{t('contact.address')}</h3>
                  <p className="text-gray-600 font-semibold">Hà Nội, Việt Nam</p>
                  <p className="text-sm text-gray-500 mt-1">
                    📅 Thứ 2 - Thứ 6: 9:00 - 18:00<br />
                    Chủ nhật: Nghỉ 🌴
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              {t('contact.map')}
            </h2>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full h-96 rounded-xl overflow-hidden shadow-lg border-4 border-gray-100"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096888665867!2d105.8341598!3d21.0277644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HBike Japan Location"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-gray-500 mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              ⚠️ {t('contact.mapNote')}
            </motion.p>
          </motion.div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  )
}

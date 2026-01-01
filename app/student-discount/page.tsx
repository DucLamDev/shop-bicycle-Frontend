'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Upload, CheckCircle, Clock, X, Camera } from 'lucide-react'
import { studentVerificationAPI } from '@/lib/api'
import { useLanguageStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

export default function StudentDiscountPage() {
  const { language } = useLanguageStore()
  const t = useTranslation(language)
  const [step, setStep] = useState<'form' | 'success' | 'check'>('form')
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<any>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    schoolName: '',
    studentId: '',
    studentIdImage: '',
    additionalImage: ''
  })

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        vi: 'Giảm giá 10% cho Sinh viên',
        ja: '学生10%割引',
        en: '10% Student Discount'
      },
      subtitle: {
        vi: 'Xác minh thẻ sinh viên để nhận mã giảm giá đặc biệt',
        ja: '学生証を確認して特別割引コードを取得',
        en: 'Verify your student ID to get a special discount code'
      },
      name: {
        vi: 'Họ và tên',
        ja: '氏名',
        en: 'Full Name'
      },
      email: {
        vi: 'Email',
        ja: 'メール',
        en: 'Email'
      },
      phone: {
        vi: 'Số điện thoại',
        ja: '電話番号',
        en: 'Phone Number'
      },
      schoolName: {
        vi: 'Tên trường',
        ja: '学校名',
        en: 'School Name'
      },
      studentId: {
        vi: 'Mã số sinh viên',
        ja: '学籍番号',
        en: 'Student ID Number'
      },
      uploadPhoto: {
        vi: 'Tải ảnh thẻ sinh viên',
        ja: '学生証の写真をアップロード',
        en: 'Upload Student ID Photo'
      },
      uploadNote: {
        vi: 'Chụp rõ mặt trước thẻ sinh viên có ảnh và thông tin cá nhân',
        ja: '写真と個人情報が記載された学生証の表面を撮影してください',
        en: 'Take a clear photo of the front of your student ID with your photo and personal information'
      },
      submit: {
        vi: 'Gửi xác minh',
        ja: '確認を送信',
        en: 'Submit Verification'
      },
      successTitle: {
        vi: 'Yêu cầu đã được gửi!',
        ja: 'リクエストが送信されました！',
        en: 'Request Submitted!'
      },
      successMessage: {
        vi: 'Chúng tôi sẽ xác minh thông tin trong vòng 24 giờ và gửi mã giảm giá qua email.',
        ja: '24時間以内に情報を確認し、割引コードをメールでお送りします。',
        en: 'We will verify your information within 24 hours and send the discount code to your email.'
      },
      checkStatus: {
        vi: 'Kiểm tra trạng thái',
        ja: 'ステータスを確認',
        en: 'Check Status'
      },
      checkStatusDesc: {
        vi: 'Đã gửi yêu cầu? Nhập email để kiểm tra trạng thái',
        ja: '既にリクエストを送信しましたか？メールを入力してステータスを確認',
        en: 'Already submitted? Enter your email to check status'
      },
      statusPending: {
        vi: 'Đang chờ xác minh',
        ja: '確認待ち',
        en: 'Pending Verification'
      },
      statusApproved: {
        vi: 'Đã phê duyệt',
        ja: '承認済み',
        en: 'Approved'
      },
      statusRejected: {
        vi: 'Bị từ chối',
        ja: '却下',
        en: 'Rejected'
      },
      yourCode: {
        vi: 'Mã giảm giá của bạn',
        ja: 'あなたの割引コード',
        en: 'Your Discount Code'
      },
      expiresAt: {
        vi: 'Hết hạn',
        ja: '有効期限',
        en: 'Expires'
      },
      newRequest: {
        vi: 'Gửi yêu cầu mới',
        ja: '新しいリクエストを送信',
        en: 'Submit New Request'
      }
    }
    return texts[key]?.[language] || texts[key]?.vi || key
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'studentIdImage' | 'additionalImage') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.studentIdImage) {
      toast.error(language === 'ja' ? '学生証の写真が必要です' : 'Vui lòng tải ảnh thẻ sinh viên')
      return
    }

    setLoading(true)
    try {
      await studentVerificationAPI.submit(formData)
      setStep('success')
      toast.success(language === 'ja' ? 'リクエストが送信されました' : 'Yêu cầu đã được gửi!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckStatus = async () => {
    if (!checkEmail) return
    setLoading(true)
    try {
      const response = await studentVerificationAPI.checkStatus(checkEmail)
      setVerificationStatus(response.data.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không tìm thấy yêu cầu')
      setVerificationStatus(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getText('title')}</h1>
          <p className="text-lg text-gray-600">{getText('subtitle')}</p>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => { setStep('form'); setVerificationStatus(null) }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              step === 'form' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            {getText('newRequest')}
          </button>
          <button
            onClick={() => setStep('check')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              step === 'check' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            {getText('checkStatus')}
          </button>
        </div>

        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('name')} *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('email')} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('schoolName')} *</label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getText('studentId')} *</label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{getText('uploadPhoto')} *</label>
                <p className="text-sm text-gray-500 mb-3">{getText('uploadNote')}</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  {formData.studentIdImage ? (
                    <div className="relative">
                      <img
                        src={formData.studentIdImage}
                        alt="Student ID"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, studentIdImage: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <span className="text-blue-600 font-semibold">{getText('uploadPhoto')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleImageUpload(e, 'studentIdImage')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'ja' ? '送信中...' : 'Đang gửi...'}
                  </span>
                ) : (
                  getText('submit')
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{getText('successTitle')}</h2>
            <p className="text-gray-600 mb-8">{getText('successMessage')}</p>
            <button
              onClick={() => setStep('check')}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {getText('checkStatus')}
            </button>
          </motion.div>
        )}

        {step === 'check' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">{getText('checkStatus')}</h2>
            <p className="text-gray-600 mb-6">{getText('checkStatusDesc')}</p>

            <div className="flex gap-4 mb-8">
              <input
                type="email"
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleCheckStatus}
                disabled={loading || !checkEmail}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : getText('checkStatus')}
              </button>
            </div>

            {verificationStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl ${
                  verificationStatus.status === 'approved' ? 'bg-green-50 border border-green-200' :
                  verificationStatus.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {verificationStatus.status === 'approved' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : verificationStatus.status === 'rejected' ? (
                    <X className="w-6 h-6 text-red-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  )}
                  <span className={`font-semibold ${
                    verificationStatus.status === 'approved' ? 'text-green-700' :
                    verificationStatus.status === 'rejected' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {verificationStatus.status === 'approved' ? getText('statusApproved') :
                     verificationStatus.status === 'rejected' ? getText('statusRejected') :
                     getText('statusPending')}
                  </span>
                </div>

                {verificationStatus.status === 'approved' && verificationStatus.discountCode && (
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-600 mb-2">{getText('yourCode')}</p>
                    <div className="text-3xl font-bold text-blue-600 tracking-wider">
                      {verificationStatus.discountCode}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {getText('expiresAt')}: {new Date(verificationStatus.discountExpiresAt).toLocaleDateString()}
                    </p>
                    {verificationStatus.discountUsed && (
                      <p className="text-sm text-red-500 mt-2">
                        {language === 'ja' ? 'このコードは使用済みです' : 'Mã này đã được sử dụng'}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}

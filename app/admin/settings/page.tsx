'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Bell, Lock, Globe, Mail, Palette, Database, Shield, User, Loader2 } from 'lucide-react'
import { useAuthStore, useLanguageStore } from '@/lib/store'
import { settingsAPI } from '@/lib/api'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'
import { getAdminText } from '@/lib/i18n/admin'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { language } = useLanguageStore()
  const t = getAdminText(language)
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'HBIKE Japan',
    siteEmail: 'contact@hbike.jp',
    sitePhone: '078-123-4567',
    siteAddress: '〒651-0077 神戸市中央区日暮通2-4-18-1F',
    currency: 'JPY',
    language: 'ja',
    notificationEmail: true,
    notificationSMS: false,
    orderNotificationEmail: '',
    autoBackup: true,
    backupFrequency: 'daily',
    lastBackupAt: null as Date | null,
    primaryColor: '#ef4444',
    theme: 'dark',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    taxRate: 10,
    shippingFreeThreshold: 50000,
    codFee: 500
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchSettings()
  }, [isAuthenticated, user])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      if (response.data?.data) {
        setSettings(prev => ({ ...prev, ...response.data.data }))
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(settings)
      toast.success(t('saveSuccess') || '設定を保存しました')
    } catch (error) {
      toast.error(t('saveFailed') || '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('新しいパスワードが一致しません')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('パスワードは6文字以上である必要があります')
      return
    }
    try {
      await settingsAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('パスワードを変更しました')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'パスワードの変更に失敗しました')
    }
  }

  const handleBackup = async () => {
    try {
      const response = await settingsAPI.backup()
      toast.success('バックアップが完了しました')
      if (response.data?.data?.backupAt) {
        setSettings(prev => ({ ...prev, lastBackupAt: response.data.data.backupAt }))
      }
    } catch (error) {
      toast.error('バックアップに失敗しました')
    }
  }

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: Globe },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'backup', label: 'Sao lưu', icon: Database },
    { id: 'appearance', label: 'Giao diện', icon: Palette }
  ]

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Cài đặt hệ thống</h1>
            <p className="text-gray-400">Quản lý và cấu hình hệ thống</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1f2e] rounded-2xl p-4 border border-gray-800">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          activeTab === tab.id
                            ? 'bg-red-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
              >
                {activeTab === 'general' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Cài đặt chung</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tên website
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email liên hệ
                        </label>
                        <input
                          type="email"
                          value={settings.siteEmail}
                          onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          value={settings.sitePhone}
                          onChange={(e) => setSettings({...settings, sitePhone: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tiền tệ
                          </label>
                          <select
                            value={settings.currency}
                            onChange={(e) => setSettings({...settings, currency: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                          >
                            <option value="VND">VND (₫)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Ngôn ngữ
                          </label>
                          <select
                            value={settings.language}
                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                          >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Cài đặt thông báo</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="font-medium text-white">Thông báo qua Email</div>
                            <div className="text-sm text-gray-400">Nhận thông báo đơn hàng mới qua email</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notificationEmail}
                            onChange={(e) => setSettings({...settings, notificationEmail: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="font-medium text-white">Thông báo qua SMS</div>
                            <div className="text-sm text-gray-400">Nhận tin nhắn SMS cho đơn hàng quan trọng</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notificationSMS}
                            onChange={(e) => setSettings({...settings, notificationSMS: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">パスワード変更</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          現在のパスワード
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          placeholder="現在のパスワードを入力"
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none mb-3"
                        />
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          新しいパスワード
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          placeholder="新しいパスワードを入力"
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none mb-3"
                        />
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          パスワード確認
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          placeholder="新しいパスワードを再入力"
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                        <button
                          onClick={handleChangePassword}
                          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                        >
                          パスワードを変更
                        </button>
                      </div>

                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <div className="flex gap-3">
                          <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-yellow-400 mb-1">二段階認証</div>
                            <div className="text-sm text-gray-300">
                              二段階認証でアカウントのセキュリティを強化。ログイン時に認証コードが必要になります。
                            </div>
                            <button className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium">
                              有効にする
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'backup' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Sao lưu dữ liệu</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-800">
                        <div>
                          <div className="font-medium text-white">Tự động sao lưu</div>
                          <div className="text-sm text-gray-400">Sao lưu dữ liệu định kỳ tự động</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoBackup}
                            onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tần suất sao lưu
                        </label>
                        <select
                          value={settings.backupFrequency}
                          onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                        >
                          <option value="hourly">Mỗi giờ</option>
                          <option value="daily">Hàng ngày</option>
                          <option value="weekly">Hàng tuần</option>
                          <option value="monthly">Hàng tháng</option>
                        </select>
                      </div>

                      <button 
                        onClick={handleBackup}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                      >
                        今すぐバックアップ
                      </button>
                      
                      {settings.lastBackupAt && (
                        <p className="text-sm text-gray-400 mt-2">
                          最後のバックアップ: {new Date(settings.lastBackupAt).toLocaleString('ja-JP')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Giao diện</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Màu chủ đạo
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                          {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color) => (
                            <button
                              key={color}
                              className="w-full h-12 rounded-xl border-2 border-gray-700 hover:border-white transition-colors"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Chế độ hiển thị
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button className="p-4 bg-gray-800/50 rounded-xl border-2 border-red-500 text-white">
                            <div className="font-medium">Tối</div>
                            <div className="text-sm text-gray-400 mt-1">Màu nền tối</div>
                          </button>
                          <button className="p-4 bg-gray-800/50 rounded-xl border-2 border-gray-700 text-white hover:border-gray-600">
                            <div className="font-medium">Sáng</div>
                            <div className="text-sm text-gray-400 mt-1">Màu nền sáng</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-800">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? '保存中...' : '設定を保存'}
                  </button>
                  <button 
                    onClick={() => fetchSettings()}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
                  >
                    リセット
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

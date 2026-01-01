'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, Bell, Lock, Globe, Mail, Palette, Database, Shield, User } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    siteName: 'HBike Vietnam',
    siteEmail: 'info@hbikevietnam.vn',
    sitePhone: '+84 XXX-XXXX-XXXX',
    currency: 'VND',
    language: 'vi',
    notificationEmail: true,
    notificationSMS: false,
    autoBackup: true,
    backupFrequency: 'daily'
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
  }, [isAuthenticated, user])

  const handleSave = () => {
    toast.success('Đã lưu cài đặt')
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
                    <h2 className="text-2xl font-bold text-white mb-6">Bảo mật</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Đổi mật khẩu
                        </label>
                        <input
                          type="password"
                          placeholder="Mật khẩu hiện tại"
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none mb-3"
                        />
                        <input
                          type="password"
                          placeholder="Mật khẩu mới"
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none mb-3"
                        />
                        <input
                          type="password"
                          placeholder="Xác nhận mật khẩu mới"
                          className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>

                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <div className="flex gap-3">
                          <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-yellow-400 mb-1">Xác thực 2 bước</div>
                            <div className="text-sm text-gray-300">
                              Tăng cường bảo mật tài khoản với xác thực 2 bước. Bạn sẽ cần mã xác thực mỗi khi đăng nhập.
                            </div>
                            <button className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium">
                              Kích hoạt
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

                      <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium">
                        Sao lưu ngay
                      </button>
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
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
                  >
                    <Save className="w-5 h-5" />
                    Lưu thay đổi
                  </button>
                  <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
                    Hủy bỏ
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

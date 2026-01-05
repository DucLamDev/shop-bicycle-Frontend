'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Search, Plus, Edit2, Trash2, X, Save, 
  Shield, User, UserCog, Mail, Phone, Calendar,
  ChevronDown, AlertCircle, Check
} from 'lucide-react'
import { usersAPI } from '@/lib/api'
import { useLanguageStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface UserData {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'user' | 'collaborator'
  collaboratorInfo?: {
    commissionRate?: {
      electricBike: number
      normalBike: number
      sportBike: number
    }
    totalCommission?: number
    paidCommission?: number
    pendingCommission?: number
  }
  createdAt: string
  totalOrders?: number
  totalSpent?: number
}

interface FormData {
  name: string
  email: string
  phone: string
  password: string
  role: 'admin' | 'user' | 'collaborator'
  collaboratorInfo: {
    commissionRate: {
      electricBike: number
      normalBike: number
      sportBike: number
    }
  }
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
  collaboratorInfo: {
    commissionRate: {
      electricBike: 5000,
      normalBike: 2000,
      sportBike: 3000
    }
  }
}

export default function AdminUsersPage() {
  const { language } = useLanguageStore()
  const t = useTranslation(language)
  
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersAPI.getAll({ search })
      setUsers(response.data.data || [])
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('userManagement.fetchError'))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (user?: UserData) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
        role: user.role,
        collaboratorInfo: {
          commissionRate: user.collaboratorInfo?.commissionRate || initialFormData.collaboratorInfo.commissionRate
        }
      })
    } else {
      setEditingUser(null)
      setFormData(initialFormData)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData(initialFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast.error(t('userManagement.requiredFields'))
      return
    }

    if (!editingUser && !formData.password) {
      toast.error(t('userManagement.passwordRequired'))
      return
    }

    try {
      setSaving(true)
      
      const dataToSend: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      }

      if (formData.password) {
        dataToSend.password = formData.password
      }

      if (formData.role === 'collaborator') {
        dataToSend.collaboratorInfo = formData.collaboratorInfo
      }

      if (editingUser) {
        await usersAPI.update(editingUser._id, dataToSend)
        toast.success(t('userManagement.updateSuccess'))
      } else {
        await usersAPI.create(dataToSend)
        toast.success(t('userManagement.createSuccess'))
      }

      handleCloseModal()
      fetchUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('userManagement.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await usersAPI.delete(id)
      toast.success(t('userManagement.deleteSuccess'))
      setDeleteConfirm(null)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('userManagement.deleteError'))
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'collaborator': return <UserCog className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200'
      case 'collaborator': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, Record<string, string>> = {
      admin: { ja: '管理者', en: 'Admin', vi: 'Quản trị viên' },
      user: { ja: 'ユーザー', en: 'User', vi: 'Người dùng' },
      collaborator: { ja: 'CTV', en: 'Collaborator', vi: 'Cộng tác viên' }
    }
    return labels[role]?.[language] || role
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                ← {t('common.back')}
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                {t('userManagement.title')}
              </h1>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t('userManagement.addUser')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('userManagement.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('userManagement.totalUsers')}</p>
                <p className="text-xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('userManagement.admins')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCog className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('userManagement.collaborators')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'collaborator').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('userManagement.regularUsers')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'user').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('userManagement.noUsers')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('userManagement.name')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('userManagement.email')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">{t('userManagement.phone')}</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">{t('userManagement.role')}</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">{t('userManagement.orders')}</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">{t('userManagement.created')}</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">{t('userManagement.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">{user.totalOrders || 0}</td>
                      <td className="py-3 px-4 text-right text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'vi' ? 'vi-VN' : 'en-US')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('common.edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {deleteConfirm === user._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={t('common.confirm')}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title={t('common.cancel')}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={t('common.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingUser ? t('userManagement.editUser') : t('userManagement.addUser')}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('userManagement.name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('userManagement.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('userManagement.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('userManagement.password')} {!editingUser && '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={editingUser ? t('userManagement.leaveBlank') : ''}
                    required={!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('userManagement.role')} *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="user">{getRoleLabel('user')}</option>
                    <option value="collaborator">{getRoleLabel('collaborator')}</option>
                    <option value="admin">{getRoleLabel('admin')}</option>
                  </select>
                </div>

                {formData.role === 'collaborator' && (
                  <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-purple-900">{t('userManagement.commissionSettings')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-purple-700 mb-1">
                          {t('userManagement.electricBike')}
                        </label>
                        <input
                          type="number"
                          value={formData.collaboratorInfo.commissionRate.electricBike}
                          onChange={(e) => setFormData({
                            ...formData,
                            collaboratorInfo: {
                              ...formData.collaboratorInfo,
                              commissionRate: {
                                ...formData.collaboratorInfo.commissionRate,
                                electricBike: parseInt(e.target.value) || 0
                              }
                            }
                          })}
                          className="w-full px-2 py-1 border border-purple-200 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-purple-700 mb-1">
                          {t('userManagement.normalBike')}
                        </label>
                        <input
                          type="number"
                          value={formData.collaboratorInfo.commissionRate.normalBike}
                          onChange={(e) => setFormData({
                            ...formData,
                            collaboratorInfo: {
                              ...formData.collaboratorInfo,
                              commissionRate: {
                                ...formData.collaboratorInfo.commissionRate,
                                normalBike: parseInt(e.target.value) || 0
                              }
                            }
                          })}
                          className="w-full px-2 py-1 border border-purple-200 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-purple-700 mb-1">
                          {t('userManagement.sportBike')}
                        </label>
                        <input
                          type="number"
                          value={formData.collaboratorInfo.commissionRate.sportBike}
                          onChange={(e) => setFormData({
                            ...formData,
                            collaboratorInfo: {
                              ...formData.collaboratorInfo,
                              commissionRate: {
                                ...formData.collaboratorInfo.commissionRate,
                                sportBike: parseInt(e.target.value) || 0
                              }
                            }
                          })}
                          className="w-full px-2 py-1 border border-purple-200 rounded text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-purple-600">{t('userManagement.commissionNote')}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t('common.save')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

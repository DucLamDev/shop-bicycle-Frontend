'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, TrendingUp, TrendingDown, Calendar, DollarSign, ShoppingCart, Package, Users, Filter, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import { useAuthStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { dashboardAPI, productsAPI, ordersAPI } from '@/lib/api'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function AdminReportsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30days')
  const [reportData, setReportData] = useState<any>({
    revenue: [],
    categories: [],
    topProducts: [],
    summary: {}
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    fetchReports()
  }, [isAuthenticated, user, timeRange])

  const fetchReports = async () => {
    try {
      setLoading(true)
      
      // Get time range in days
      let days = 30
      let rangeParam = '30d'
      if (timeRange === '7days') { days = 7; rangeParam = '7d' }
      else if (timeRange === '90days') { days = 90; rangeParam = '90d' }
      else if (timeRange === 'year') { days = 365; rangeParam = '365d' }

      // Fetch real data from API
      const [statsRes, revenueRes, topProductsRes, ordersRes, productsRes] = await Promise.all([
        dashboardAPI.getStats({ range: rangeParam }),
        dashboardAPI.getRevenue({ range: rangeParam }),
        dashboardAPI.getTopProducts(),
        ordersAPI.getAll({ limit: 500 }),
        productsAPI.getAll({ limit: 100 })
      ])

      const stats = statsRes.data.stats || {}
      const revenueData = revenueRes.data.data || []
      const topProducts = topProductsRes.data.data || []
      const orders = ordersRes.data.data || []
      const products = productsRes.data.data || []

      // Calculate category distribution from products
      const categoryCount: any = { normal: 0, electric: 0, sport: 0 }
      products.forEach((p: any) => {
        if (categoryCount[p.category] !== undefined) {
          categoryCount[p.category]++
        }
      })
      const totalProductsCount = products.length || 1
      const categories = [
        { name: 'Xe thường', value: Math.round((categoryCount.normal / totalProductsCount) * 100) || 0, color: '#3b82f6' },
        { name: 'Xe điện', value: Math.round((categoryCount.electric / totalProductsCount) * 100) || 0, color: '#10b981' },
        { name: 'Xe thể thao', value: Math.round((categoryCount.sport / totalProductsCount) * 100) || 0, color: '#f59e0b' }
      ]

      // Format revenue data for chart
      const formattedRevenue = revenueData.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: item.revenue || 0,
        orders: item.orders || 0
      }))

      // Format top products
      const formattedTopProducts = topProducts.slice(0, 5).map((item: any) => ({
        name: item.product?.name || 'Sản phẩm',
        sold: item.totalSold || 0,
        revenue: item.totalRevenue || 0
      }))

      // Calculate total sold products
      const totalSoldProducts = topProducts.reduce((sum: number, item: any) => sum + (item.totalSold || 0), 0)

      // Calculate total revenue and orders from actual orders data (non-cancelled)
      const validOrders = orders.filter((o: any) => o.orderStatus !== 'cancelled')
      const calculatedRevenue = validOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
      const calculatedOrders = validOrders.length

      // Calculate average order value
      const avgOrderValue = calculatedOrders > 0 ? Math.round(calculatedRevenue / calculatedOrders) : 0

      // Calculate growth rates
      const now = new Date()
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      
      const thisMonthOrders = validOrders.filter((o: any) => new Date(o.createdAt) >= startOfThisMonth)
      const lastMonthOrders = validOrders.filter((o: any) => {
        const date = new Date(o.createdAt)
        return date >= startOfLastMonth && date < startOfThisMonth
      })
      
      const thisMonthRevenue = thisMonthOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
      const lastMonthRevenue = lastMonthOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
      
      const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0
      const ordersGrowth = lastMonthOrders.length > 0 ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100).toFixed(1) : 0

      setReportData({
        revenue: formattedRevenue,
        categories,
        topProducts: formattedTopProducts,
        summary: {
          totalRevenue: calculatedRevenue || stats.totalRevenue || 0,
          totalOrders: calculatedOrders || stats.totalOrders || 0,
          avgOrderValue,
          totalProducts: totalSoldProducts,
          revenueGrowth: Number(revenueGrowth) || 0,
          ordersGrowth: Number(ordersGrowth) || 0
        }
      })
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Không thể tải báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // ========== SUMMARY SHEET ==========
    const summaryData = [
      ['売上レポート / 売上報告書'],
      ['HBIKE JAPAN株式会社'],
      [''],
      ['レポート期間', timeRange === '7days' ? '過去7日間' : timeRange === '30days' ? '過去30日間' : timeRange === '90days' ? '過去90日間' : '今年'],
      ['作成日', new Date().toLocaleDateString('ja-JP')],
      [''],
      ['📊 概要 / サマリー'],
      [''],
      ['項目', '金額/数量', '前月比'],
      ['総売上', `¥${reportData.summary.totalRevenue.toLocaleString()}`, `${reportData.summary.revenueGrowth}%`],
      ['総注文数', reportData.summary.totalOrders, `${reportData.summary.ordersGrowth}%`],
      ['平均注文金額', `¥${reportData.summary.avgOrderValue.toLocaleString()}`, '-'],
      ['販売商品数', reportData.summary.totalProducts, '-'],
    ]
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
    
    // Set column widths
    wsSummary['!cols'] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 15 }
    ]
    
    // Merge cells for title
    wsSummary['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 2 } }
    ]
    
    XLSX.utils.book_append_sheet(wb, wsSummary, '概要')
    
    // ========== DAILY REVENUE SHEET ==========
    const revenueHeader = [
      ['📈 日別売上データ'],
      [''],
      ['日付', '売上金額', '注文数']
    ]
    const revenueRows = reportData.revenue.map((item: any) => [
      item.date,
      item.revenue,
      item.orders
    ])
    const wsRevenue = XLSX.utils.aoa_to_sheet([...revenueHeader, ...revenueRows])
    
    wsRevenue['!cols'] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 12 }
    ]
    
    wsRevenue['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }
    ]
    
    XLSX.utils.book_append_sheet(wb, wsRevenue, '日別売上')
    
    // ========== TOP PRODUCTS SHEET ==========
    const productsHeader = [
      ['🏆 売れ筋商品TOP5'],
      [''],
      ['順位', '商品名', '販売数', '売上金額']
    ]
    const productsRows = reportData.topProducts.map((item: any, index: number) => [
      index + 1,
      item.name,
      item.sold,
      item.revenue
    ])
    const wsProducts = XLSX.utils.aoa_to_sheet([...productsHeader, ...productsRows])
    
    wsProducts['!cols'] = [
      { wch: 8 },
      { wch: 40 },
      { wch: 12 },
      { wch: 20 }
    ]
    
    wsProducts['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }
    ]
    
    XLSX.utils.book_append_sheet(wb, wsProducts, '売れ筋商品')
    
    // ========== CATEGORY SHEET ==========
    const categoryHeader = [
      ['📦 カテゴリ別分布'],
      [''],
      ['カテゴリ', '割合']
    ]
    const categoryRows = reportData.categories.map((cat: any) => [
      cat.name,
      `${cat.value}%`
    ])
    const wsCategory = XLSX.utils.aoa_to_sheet([...categoryHeader, ...categoryRows])
    
    wsCategory['!cols'] = [
      { wch: 20 },
      { wch: 15 }
    ]
    
    wsCategory['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }
    ]
    
    XLSX.utils.book_append_sheet(wb, wsCategory, 'カテゴリ')

    // Download file
    const fileName = `HBIKE_売上レポート_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    toast.success('レポートをエクスポートしました！')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f1419]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Báo cáo & Thống kê</h1>
              <p className="text-gray-400">Phân tích doanh thu và hiệu suất kinh doanh</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-800 text-white rounded-xl border border-gray-700 focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">90 ngày qua</option>
                <option value="year">Năm nay</option>
              </select>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" />
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {reportData.summary.revenueGrowth}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatCurrency(reportData.summary.totalRevenue)}
              </div>
              <div className="text-sm text-gray-400">Tổng doanh thu</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {reportData.summary.ordersGrowth}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {reportData.summary.totalOrders}
              </div>
              <div className="text-sm text-gray-400">Đơn hàng</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatCurrency(reportData.summary.avgOrderValue)}
              </div>
              <div className="text-sm text-gray-400">Giá trị TB/đơn</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {reportData.summary.totalProducts}
              </div>
              <div className="text-sm text-gray-400">Sản phẩm bán ra</div>
            </motion.div>
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Biểu đồ doanh thu</h2>
                  <p className="text-sm text-gray-400">Theo tuần trong 30 ngày qua</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={reportData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                    tickFormatter={(value) => `${value/1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f2e',
                      border: '1px solid #2d3748',
                      borderRadius: '0.75rem'
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Phân bổ danh mục</h2>
                <p className="text-sm text-gray-400">Theo doanh số</p>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={reportData.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportData.categories.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-4">
                {reportData.categories.map((cat: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm text-gray-300">{cat.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1f2e] rounded-2xl p-6 border border-gray-800"
          >
            <h2 className="text-xl font-bold text-white mb-6">Top 5 sản phẩm bán chạy</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="pb-4 text-left text-sm font-semibold text-gray-400">Xếp hạng</th>
                    <th className="pb-4 text-left text-sm font-semibold text-gray-400">Tên sản phẩm</th>
                    <th className="pb-4 text-right text-sm font-semibold text-gray-400">Đã bán</th>
                    <th className="pb-4 text-right text-sm font-semibold text-gray-400">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {reportData.topProducts.map((product: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-700 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 text-white font-medium">{product.name}</td>
                      <td className="py-4 text-right text-gray-300">{product.sold} chiếc</td>
                      <td className="py-4 text-right text-emerald-400 font-semibold">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

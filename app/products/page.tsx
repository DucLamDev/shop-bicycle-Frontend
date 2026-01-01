'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { productsAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { useLanguageStore, useCurrencyStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/ChatWidget'

function ProductsContent() {
  const searchParams = useSearchParams()
  const { language } = useLanguageStore()
  const { currency } = useCurrencyStore()
  const t = useTranslation(language)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<any>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [filters, currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params: any = { page: currentPage, limit: 12 }
      if (filters.category) params.category = filters.category
      if (filters.brand) params.brand = filters.brand
      if (filters.condition) params.condition = filters.condition
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.search) params.search = filters.search

      const response = await productsAPI.getAll(params)
      setProducts(response.data.data)
      setPagination(response.data.pagination)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const brands = ['Yamaha', 'Panasonic', 'Bridgestone', 'Other']
  const categories = [
    { value: 'normal', label: t('home.normal') },
    { value: 'electric', label: t('home.electric') },
    { value: 'sport', label: t('home.sport') }
  ]

  // Get product name based on language
  const getProductName = (product: any) => {
    if (language === 'ja' && product.nameJa) return product.nameJa
    if (language === 'en' && product.nameEn) return product.nameEn
    return product.name
  }

  // Get condition text based on language
  const getConditionText = (condition: string) => {
    if (condition === 'new') return t('products.new')
    return t('products.used')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h1>
          <p className="text-gray-600">
            {language === 'vi' ? 'Tìm chiếc xe đạp hoàn hảo cho bạn' :
             language === 'ja' ? 'あなたにぴったりの自転車を見つけてください' :
             'Find the perfect bicycle for you'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('products.filter')}</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('products.search')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      placeholder={t('products.search') + '...'}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('products.category')}
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">{language === 'ja' ? 'すべて' : language === 'en' ? 'All' : 'Tất cả'}</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('products.brand')}
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">{language === 'ja' ? 'すべて' : language === 'en' ? 'All' : 'Tất cả'}</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('products.condition')}
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">{language === 'ja' ? 'すべて' : language === 'en' ? 'All' : 'Tất cả'}</option>
                    <option value="new">{t('products.new')}</option>
                    <option value="used">{t('products.used')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('products.priceRange')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      placeholder={language === 'ja' ? '最小' : language === 'en' ? 'Min' : 'Tối thiểu'}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      placeholder={language === 'ja' ? '最大' : language === 'en' ? 'Max' : 'Tối đa'}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setFilters({
                    category: '',
                    brand: '',
                    condition: '',
                    minPrice: '',
                    maxPrice: '',
                    search: ''
                  })}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'ja' ? 'フィルターをクリア' : language === 'en' ? 'Clear filters' : 'Xóa bộ lọc'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {t('products.filter')}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500">{language === 'ja' ? '製品が見つかりません' : language === 'en' ? 'No products found' : 'Không tìm thấy sản phẩm'}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/products/${product._id}`}>
                        <div className="bg-white rounded-lg overflow-hidden shadow-md hover-lift cursor-pointer h-full">
                          <div className="relative h-56 bg-gray-200">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute top-3 right-3 px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-medium">
                              {getConditionText(product.condition)}
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                              {getProductName(product)}
                            </h3>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xl font-bold text-primary-600">
                                {formatCurrency(product.price, currency)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {language === 'ja' ? '状態' : language === 'en' ? 'Condition' : 'Tình trạng'}: {product.conditionPercentage}%
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(pagination.pages)].map((_, index) => {
                        const pageNum = index + 1
                        const isCurrentPage = pageNum === currentPage
                        
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.pages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                                isCurrentPage
                                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className="px-2 text-gray-400">...</span>
                        }
                        return null
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                      disabled={currentPage === pagination.pages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <span className="ml-4 text-sm text-gray-600">
                      {pagination.total} sản phẩm
                    </span>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  )
}

function ProductsLoading() {
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  )
}

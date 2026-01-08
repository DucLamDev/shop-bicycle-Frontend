'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguageStore } from '@/lib/store'

const blogPosts = [
  {
    id: 'electric-bike-guide-japan',
    title: {
      ja: '電動アシスト自転車の選び方ガイド｜初心者向け完全解説',
      vi: 'Hướng dẫn chọn xe đạp trợ lực điện tại Nhật Bản cho người mới',
      en: 'Complete Guide to Choosing Electric Assist Bicycles in Japan'
    },
    excerpt: {
      ja: '電動アシスト自転車を初めて購入する方必見！バッテリー容量、モーター性能、価格帯など、選び方のポイントを詳しく解説します。',
      vi: 'Hướng dẫn chi tiết cách chọn xe đạp điện trợ lực tại Nhật: dung lượng pin, hiệu suất motor, giá cả và các tiêu chí quan trọng.',
      en: 'Essential guide for first-time electric bike buyers. Learn about battery capacity, motor performance, and price ranges.'
    },
    image: '/image/blog/ebike-guide.jpg',
    category: 'guide',
    date: '2026-01-05',
    readTime: 10,
    tags: ['電動自転車', '選び方', 'xe đạp điện', 'hướng dẫn']
  },
  {
    id: 'used-electric-bike-benefits',
    title: {
      ja: '中古電動自転車のメリット｜新品との違いと賢い選び方',
      vi: 'Lợi ích của xe đạp điện cũ tại Nhật｜So sánh với xe mới',
      en: 'Benefits of Used Electric Bikes | Smart Buying Guide'
    },
    excerpt: {
      ja: '中古電動自転車は新品の半額以下で購入できることも。品質チェックのポイントやおすすめの購入先を紹介します。',
      vi: 'Xe đạp điện cũ có thể rẻ hơn 50% so với xe mới. Tìm hiểu cách kiểm tra chất lượng và địa điểm mua uy tín.',
      en: 'Used electric bikes can cost less than half of new ones. Learn quality check tips and where to buy.'
    },
    image: '/image/blog/used-ebike.jpg',
    category: 'tips',
    date: '2026-01-03',
    readTime: 8,
    tags: ['中古自転車', 'お得', 'xe cũ', 'tiết kiệm']
  },
  {
    id: 'battery-maintenance-tips',
    title: {
      ja: '電動自転車バッテリーの寿命を延ばす方法｜メンテナンス完全ガイド',
      vi: 'Cách kéo dài tuổi thọ pin xe đạp điện｜Hướng dẫn bảo dưỡng',
      en: 'How to Extend Electric Bike Battery Life | Maintenance Guide'
    },
    excerpt: {
      ja: 'バッテリーは電動自転車で最も高価なパーツ。正しい充電方法と保管方法で寿命を2倍に延ばせます。',
      vi: 'Pin là bộ phận đắt nhất của xe đạp điện. Cách sạc và bảo quản đúng có thể kéo dài tuổi thọ gấp đôi.',
      en: 'Battery is the most expensive part. Proper charging and storage can double its lifespan.'
    },
    image: '/image/blog/battery-care.jpg',
    category: 'maintenance',
    date: '2026-01-01',
    readTime: 7,
    tags: ['バッテリー', 'メンテナンス', 'pin', 'bảo dưỡng']
  },
  {
    id: 'commuting-kobe-osaka',
    title: {
      ja: '神戸・大阪で電動自転車通勤｜おすすめルートと注意点',
      vi: 'Đi làm bằng xe đạp điện ở Kobe, Osaka｜Lộ trình và lưu ý',
      en: 'Electric Bike Commuting in Kobe & Osaka | Routes and Tips'
    },
    excerpt: {
      ja: '神戸や大阪での電動自転車通勤は快適で経済的。坂道の多い神戸でも電動アシストなら楽々。おすすめルートを紹介。',
      vi: 'Đi làm bằng xe đạp điện ở Kobe, Osaka tiện lợi và tiết kiệm. Xe trợ lực giúp leo dốc dễ dàng.',
      en: 'Electric bike commuting in Kobe and Osaka is comfortable and economical. Great for hilly areas.'
    },
    image: '/image/blog/commute.jpg',
    category: 'lifestyle',
    date: '2025-12-28',
    readTime: 6,
    tags: ['通勤', '神戸', '大阪', 'đi làm', 'Kobe']
  },
  {
    id: 'vietnamese-guide-buying-bike',
    title: {
      ja: 'ベトナム人向け｜日本で自転車を買う方法と注意点',
      vi: 'Hướng dẫn người Việt mua xe đạp tại Nhật Bản',
      en: 'Guide for Vietnamese: Buying Bicycles in Japan'
    },
    excerpt: {
      ja: '日本在住のベトナム人の方向けに、自転車の購入方法、防犯登録、交通ルールを分かりやすく解説します。',
      vi: 'Hướng dẫn chi tiết cho người Việt tại Nhật: cách mua xe đạp, đăng ký chống trộm, và luật giao thông.',
      en: 'Detailed guide for Vietnamese in Japan: how to buy bikes, anti-theft registration, and traffic rules.'
    },
    image: '/image/blog/vietnam-guide.jpg',
    category: 'guide',
    date: '2025-12-25',
    readTime: 12,
    tags: ['người Việt', 'Nhật Bản', 'ベトナム人', '自転車購入']
  },
  {
    id: 'panasonic-vs-yamaha-vs-bridgestone',
    title: {
      ja: 'パナソニック vs ヤマハ vs ブリヂストン｜電動自転車メーカー比較',
      vi: 'So sánh Panasonic, Yamaha, Bridgestone｜Hãng xe đạp điện nào tốt?',
      en: 'Panasonic vs Yamaha vs Bridgestone | Electric Bike Brand Comparison'
    },
    excerpt: {
      ja: '日本の3大電動自転車メーカーを徹底比較。それぞれの特徴、強み、おすすめモデルを紹介します。',
      vi: 'So sánh chi tiết 3 hãng xe đạp điện lớn nhất Nhật Bản. Đặc điểm, ưu điểm và model được đề xuất.',
      en: 'Comprehensive comparison of Japan\'s top 3 electric bike manufacturers.'
    },
    image: '/image/blog/brand-compare.jpg',
    category: 'review',
    date: '2025-12-20',
    readTime: 15,
    tags: ['パナソニック', 'ヤマハ', 'ブリヂストン', 'so sánh']
  }
]

const categories = [
  { id: 'all', label: { ja: 'すべて', vi: 'Tất cả', en: 'All' } },
  { id: 'guide', label: { ja: 'ガイド', vi: 'Hướng dẫn', en: 'Guide' } },
  { id: 'tips', label: { ja: 'お得情報', vi: 'Mẹo hay', en: 'Tips' } },
  { id: 'maintenance', label: { ja: 'メンテナンス', vi: 'Bảo dưỡng', en: 'Maintenance' } },
  { id: 'review', label: { ja: 'レビュー', vi: 'Đánh giá', en: 'Review' } },
  { id: 'lifestyle', label: { ja: 'ライフスタイル', vi: 'Phong cách sống', en: 'Lifestyle' } }
]

export default function BlogPage() {
  const { language } = useLanguageStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title[language as keyof typeof post.title]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt[language as keyof typeof post.excerpt]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      blogTitle: { ja: 'ブログ・お役立ち情報', vi: 'Blog & Thông tin hữu ích', en: 'Blog & Useful Info' },
      blogSubtitle: { ja: '電動自転車に関する最新情報やお得な情報をお届けします', vi: 'Thông tin mới nhất và hữu ích về xe đạp điện', en: 'Latest news and useful information about electric bikes' },
      searchPlaceholder: { ja: '記事を検索...', vi: 'Tìm kiếm bài viết...', en: 'Search articles...' },
      readMore: { ja: '続きを読む', vi: 'Đọc tiếp', en: 'Read more' },
      minRead: { ja: '分で読める', vi: 'phút đọc', en: 'min read' },
      noResults: { ja: '記事が見つかりませんでした', vi: 'Không tìm thấy bài viết', en: 'No articles found' }
    }
    return texts[key]?.[language] || texts[key]?.ja || key
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getText('blogTitle')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{getText('blogSubtitle')}</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={getText('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.label[language as keyof typeof cat.label]}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🚲</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'vi' ? 'vi-VN' : 'en-US')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime} {getText('minRead')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title[language as keyof typeof post.title]}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt[language as keyof typeof post.excerpt]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    {getText('readMore')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{getText('noResults')}</p>
          </div>
        )}

        {/* SEO Keywords Section */}
        <section className="mt-16 p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'ja' ? '関連キーワード' : language === 'vi' ? 'Từ khóa liên quan' : 'Related Keywords'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              '電動自転車', '電動アシスト自転車', '中古電動自転車', 'e-bike',
              '神戸 自転車', '大阪 電動自転車', 'パナソニック 電動自転車',
              'ヤマハ PAS', 'ブリヂストン アシスタ', '自転車 通勤',
              'xe đạp điện Nhật', 'xe đạp trợ lực', 'mua xe đạp Nhật Bản',
              'xe đạp cũ Nhật', 'Kobe xe đạp', 'Osaka bicycle',
              'electric bike Japan', 'used e-bike', 'commuter bike'
            ].map(keyword => (
              <span
                key={keyword}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition-colors"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

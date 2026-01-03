'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Bike, Zap, Trophy, Shield, Truck, CheckCircle, Star, Users, Award, TrendingUp, Search, ShoppingBag, Sparkles } from 'lucide-react'
import { productsAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/ChatWidget'
import Counter from '@/components/Counter'
import MiniGame from '@/components/MiniGame'
import { formatCurrency } from '@/lib/utils'
import { useLanguageStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguageStore()
  const t = useTranslation(language)
  
  const statsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true })
  const testimonialsInView = useInView(testimonialsRef, { once: true })

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getFeatured()
      setFeaturedProducts(response.data.data)
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryTranslations = () => {
    const titles: Record<'vi' | 'ja' | 'en', any> = {
      vi: { normal: 'Xe đạp thường', electric: 'Xe đạp trợ lực điện', sport: 'Xe đạp thể thao' },
      ja: { normal: '通常の自転車', electric: '電動アシスト自転車', sport: 'スポーツ自転車' },
      en: { normal: 'Regular Bicycles', electric: 'Electric Bicycles', sport: 'Sport Bicycles' }
    }
    const descriptions: Record<'vi' | 'ja' | 'en', any> = {
      vi: { normal: 'Tốt nhất cho sử dụng hàng ngày', electric: 'Di chuyển dễ dàng', sport: 'Hiệu suất cao' },
      ja: { normal: '日常使用に最適', electric: '楽々移動', sport: 'パフォーマンス重視' },
      en: { normal: 'Best for daily use', electric: 'Easy mobility', sport: 'Performance focused' }
    }
    return { titles: titles[language], descriptions: descriptions[language] }
  }

  const getFeatureTranslations = () => {
    const features: Record<'vi' | 'ja' | 'en', any> = {
      vi: [
        { title: 'Bảo hành đầy đủ', description: 'Bảo hành pin & motor 3 tháng' },
        { title: 'Dịch vụ giao hàng', description: 'Miễn phí giao hàng trong 20km' },
        { title: 'Đảm bảo chất lượng', description: 'Xe cũ & mới được tuyển chọn' }
      ],
      ja: [
        { title: '保証付き', description: 'バッテリー・モーター3ヶ月保証' },
        { title: '配送サービス', description: '20km以内送料無料' },
        { title: '品質保証', description: '厳選された中古・新品' }
      ],
      en: [
        { title: 'Warranty Included', description: '3-month battery & motor warranty' },
        { title: 'Delivery Service', description: 'Free shipping within 20km' },
        { title: 'Quality Guaranteed', description: 'Carefully selected used & new' }
      ]
    }
    return features[language]
  }

  const { titles: categoryTitles, descriptions: categoryDescriptions } = getCategoryTranslations()
  const featuresList = getFeatureTranslations()

  const categories = [
    {
      id: 'normal',
      title: categoryTitles.normal,
      description: categoryDescriptions.normal,
      icon: Bike,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
      href: '/products?category=normal'
    },
    {
      id: 'electric',
      title: categoryTitles.electric,
      description: categoryDescriptions.electric,
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800',
      href: '/products?category=electric'
    },
    {
      id: 'sport',
      title: categoryTitles.sport,
      description: categoryDescriptions.sport,
      icon: Trophy,
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
      href: '/products?category=sport'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: featuresList[0].title,
      description: featuresList[0].description
    },
    {
      icon: Truck,
      title: featuresList[1].title,
      description: featuresList[1].description
    },
    {
      icon: CheckCircle,
      title: featuresList[2].title,
      description: featuresList[2].description
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="relative h-[250px] sm:h-[350px] md:h-[450px] bg-gray-100 overflow-hidden">
        {/* Auto-rotating banner slider */}
        <div className="absolute inset-0">
          {[
            {
              src: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1920',
              className: 'bg-cover bg-center'
            },
            {
              src: 'https://res.cloudinary.com/dylkppwxt/image/upload/v1767440536/ffa8e3a5-60e9-4c23-ac50-20ea504f8c2e_kt3ga1.jpg',
              className: 'bg-contain bg-center bg-no-repeat bg-[#ffeb3b]' // Yellow background to match banner
            }
          ].map((slide, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 ${slide.className}`}
              style={{ backgroundImage: `url(${slide.src})` }}
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ 
                opacity: [1, 1, 0, 0, 1],
                transition: {
                  duration: 8,
                  repeat: Infinity,
                  delay: index * 4,
                  times: [0, 0.4, 0.5, 0.9, 1]
                }
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-start pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-lg">
              {t('home.title')}
            </h1>
            <p className="text-2xl md:text-3xl text-primary-600 mb-4 font-semibold drop-shadow-md">
              {t('home.subtitle')}
            </p>
            <p className="text-lg text-gray-800 mb-8 drop-shadow-md">
              {t('home.description')}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gray-700 text-white rounded-lg text-lg font-semibold hover:bg-gray-800 hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
            >
              {t('home.viewProducts')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.categories')}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'vi' ? 'Chọn chiếc xe đạp phù hợp với nhu cầu của bạn' : 
               language === 'ja' ? 'ニーズに合った自転車をお選びください' : 
               'Choose the right bicycle for your needs'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={category.href}>
                    <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover-lift cursor-pointer">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <Icon className="w-12 h-12 text-white mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.title}
                        </h3>
                        <p className="text-gray-200">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'vi' ? 'Tại sao chọn HBike Japan?' : 
               language === 'ja' ? 'なぜHBike Japanを選ぶのか？' : 
               'Why Choose HBike Japan?'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'vi' ? 'Chúng tôi mang đến trải nghiệm mua sắm xe đạp tốt nhất với dịch vụ chuyên nghiệp' :
               language === 'ja' ? '最高の自転車ショッピング体験をプロフェッショナルなサービスで提供します' :
               'We bring you the best bicycle shopping experience with professional service'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                    className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-6 shadow-md"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-20 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: 500, suffix: '+', label: language === 'vi' ? 'Khách hàng hài lòng' : language === 'ja' ? '満足した顧客' : 'Happy Customers', icon: Users },
              { number: 1000, suffix: '+', label: language === 'vi' ? 'Xe đã bán' : language === 'ja' ? '販売済み自転車' : 'Bikes Sold', icon: Bike },
              { number: 98, suffix: '%', label: language === 'vi' ? 'Đánh giá tích cực' : language === 'ja' ? 'ポジティブレビュー' : 'Positive Reviews', icon: Star },
              { number: 3, suffix: '+', label: language === 'vi' ? 'Năm kinh nghiệm' : language === 'ja' ? '年の経験' : 'Years Experience', icon: Award }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-gray-700 drop-shadow-sm" />
                  
                  <div className="text-5xl md:text-6xl font-black mb-2 text-gray-900 drop-shadow-sm">
                    {statsInView && <Counter value={stat.number} />}
                    {stat.suffix}
                  </div>

                  <div className="text-sky-600 font-bold text-sm md:text-base uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'vi' ? 'Quy trình mua hàng đơn giản' :
               language === 'ja' ? 'シンプルな購入プロセス' :
               'Simple Purchase Process'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'vi' ? 'Chỉ với 3 bước đơn giản' :
               language === 'ja' ? 'たった3つの簡単なステップ' :
               'Just 3 simple steps'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { 
                step: '01',
                icon: Search,
                title: language === 'vi' ? 'Tìm kiếm' : language === 'ja' ? '検索' : 'Search',
                desc: language === 'vi' ? 'Duyệt và chọn xe đạp phù hợp' : language === 'ja' ? '最適な自転車を探す' : 'Browse and find your bike'
              },
              {
                step: '02',
                icon: ShoppingBag,
                title: language === 'vi' ? 'Đặt hàng' : language === 'ja' ? '注文' : 'Order',
                desc: language === 'vi' ? 'Thêm vào giỏ và thanh toán' : language === 'ja' ? 'カートに追加して支払い' : 'Add to cart and checkout'
              },
              {
                step: '03',
                icon: Truck,
                title: language === 'vi' ? 'Nhận hàng' : language === 'ja' ? '受け取り' : 'Receive',
                desc: language === 'vi' ? 'Giao hàng tận nơi nhanh chóng' : language === 'ja' ? '迅速な配送' : 'Fast delivery to your door'
              }
            ].map((process, index) => {
              const Icon = process.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-primary-300 rounded-2xl p-8 text-center hover:shadow-xl hover:border-primary-500 hover:from-primary-50 transition-all">
                    <div className="text-6xl font-bold text-primary-600 mb-4 drop-shadow-sm">{process.step}</div>
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{process.title}</h3>
                    <p className="text-gray-800 leading-relaxed font-medium">{process.desc}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-primary-300" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <Sparkles className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'vi' ? 'Sản phẩm nổi bật' : 
                 language === 'ja' ? 'おすすめ商品' : 
                 'Featured Products'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'vi' ? 'Những chiếc xe đạp chất lượng cao được tuyển chọn kỹ lưỡng' : 
                 language === 'ja' ? '厳選された高品質な自転車' : 
                 'Carefully selected high-quality bicycles'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
                      <div className="relative h-64 bg-gray-200 overflow-hidden">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-medium shadow-lg">
                          {product.condition === 'new' ? t('products.new') : t('products.used')}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {language === 'ja' && product.nameJa ? product.nameJa : 
                           language === 'en' && product.nameEn ? product.nameEn : 
                           product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary-600">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {language === 'vi' ? 'Tình trạng' : 
                             language === 'ja' ? '状態' : 
                             'Condition'}: {product.conditionPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
              >
                {language === 'vi' ? 'Xem tất cả sản phẩm' : 
                 language === 'ja' ? 'すべての製品を見る' : 
                 'View All Products'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <section ref={testimonialsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'vi' ? 'Khách hàng nói gì về chúng tôi' :
               language === 'ja' ? 'お客様の声' :
               'What Our Customers Say'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: language === 'vi' ? 'Nguyễn Văn A' : language === 'ja' ? '田中太郎' : 'John Doe',
                role: language === 'vi' ? 'Sinh viên' : language === 'ja' ? '学生' : 'Student',
                content: language === 'vi' ? 'Xe đạp chất lượng tốt, giá cả phải chăng. Dịch vụ giao hàng nhanh chóng!' :
                         language === 'ja' ? '品質の良い自転車で、手頃な価格です。配送も速い！' :
                         'Good quality bikes at affordable prices. Fast delivery!',
                rating: 5
              },
              {
                name: language === 'vi' ? 'Trần Thị B' : language === 'ja' ? '佐藤花子' : 'Jane Smith',
                role: language === 'vi' ? 'Nhân viên văn phòng' : language === 'ja' ? '会社員' : 'Office Worker',
                content: language === 'vi' ? 'Tôi rất hài lòng với chiếc xe điện đã mua. Đội ngũ tư vấn nhiệt tình!' :
                         language === 'ja' ? '電動自転車に大満足です。スタッフも親切です！' :
                         'Very satisfied with my electric bike. Helpful staff!',
                rating: 5
              },
              {
                name: language === 'vi' ? 'Lê Văn C' : language === 'ja' ? '鈴木一郎' : 'Mike Johnson',
                role: language === 'vi' ? 'Người cao tuổi' : language === 'ja' ? 'シニア' : 'Senior',
                content: language === 'vi' ? 'Xe dễ sử dụng, phù hợp với người lớn tuổi. Cảm ơn HBike Japan!' :
                         language === 'ja' ? '使いやすく、高齢者に最適です。ありがとう！' :
                         'Easy to use, perfect for seniors. Thank you HBike Japan!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={testimonialsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 rounded-xl p-8 relative"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {language === 'vi' ? 'Sẵn sàng tìm chiếc xe đạp hoàn hảo?' :
               language === 'ja' ? '完璧な自転車を見つけませんか？' :
               'Ready to Find Your Perfect Bike?'}
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              {language === 'vi' ? 'Khám phá bộ sưu tập xe đạp đa dạng của chúng tôi ngay hôm nay' :
               language === 'ja' ? '今日、多様な自転車コレクションをご覧ください' :
               'Explore our diverse collection of bicycles today'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
              >
                {language === 'vi' ? 'Xem sản phẩm' :
                 language === 'ja' ? '製品を見る' :
                 'View Products'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
              >
                {language === 'vi' ? 'Liên hệ tư vấn' :
                 language === 'ja' ? 'お問い合わせ' :
                 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
      <MiniGame />
    </div>
  )
}

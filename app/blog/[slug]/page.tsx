'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, Tag, Share2, Facebook, Twitter } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguageStore } from '@/lib/store'

const blogContent: Record<string, any> = {
  'electric-bike-guide-japan': {
    title: {
      ja: '電動アシスト自転車の選び方ガイド｜初心者向け完全解説',
      vi: 'Hướng dẫn chọn xe đạp trợ lực điện tại Nhật Bản cho người mới',
      en: 'Complete Guide to Choosing Electric Assist Bicycles in Japan'
    },
    date: '2026-01-05',
    readTime: 10,
    tags: ['電動自転車', '選び方', 'xe đạp điện', 'hướng dẫn'],
    content: {
      ja: `
## 電動アシスト自転車とは？

電動アシスト自転車は、ペダルを漕ぐ力をモーターがサポートしてくれる自転車です。日本では「電動自転車」や「電チャリ」とも呼ばれています。

### 電動アシスト自転車のメリット

1. **坂道が楽々** - 神戸のような坂の多い街でも快適に走行できます
2. **通勤・通学に最適** - 汗をかかずに目的地に到着
3. **買い物に便利** - 重い荷物を載せても楽に漕げます
4. **環境にやさしい** - CO2排出ゼロで地球に優しい

### バッテリー容量の選び方

| 容量 | 走行距離目安 | おすすめ用途 |
|------|-------------|-------------|
| 8Ah | 約30km | 近距離通勤 |
| 12Ah | 約50km | 一般的な通勤 |
| 16Ah | 約70km | 長距離・坂道多い |

### 価格帯の目安

- **エントリーモデル**: 8万円〜12万円
- **スタンダードモデル**: 12万円〜18万円
- **ハイエンドモデル**: 18万円〜30万円

### 中古電動自転車という選択肢

新品の半額以下で購入できる中古電動自転車もおすすめです。HBIKEでは品質チェック済みの中古電動自転車を多数取り揃えています。

## まとめ

電動アシスト自転車を選ぶ際は、以下のポイントを確認しましょう：

- 使用目的に合ったバッテリー容量
- 乗り心地とフレームサイズ
- アフターサービスの充実度
- 価格と品質のバランス

ご不明な点がありましたら、お気軽にHBIKEまでご相談ください。
      `,
      vi: `
## Xe đạp trợ lực điện là gì?

Xe đạp trợ lực điện (電動アシスト自転車) là loại xe đạp có motor hỗ trợ khi bạn đạp. Tại Nhật, loại xe này rất phổ biến và được gọi là "denki jitensha" hoặc "denchari".

### Ưu điểm của xe đạp trợ lực điện

1. **Leo dốc dễ dàng** - Phù hợp với địa hình đồi núi như Kobe
2. **Lý tưởng cho đi làm/đi học** - Đến nơi mà không đổ mồ hôi
3. **Tiện lợi khi mua sắm** - Chở đồ nặng vẫn đạp nhẹ nhàng
4. **Thân thiện môi trường** - Không phát thải CO2

### Cách chọn dung lượng pin

| Dung lượng | Quãng đường | Mục đích sử dụng |
|------------|-------------|------------------|
| 8Ah | ~30km | Đi làm gần |
| 12Ah | ~50km | Đi làm thông thường |
| 16Ah | ~70km | Đường dài, nhiều dốc |

### Mức giá tham khảo

- **Dòng cơ bản**: 80,000 - 120,000 yên
- **Dòng tiêu chuẩn**: 120,000 - 180,000 yên
- **Dòng cao cấp**: 180,000 - 300,000 yên

### Lựa chọn xe đạp điện cũ

Xe đạp điện cũ có thể rẻ hơn 50% so với xe mới. HBIKE cung cấp nhiều xe đạp điện cũ đã được kiểm tra chất lượng.

## Kết luận

Khi chọn xe đạp trợ lực điện, hãy lưu ý:

- Dung lượng pin phù hợp với nhu cầu
- Kích thước khung và sự thoải mái
- Dịch vụ hậu mãi
- Cân bằng giữa giá và chất lượng

Nếu có thắc mắc, hãy liên hệ HBIKE để được tư vấn.
      `,
      en: `
## What is an Electric Assist Bicycle?

An electric assist bicycle (電動アシスト自転車) is a bicycle with a motor that supports your pedaling. In Japan, they're commonly called "denki jitensha" or "denchari".

### Benefits of Electric Assist Bicycles

1. **Easy hill climbing** - Perfect for hilly cities like Kobe
2. **Ideal for commuting** - Arrive without breaking a sweat
3. **Convenient for shopping** - Carry heavy loads easily
4. **Eco-friendly** - Zero CO2 emissions

### How to Choose Battery Capacity

| Capacity | Range | Recommended Use |
|----------|-------|-----------------|
| 8Ah | ~30km | Short commute |
| 12Ah | ~50km | Standard commute |
| 16Ah | ~70km | Long distance, hilly |

### Price Range Guide

- **Entry-level**: ¥80,000 - ¥120,000
- **Standard**: ¥120,000 - ¥180,000
- **High-end**: ¥180,000 - ¥300,000

### Consider Used Electric Bikes

Used electric bikes can cost less than half of new ones. HBIKE offers quality-checked used electric bikes.

## Summary

When choosing an electric assist bicycle, consider:

- Battery capacity suitable for your needs
- Frame size and comfort
- After-sales service
- Balance between price and quality

Contact HBIKE for any questions.
      `
    }
  },
  'used-electric-bike-benefits': {
    title: {
      ja: '中古電動自転車のメリット｜新品との違いと賢い選び方',
      vi: 'Lợi ích của xe đạp điện cũ tại Nhật｜So sánh với xe mới',
      en: 'Benefits of Used Electric Bikes | Smart Buying Guide'
    },
    date: '2026-01-03',
    readTime: 8,
    tags: ['中古自転車', 'お得', 'xe cũ', 'tiết kiệm'],
    content: {
      ja: `
## なぜ中古電動自転車がおすすめなのか？

新品の電動自転車は10万円〜30万円と高額ですが、中古なら3万円〜10万円で購入できます。

### 中古電動自転車のメリット

1. **価格が安い** - 新品の30%〜50%の価格
2. **品質が良い** - 日本製は耐久性が高い
3. **環境にやさしい** - リユースでエコ
4. **すぐに使える** - 整備済みで納車

### 購入前のチェックポイント

- バッテリーの残量・劣化具合
- タイヤの溝の深さ
- ブレーキの効き具合
- フレームのサビや傷

### HBIKEの中古電動自転車

当店では全ての中古電動自転車を：

- 専門スタッフが点検
- 必要な部品を交換
- 清掃・整備を実施
- 保証付きで販売

安心してお買い求めいただけます。
      `,
      vi: `
## Tại sao nên mua xe đạp điện cũ?

Xe đạp điện mới có giá từ 100,000 - 300,000 yên, nhưng xe cũ chỉ từ 30,000 - 100,000 yên.

### Ưu điểm của xe đạp điện cũ

1. **Giá rẻ** - Chỉ 30-50% giá xe mới
2. **Chất lượng tốt** - Xe Nhật bền bỉ
3. **Thân thiện môi trường** - Tái sử dụng
4. **Sẵn sàng sử dụng** - Đã bảo dưỡng

### Kiểm tra trước khi mua

- Dung lượng và độ chai pin
- Độ mòn lốp
- Hiệu quả phanh
- Gỉ sét và trầy xước khung

### Xe đạp điện cũ tại HBIKE

Tất cả xe cũ tại cửa hàng đều được:

- Kiểm tra bởi kỹ thuật viên
- Thay thế linh kiện cần thiết
- Vệ sinh và bảo dưỡng
- Bán kèm bảo hành

Yên tâm mua sắm tại HBIKE.
      `,
      en: `
## Why Choose Used Electric Bikes?

New electric bikes cost ¥100,000 - ¥300,000, but used ones are only ¥30,000 - ¥100,000.

### Benefits of Used Electric Bikes

1. **Affordable** - 30-50% of new price
2. **Good quality** - Japanese bikes are durable
3. **Eco-friendly** - Reuse and recycle
4. **Ready to ride** - Already serviced

### Pre-purchase Checklist

- Battery capacity and degradation
- Tire tread depth
- Brake effectiveness
- Frame rust and scratches

### Used Electric Bikes at HBIKE

All our used bikes are:

- Inspected by technicians
- Parts replaced as needed
- Cleaned and serviced
- Sold with warranty

Shop with confidence at HBIKE.
      `
    }
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const { language } = useLanguageStore()
  const slug = params.slug as string
  const post = blogContent[slug]

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      backToBlog: { ja: 'ブログ一覧に戻る', vi: 'Quay lại blog', en: 'Back to blog' },
      minRead: { ja: '分で読める', vi: 'phút đọc', en: 'min read' },
      share: { ja: 'シェアする', vi: 'Chia sẻ', en: 'Share' },
      relatedPosts: { ja: '関連記事', vi: 'Bài viết liên quan', en: 'Related Posts' },
      notFound: { ja: '記事が見つかりませんでした', vi: 'Không tìm thấy bài viết', en: 'Article not found' }
    }
    return texts[key]?.[language] || texts[key]?.ja || key
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{getText('notFound')}</h1>
          <Link href="/blog" className="text-primary-600 hover:underline">
            {getText('backToBlog')}
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {getText('backToBlog')}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">🚲</span>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'vi' ? 'vi-VN' : 'en-US')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} {getText('minRead')}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {post.title[language as keyof typeof post.title]}
            </h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600"
              dangerouslySetInnerHTML={{ 
                __html: post.content[language as keyof typeof post.content]?.replace(/\n/g, '<br>') || '' 
              }}
            />

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">{getText('share')}:</span>
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'ja' ? '電動自転車をお探しですか？' : language === 'vi' ? 'Bạn đang tìm xe đạp điện?' : 'Looking for an Electric Bike?'}
          </h2>
          <p className="mb-6 text-white/90">
            {language === 'ja' ? 'HBIKEでは高品質な中古電動自転車を多数取り揃えています。' : language === 'vi' ? 'HBIKE có nhiều xe đạp điện cũ chất lượng cao.' : 'HBIKE offers many high-quality used electric bikes.'}
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            {language === 'ja' ? '商品を見る' : language === 'vi' ? 'Xem sản phẩm' : 'View Products'}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ClientProviders from '@/components/ClientProviders'

const notoSans = Noto_Sans({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans',
})

export const metadata: Metadata = {
  title: 'HBike Japan - 電動アシスト自転車専門店',
  description: '高品質な電動アシスト自転車を販売。学生、通勤者、高齢者向けのお手頃価格の自転車',
  keywords: '電動アシスト自転車, 自転車, 日本, electric bike, bicycle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={notoSans.variable}>
        <ClientProviders>
          {children}
        </ClientProviders>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

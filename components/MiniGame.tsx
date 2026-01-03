'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, X, Sparkles, Copy, Check, Star, Zap, Trophy, PartyPopper } from 'lucide-react'
import { miniGameAPI } from '@/lib/api'
import { useLanguageStore } from '@/lib/store'
import toast from 'react-hot-toast'

// i18n translations for MiniGame
const translations: Record<string, Record<string, string>> = {
  title: {
    vi: 'VÒNG QUAY MAY MẮN',
    ja: 'ラッキースピン',
    en: 'LUCKY SPIN'
  },
  subtitle: {
    vi: 'Quay ngay để nhận mã giảm giá',
    ja: '回してクーポンをゲット',
    en: 'Spin to get discount codes'
  },
  realDiscount: {
    vi: 'THẬT 100%',
    ja: '本物100%',
    en: '100% REAL'
  },
  freeSpinDaily: {
    vi: 'Mỗi ngày bạn được quay 1 lần miễn phí',
    ja: '毎日1回無料で回せます',
    en: 'One free spin per day'
  },
  spinNow: {
    vi: 'QUAY NGAY - MIỄN PHÍ!',
    ja: '今すぐ回す - 無料!',
    en: 'SPIN NOW - FREE!'
  },
  spinning: {
    vi: 'ĐANG QUAY...',
    ja: '回転中...',
    en: 'SPINNING...'
  },
  seeTomorrow: {
    vi: 'HẸN GẶP LẠI NGÀY MAI!',
    ja: 'また明日!',
    en: 'SEE YOU TOMORROW!'
  },
  congratulations: {
    vi: 'CHÚC MỪNG BẠN!',
    ja: 'おめでとうございます!',
    en: 'CONGRATULATIONS!'
  },
  yourCoupon: {
    vi: 'MÃ GIẢM GIÁ CỦA BẠN',
    ja: 'あなたのクーポン',
    en: 'YOUR COUPON CODE'
  },
  yourPrize: {
    vi: 'PHẦN THƯỞNG CỦA BẠN',
    ja: 'あなたの賞品',
    en: 'YOUR PRIZE'
  },
  validUntil: {
    vi: 'Có hiệu lực đến',
    ja: '有効期限',
    en: 'Valid until'
  },
  codeSaved: {
    vi: 'Mã đã được lưu vào hệ thống, sử dụng khi thanh toán!',
    ja: 'コードがシステムに保存されました。お支払い時にご使用ください!',
    en: 'Code saved! Use it at checkout!'
  },
  contactStore: {
    vi: 'Liên hệ cửa hàng để nhận quà khi mua hàng',
    ja: 'ご購入時に店舗で景品をお受け取りください',
    en: 'Contact store to receive gift with purchase'
  },
  tryAgain: {
    vi: 'Chúc may mắn lần sau!',
    ja: 'また次回!',
    en: 'Better luck next time!'
  },
  comeBackTomorrow: {
    vi: 'Quay lại vào ngày mai để thử vận may nhé!',
    ja: '明日また挑戦してください!',
    en: 'Come back tomorrow to try again!'
  },
  tip: {
    vi: 'Mẹo: Mã giảm giá có thể áp dụng cho tất cả sản phẩm',
    ja: 'ヒント: クーポンは全商品に使用できます',
    en: 'Tip: Coupon can be applied to all products'
  },
  floatingText: {
    vi: 'Quay số trúng thưởng!',
    ja: '回して当てよう!',
    en: 'Spin to win!'
  },
  copied: {
    vi: 'Đã sao chép mã giảm giá!',
    ja: 'コードをコピーしました!',
    en: 'Coupon code copied!'
  },
  wonPrize: {
    vi: 'Chúc mừng bạn đã trúng thưởng!',
    ja: 'おめでとうございます!当選しました!',
    en: 'Congratulations! You won!'
  },
  error: {
    vi: 'Có lỗi xảy ra, vui lòng thử lại!',
    ja: 'エラーが発生しました。もう一度お試しください。',
    en: 'An error occurred, please try again!'
  }
}

interface Prize {
  id: number
  name: string
  nameVi: string
  color: string
  type?: string
  discount?: number
}

interface SpinResult {
  prize: Prize
  coupon?: {
    code: string
    validUntil: string
    description: string
  }
  message: string
}

// Confetti component for celebration effect
function Confetti({ isActive }: { isActive: boolean }) {
  if (!isActive) return null
  
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][Math.floor(Math.random() * 8)],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3"
          style={{
            left: `${piece.left}%`,
            top: -20,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            transform: `rotate(${Math.random() * 360}deg)`
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: 600,
            opacity: [1, 1, 0],
            rotate: 720,
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  )
}

// Glowing orbs background
function GlowingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: 100 + Math.random() * 150,
            height: 100 + Math.random() * 150,
            background: `radial-gradient(circle, ${['#FFD700', '#FF6B6B', '#4ECDC4', '#8B5CF6', '#EC4899', '#10B981'][i]} 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function MiniGame() {
  const { language } = useLanguageStore()
  const t = (key: string) => translations[key]?.[language] || translations[key]?.vi || key
  
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [copied, setCopied] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Check if user has played today
    const lastPlayed = localStorage.getItem('miniGameLastPlayed')
    if (lastPlayed) {
      const lastPlayedDate = new Date(lastPlayed).toDateString()
      const today = new Date().toDateString()
      if (lastPlayedDate === today) {
        setHasPlayed(true)
      }
    }

    fetchWheelConfig()
  }, [])

  const fetchWheelConfig = async () => {
    try {
      const response = await miniGameAPI.getWheelConfig()
      setPrizes(response.data.data.prizes)
    } catch (error) {
      console.error('Error fetching wheel config:', error)
      setPrizes([
        { id: 1, name: '5% 割引', nameVi: 'Giảm 5%', color: '#10b981', discount: 5 },
        { id: 2, name: '10% 割引', nameVi: 'Giảm 10%', color: '#3b82f6', discount: 10 },
        { id: 3, name: '15% 割引', nameVi: 'Giảm 15%', color: '#8b5cf6', discount: 15 },
        { id: 4, name: '20% 割引', nameVi: 'Giảm 20%', color: '#f59e0b', discount: 20 },
        { id: 5, name: '送料無料', nameVi: 'Freeship', color: '#ec4899', type: 'freeship' },
        { id: 6, name: 'ステッカー', nameVi: 'Sticker', color: '#6366f1', type: 'gift' },
        { id: 7, name: '次回挑戦', nameVi: 'May mắn lần sau', color: '#64748b', type: 'none' }
      ])
    }
  }

  const spinWheel = async () => {
    if (isSpinning || hasPlayed) return

    setIsSpinning(true)
    setResult(null)

    try {
      const response = await miniGameAPI.spinWheel()
      const spinResult = response.data.data as SpinResult

      // Calculate rotation to land on the prize
      const prizeIndex = prizes.findIndex(p => p.id === spinResult.prize.id)
      const segmentAngle = 360 / prizes.length
      const prizeAngle = prizeIndex * segmentAngle
      const extraSpins = 6 * 360 // 6 full rotations for more drama
      const finalRotation = rotation + extraSpins + (360 - prizeAngle) + segmentAngle / 2

      setRotation(finalRotation)

      // Show result after animation
      setTimeout(() => {
        setResult(spinResult)
        setIsSpinning(false)
        setHasPlayed(true)
        localStorage.setItem('miniGameLastPlayed', new Date().toISOString())
        
        // Show confetti for any winning prize (not 'none' type)
        if (spinResult.prize.type !== 'none') {
          setShowConfetti(true)
          toast.success(`🎉 ${t('wonPrize')}`)
          setTimeout(() => setShowConfetti(false), 4000)
        }
      }, 5500)
    } catch (error) {
      console.error('Error spinning wheel:', error)
      setIsSpinning(false)
      toast.error(t('error'))
    }
  }

  const copyCode = useCallback(() => {
    if (result?.coupon?.code) {
      navigator.clipboard.writeText(result.coupon.code)
      setCopied(true)
      toast.success(t('copied'))
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result, t])

  const segmentAngle = prizes.length > 0 ? 360 / prizes.length : 45

  // Prize icon based on type
  const getPrizeIcon = (prize: Prize) => {
    if (prize.type === 'freeship') return '🚚'
    if (prize.type === 'gift') return '🎁'
    if (prize.type === 'none') return '🍀'
    return '💰'
  }

  return (
    <>
      {/* Floating button with enhanced animation */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
          
          {/* Main button */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center border-2 border-yellow-300">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Gift className="w-7 h-7 text-white drop-shadow-lg" />
            </motion.div>
          </div>
          
          {/* Notification badge */}
          <motion.span 
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🎰
          </motion.span>
          
          {/* Floating text */}
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
          >
            <Sparkles className="w-3 h-3 inline mr-1 text-yellow-400" />
            {t('floatingText')}
          </motion.div>
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => !isSpinning && setIsOpen(false)}
          >
            {/* Backdrop with blur */}
            <motion.div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-purple-500/30 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background effects */}
              <GlowingOrbs />
              <Confetti isActive={showConfetti} />
              
              {/* Stars decoration */}
              <div className="absolute top-4 left-4 text-yellow-400 opacity-50">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="absolute top-8 right-8 text-yellow-400 opacity-30">
                <Star className="w-3 h-3 fill-current" />
              </div>
              <div className="absolute bottom-12 left-6 text-yellow-400 opacity-40">
                <Star className="w-3 h-3 fill-current" />
              </div>

              {/* Close button */}
              <button 
                onClick={() => !isSpinning && setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                disabled={isSpinning}
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Header */}
              <div className="relative text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500">
                      {t('title')}
                    </h2>
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </div>
                </motion.div>
                <p className="text-purple-200 text-sm">
                  🎯 {t('subtitle')} <span className="text-yellow-400 font-bold">{t('realDiscount')}</span>!
                </p>
                <p className="text-purple-300/70 text-xs mt-1">
                  {t('freeSpinDaily')}
                </p>
              </div>

              {/* Wheel container */}
              <div className="relative w-72 h-72 mx-auto mb-8">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-spin-slow opacity-50 blur-xl" style={{ animationDuration: '10s' }} />
                
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400/50 animate-pulse" />
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <motion.div 
                    className="relative"
                    animate={isSpinning ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
                  >
                    <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-2xl" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-yellow-300" />
                  </motion.div>
                </div>

                {/* Wheel */}
                <motion.div
                  ref={wheelRef}
                  className="absolute inset-3 rounded-full shadow-2xl overflow-hidden"
                  style={{ 
                    rotate: rotation,
                    transition: isSpinning ? 'transform 5.5s cubic-bezier(0.17, 0.67, 0.05, 0.99)' : 'none',
                    boxShadow: '0 0 60px rgba(251, 191, 36, 0.4), inset 0 0 30px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Wheel border */}
                  <div className="absolute inset-0 rounded-full border-8 border-gradient-to-r from-yellow-400 to-orange-500 z-10 pointer-events-none" 
                       style={{ borderColor: '#fbbf24' }} />
                  
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      {prizes.map((prize, index) => (
                        <linearGradient key={`grad-${prize.id}`} id={`gradient-${prize.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={prize.color} />
                          <stop offset="100%" stopColor={`${prize.color}dd`} />
                        </linearGradient>
                      ))}
                    </defs>
                    
                    {prizes.map((prize, index) => {
                      const startAngle = index * segmentAngle
                      const endAngle = (index + 1) * segmentAngle
                      const startRad = (startAngle - 90) * (Math.PI / 180)
                      const endRad = (endAngle - 90) * (Math.PI / 180)
                      
                      const x1 = 50 + 48 * Math.cos(startRad)
                      const y1 = 50 + 48 * Math.sin(startRad)
                      const x2 = 50 + 48 * Math.cos(endRad)
                      const y2 = 50 + 48 * Math.sin(endRad)
                      
                      const largeArc = segmentAngle > 180 ? 1 : 0
                      
                      const textAngle = startAngle + segmentAngle / 2
                      const textRad = (textAngle - 90) * (Math.PI / 180)
                      const textX = 50 + 32 * Math.cos(textRad)
                      const textY = 50 + 32 * Math.sin(textRad)

                      return (
                        <g key={prize.id}>
                          <path
                            d={`M 50 50 L ${x1} ${y1} A 48 48 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={`url(#gradient-${prize.id})`}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="0.5"
                          />
                          {/* Icon */}
                          <text
                            x={50 + 20 * Math.cos(textRad)}
                            y={50 + 20 * Math.sin(textRad)}
                            fontSize="6"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {getPrizeIcon(prize)}
                          </text>
                          {/* Text */}
                          <text
                            x={textX}
                            y={textY}
                            fill="white"
                            fontSize="4.5"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                          >
                            {prize.nameVi}
                          </text>
                        </g>
                      )
                    })}
                    
                    {/* Center button */}
                    <circle cx="50" cy="50" r="12" fill="url(#centerGradient)" stroke="#fbbf24" strokeWidth="3" />
                    <defs>
                      <radialGradient id="centerGradient">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </radialGradient>
                    </defs>
                    <text x="50" y="51" fill="#92400e" fontSize="6" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
                      SPIN
                    </text>
                  </svg>
                </motion.div>
              </div>

              {/* Spin button or result */}
              <div className="relative z-10">
                {!result ? (
                  <motion.button
                    onClick={spinWheel}
                    disabled={isSpinning || hasPlayed}
                    className={`w-full py-5 rounded-2xl font-black text-xl transition-all relative overflow-hidden ${
                      isSpinning || hasPlayed
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl hover:shadow-orange-500/50'
                    }`}
                    whileHover={!isSpinning && !hasPlayed ? { scale: 1.02 } : {}}
                    whileTap={!isSpinning && !hasPlayed ? { scale: 0.98 } : {}}
                  >
                    {/* Shimmer effect */}
                    {!isSpinning && !hasPlayed && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                    )}
                    
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSpinning ? (
                        <>
                          <motion.span 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                            className="text-2xl"
                          >
                            🎡
                          </motion.span>
                          {t('spinning')}
                        </>
                      ) : hasPlayed ? (
                        <>
                          <span className="text-2xl">⏰</span>
                          {t('seeTomorrow')}
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">🎰</span>
                          {t('spinNow')}
                          <span className="text-2xl">🎰</span>
                        </>
                      )}
                    </span>
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
                  >
                    {result.prize.type === 'none' ? (
                      /* No prize - try again */
                      <>
                        <div className="text-4xl mb-3">🍀</div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('tryAgain')}</h3>
                        <p className="text-white/70 text-sm">{t('comeBackTomorrow')}</p>
                      </>
                    ) : result.prize.type === 'gift' ? (
                      /* Physical gift prize */
                      <>
                        <motion.div 
                          className="text-5xl mb-3"
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          🎁
                        </motion.div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-2">
                          {t('congratulations')}
                        </h3>
                        <p className="text-white/90 mb-4">{result.message}</p>
                        
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border-2 border-dashed border-purple-400/50">
                          <p className="text-purple-300 text-sm mb-2 flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4" />
                            {t('yourPrize')}
                          </p>
                          <div className="text-2xl font-bold text-white">
                            {language === 'ja' ? result.prize.name : result.prize.nameVi}
                          </div>
                          <p className="text-white/60 text-xs mt-3">
                            🏪 {t('contactStore')}
                          </p>
                        </div>
                      </>
                    ) : result.coupon ? (
                      /* Discount/Freeship coupon prize */
                      <>
                        <motion.div 
                          className="text-5xl mb-3"
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          🎊
                        </motion.div>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-2">
                          {t('congratulations')}
                        </h3>
                        <p className="text-white/90 mb-4">{result.message}</p>
                        
                        {/* Coupon code display */}
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border-2 border-dashed border-yellow-400/50">
                          <p className="text-yellow-300 text-sm mb-2 flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4" />
                            {t('yourCoupon')}
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <code className="text-3xl font-mono font-black text-white tracking-wider bg-black/30 px-4 py-2 rounded-lg">
                              {result.coupon.code}
                            </code>
                            <motion.button
                              onClick={copyCode}
                              className="p-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl transition-colors shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {copied ? (
                                <Check className="w-5 h-5 text-white" />
                              ) : (
                                <Copy className="w-5 h-5 text-white" />
                              )}
                            </motion.button>
                          </div>
                          <p className="text-white/60 text-xs mt-3 flex items-center justify-center gap-1">
                            ⏰ {t('validUntil')}: {new Date(result.coupon.validUntil).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'vi-VN')}
                          </p>
                        </div>
                        
                        <p className="text-green-400 text-sm mt-4 flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          {t('codeSaved')}
                        </p>
                      </>
                    ) : (
                      /* Fallback */
                      <>
                        <div className="text-4xl mb-3">🍀</div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('tryAgain')}</h3>
                        <p className="text-white/70 text-sm">{t('comeBackTomorrow')}</p>
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer info */}
              <div className="mt-4 text-center">
                <p className="text-purple-300/60 text-xs">
                  💡 {t('tip')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

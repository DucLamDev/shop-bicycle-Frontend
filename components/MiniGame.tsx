'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, X, Sparkles, Copy, Check } from 'lucide-react'
import { miniGameAPI } from '@/lib/api'
import toast from 'react-hot-toast'

interface Prize {
  id: number
  name: string
  nameVi: string
  color: string
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

export default function MiniGame() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [copied, setCopied] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

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

    // Fetch wheel config
    fetchWheelConfig()
  }, [])

  const fetchWheelConfig = async () => {
    try {
      const response = await miniGameAPI.getWheelConfig()
      setPrizes(response.data.data.prizes)
    } catch (error) {
      console.error('Error fetching wheel config:', error)
      // Default prizes if API fails
      setPrizes([
        { id: 1, name: '5% OFF', nameVi: 'Giảm 5%', color: '#10b981' },
        { id: 2, name: '10% OFF', nameVi: 'Giảm 10%', color: '#3b82f6' },
        { id: 3, name: '15% OFF', nameVi: 'Giảm 15%', color: '#8b5cf6' },
        { id: 4, name: '20% OFF', nameVi: 'Giảm 20%', color: '#f59e0b' },
        { id: 5, name: 'FREE SHIP', nameVi: 'Freeship', color: '#ec4899' },
        { id: 6, name: 'GIFT', nameVi: 'Quà tặng', color: '#6366f1' },
        { id: 7, name: 'TRY AGAIN', nameVi: 'Thử lại', color: '#9ca3af' }
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
      const extraSpins = 5 * 360 // 5 full rotations
      const finalRotation = rotation + extraSpins + (360 - prizeAngle) + segmentAngle / 2

      setRotation(finalRotation)

      // Show result after animation
      setTimeout(() => {
        setResult(spinResult)
        setIsSpinning(false)
        setHasPlayed(true)
        localStorage.setItem('miniGameLastPlayed', new Date().toISOString())
        
        if (spinResult.coupon) {
          toast.success('🎉 ' + spinResult.message)
        }
      }, 5000)
    } catch (error) {
      console.error('Error spinning wheel:', error)
      setIsSpinning(false)
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  const copyCode = () => {
    if (result?.coupon?.code) {
      navigator.clipboard.writeText(result.coupon.code)
      setCopied(true)
      toast.success('Đã sao chép mã!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const segmentAngle = prizes.length > 0 ? 360 / prizes.length : 45

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ rotate: 15 }}
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <Gift className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
          !
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => !isSpinning && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Vòng quay may mắn
                </h2>
                <button 
                  onClick={() => !isSpinning && setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                  disabled={isSpinning}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-6 text-center">
                Quay để nhận mã giảm giá đặc biệt! Mỗi ngày chỉ được quay 1 lần.
              </p>

              {/* Wheel */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
                </div>

                {/* Wheel */}
                <motion.div
                  ref={wheelRef}
                  className="w-full h-full rounded-full border-8 border-yellow-400 shadow-xl overflow-hidden"
                  style={{ 
                    rotate: rotation,
                    transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {prizes.map((prize, index) => {
                      const startAngle = index * segmentAngle
                      const endAngle = (index + 1) * segmentAngle
                      const startRad = (startAngle - 90) * (Math.PI / 180)
                      const endRad = (endAngle - 90) * (Math.PI / 180)
                      
                      const x1 = 50 + 50 * Math.cos(startRad)
                      const y1 = 50 + 50 * Math.sin(startRad)
                      const x2 = 50 + 50 * Math.cos(endRad)
                      const y2 = 50 + 50 * Math.sin(endRad)
                      
                      const largeArc = segmentAngle > 180 ? 1 : 0
                      
                      const textAngle = startAngle + segmentAngle / 2
                      const textRad = (textAngle - 90) * (Math.PI / 180)
                      const textX = 50 + 30 * Math.cos(textRad)
                      const textY = 50 + 30 * Math.sin(textRad)

                      return (
                        <g key={prize.id}>
                          <path
                            d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={prize.color}
                            stroke="white"
                            strokeWidth="0.5"
                          />
                          <text
                            x={textX}
                            y={textY}
                            fill="white"
                            fontSize="4"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                          >
                            {prize.nameVi}
                          </text>
                        </g>
                      )
                    })}
                    <circle cx="50" cy="50" r="8" fill="white" stroke="#fbbf24" strokeWidth="2" />
                  </svg>
                </motion.div>
              </div>

              {/* Spin button or result */}
              {!result ? (
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || hasPlayed}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isSpinning || hasPlayed
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSpinning ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🎡</span>
                      Đang quay...
                    </span>
                  ) : hasPlayed ? (
                    'Hẹn gặp lại ngày mai!'
                  ) : (
                    '🎰 QUAY NGAY!'
                  )}
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 rounded-xl p-4 text-center"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-white font-bold text-lg mb-2">{result.message}</p>
                  
                  {result.coupon && (
                    <div className="bg-white/20 rounded-lg p-3 mt-3">
                      <p className="text-yellow-400 text-sm mb-1">Mã của bạn:</p>
                      <div className="flex items-center justify-center gap-2">
                        <code className="text-2xl font-mono font-bold text-white">
                          {result.coupon.code}
                        </code>
                        <button
                          onClick={copyCode}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                      <p className="text-gray-300 text-xs mt-2">
                        Có hiệu lực đến: {new Date(result.coupon.validUntil).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

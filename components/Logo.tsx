'use client'

import { useLanguageStore } from '@/lib/store'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export default function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  const { language } = useLanguageStore()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none"
        >
          {/* Background Circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="url(#gradient)"
            stroke="#dc2626"
            strokeWidth="2"
          />
          
          {/* Bicycle Wheel 1 */}
          <circle 
            cx="30" 
            cy="65" 
            r="12" 
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="30" cy="65" r="2" fill="#ffffff" />
          
          {/* Bicycle Wheel 2 */}
          <circle 
            cx="70" 
            cy="65" 
            r="12" 
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="70" cy="65" r="2" fill="#ffffff" />
          
          {/* Bicycle Frame */}
          <path 
            d="M30 65 L50 35 L70 65 M42 65 L58 65 M50 35 L50 25"
            stroke="#ffffff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Handlebars */}
          <path 
            d="M45 25 L55 25"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Letter H */}
          <text 
            x="50" 
            y="45" 
            textAnchor="middle" 
            className="text-xs font-bold fill-white"
            style={{ fontSize: '8px' }}
          >
            H
          </text>
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-red-600 ${textSizeClasses[size]} leading-tight`}>
            HƯNG THỊNH
          </span>
          <span className={`font-semibold text-gray-700 ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} -mt-1`}>
            {language === 'ja' ? '自転車店' : language === 'en' ? 'BIKE SHOP' : 'BIKE SHOP'}
          </span>
        </div>
      )}
    </div>
  )
}

// Compact version for header
export function CompactLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 relative">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          fill="none"
        >
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="url(#gradientCompact)"
            stroke="#dc2626"
            strokeWidth="2"
          />
          <circle cx="30" cy="65" r="10" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <circle cx="70" cy="65" r="10" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          <path 
            d="M30 65 L50 35 L70 65 M40 65 L60 65 M50 35 L50 27"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M46 27 L54 27" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <text x="50" y="43" textAnchor="middle" className="text-xs font-bold fill-white" style={{ fontSize: '6px' }}>H</text>
          <defs>
            <linearGradient id="gradientCompact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="font-bold text-red-600 text-lg">
        HƯNG THỊNH
      </span>
    </div>
  )
}

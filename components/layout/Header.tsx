'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, User, LogOut, Globe } from 'lucide-react'
import { useAuthStore, useCartStore, useLanguageStore } from '@/lib/store'
import { useTranslation, AVAILABLE_LANGUAGES } from '@/lib/i18n'
import CurrencySelector from '@/components/CurrencySelector'
import { CompactLogo } from '@/components/Logo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items } = useCartStore()
  const { language, setLanguage } = useLanguageStore()
  const t = useTranslation(language)

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/policy', label: t('nav.policy') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <CompactLogo />
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  pathname === link.href ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <CurrencySelector />
            
            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-600">
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {AVAILABLE_LANGUAGES.find(l => l.code === language)?.flag} {AVAILABLE_LANGUAGES.find(l => l.code === language)?.name}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                      language === lang.code ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-600">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  {user?.partnerId && (
                    <Link
                      href="/collaborator"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      {t('nav.collaboratorDashboard')}
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg text-sm font-semibold hover:bg-primary-600 hover:text-white transition-colors"
                >
                  Đăng ký
                </Link>
                <Link
                  href="/login"
                  className="inline-flex px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 hover:shadow-lg transition-all shadow-md"
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg text-sm font-semibold text-center"
                >
                  Đăng ký
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold text-center hover:bg-primary-700 shadow-md"
                >
                  {t('nav.login')}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

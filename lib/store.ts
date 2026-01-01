import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language, DEFAULT_LANGUAGE } from './i18n'
import { Currency } from './currency'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: DEFAULT_LANGUAGE,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
)

interface CartItem {
  product: any
  quantity: number
  selectedBattery?: 'lithium_basic' | 'lithium_standard' | 'lithium_premium' | 'lead_acid'
  selectedCondition?: 'new' | 'used'
  batteryPriceAdjustment?: number
  conditionPriceAdjustment?: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: any, quantity?: number, options?: { selectedBattery?: string; selectedCondition?: string; batteryPriceAdjustment?: number; conditionPriceAdjustment?: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateItemOptions: (productId: string, options: { selectedBattery?: string; selectedCondition?: string; batteryPriceAdjustment?: number; conditionPriceAdjustment?: number }) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, options = {}) => {
        const items = get().items
        const existingItem = items.find(item => item.product._id === product._id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ 
            items: [...items, { 
              product, 
              quantity,
              selectedBattery: options.selectedBattery as any || 'lithium_basic',
              selectedCondition: options.selectedCondition as any || 'used',
              batteryPriceAdjustment: options.batteryPriceAdjustment || 0,
              conditionPriceAdjustment: options.conditionPriceAdjustment || 0
            }] 
          })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product._id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
        } else {
          set({
            items: get().items.map(item =>
              item.product._id === productId ? { ...item, quantity } : item
            ),
          })
        }
      },
      updateItemOptions: (productId, options) => {
        set({
          items: get().items.map(item =>
            item.product._id === productId 
              ? { 
                  ...item, 
                  selectedBattery: options.selectedBattery as any || item.selectedBattery,
                  selectedCondition: options.selectedCondition as any || item.selectedCondition,
                  batteryPriceAdjustment: options.batteryPriceAdjustment ?? item.batteryPriceAdjustment,
                  conditionPriceAdjustment: options.conditionPriceAdjustment ?? item.conditionPriceAdjustment
                } 
              : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const basePrice = item.product.price
          const batteryAdjustment = item.batteryPriceAdjustment || 0
          const conditionAdjustment = item.conditionPriceAdjustment || 0
          return total + (basePrice + batteryAdjustment + conditionAdjustment) * item.quantity
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

interface CurrencyState {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'JPY',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'currency-storage',
    }
  )
)

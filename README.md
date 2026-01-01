# HBike Japan Frontend

Modern, responsive Next.js 14 e-commerce frontend for HBike Japan bicycle store.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit http://localhost:3000

## 🎨 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Multi-language** support (vi, en, ja, zh)
- **Responsive Design** for all devices
- **Admin Dashboard** with charts and analytics
- **Live Chat Widget**

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── products/          # Product listing & detail
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── contact/           # Contact page
│   ├── policy/            # Policy page
│   ├── login/             # Login page
│   ├── admin/             # Admin dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Header, Footer
│   └── ChatWidget.tsx     # Live chat
├── lib/
│   ├── api.ts             # API client
│   ├── store.ts           # Zustand stores
│   ├── utils.ts           # Utility functions
│   └── i18n.ts            # Translations
└── public/                # Static assets
```

## 🌐 Pages

### Public Pages
- **/** - Home page with featured products
- **/products** - Product listing with filters
- **/products/[id]** - Product detail page
- **/cart** - Shopping cart
- **/checkout** - Checkout process
- **/contact** - Contact information
- **/policy** - Shipping, return, warranty policies
- **/login** - User/admin login

### Admin Pages (Protected)
- **/admin** - Dashboard with analytics
- **/admin/products** - Product management
- **/admin/orders** - Order management
- **/admin/partners** - Partner & QR code management
- **/admin/customers** - Customer management

## 🎯 State Management

### Auth Store (Zustand + Persist)
```typescript
const { user, isAuthenticated, login, logout } = useAuthStore()
```

### Cart Store (Zustand + Persist)
```typescript
const { items, addItem, removeItem, getTotalPrice } = useCartStore()
```

## 🌍 Multi-language Support

Change language using the globe icon in header:

```typescript
import { useTranslation } from '@/lib/i18n'

const t = useTranslation('ja') // vi, en, ja, zh
const text = t('nav.home')
```

## 🎨 Styling

### TailwindCSS Utilities
- Custom gradient: `gradient-primary`
- Hover lift effect: `hover-lift`
- Custom scrollbar: `custom-scrollbar`
- Loading spinner: `spinner`

### Color Scheme
- **Primary**: Blue (`primary-50` to `primary-900`)
- **Background**: White
- **Text**: Gray shades
- **Accents**: Gradient blue

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## 🔌 API Integration

```typescript
import { productsAPI, ordersAPI, authAPI } from '@/lib/api'

// Example usage
const products = await productsAPI.getAll({ category: 'electric' })
const order = await ordersAPI.create(orderData)
const user = await authAPI.login({ email, password })
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build & Deploy Manually
```bash
npm run build
npm start
```

## ⚙️ Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🧩 Components

### Layout Components
- `Header` - Navigation with language switcher, cart icon
- `Footer` - Links, contact info
- `ChatWidget` - Live chat support widget

### Utility Functions
- `formatCurrency(amount)` - Format as Japanese Yen
- `formatDate(date)` - Format date for Japanese locale
- `cn(...classes)` - Merge Tailwind classes

## 📊 Admin Dashboard

- Revenue charts (Recharts)
- Statistics cards
- Quick action buttons
- Real-time data from backend API

## 🔐 Authentication

Protected routes check for:
- `isAuthenticated` - User logged in
- `user.role === 'admin'` - Admin access

Redirect to `/login` if unauthorized.

## 🎭 Animations

Framer Motion animations on:
- Page transitions
- Card hover effects
- Stats reveal
- Loading states

## 📄 License

Copyright © 2024 HBike Japan 合同会社

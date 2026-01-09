import axios from 'axios'

// Create axios instance
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: any) => 
    api.post('/auth/register', data),
  googleLogin: (data: { googleId: string; email: string; name: string; avatar?: string }) =>
    api.post('/auth/google', data),
  getMe: () => 
    api.get('/auth/me'),
}

export const usersAPI = {
  getAll: (params?: any) => 
    api.get('/auth/users', { params }),
  getById: (id: string) => 
    api.get(`/auth/users/${id}`),
  create: (data: any) => 
    api.post('/auth/users', data),
  update: (id: string, data: any) => 
    api.put(`/auth/users/${id}`, data),
  delete: (id: string) => 
    api.delete(`/auth/users/${id}`),
}

export const collaboratorAPI = {
  getDashboard: () => 
    api.get('/auth/partner/dashboard'),
}

export const productsAPI = {
  getAll: (params?: any) => 
    api.get('/products', { params }),
  getFeatured: () => 
    api.get('/products/featured'),
  getById: (id: string) => 
    api.get(`/products/${id}`),
  create: (data: any) => 
    api.post('/products', data),
  update: (id: string, data: any) => 
    api.put(`/products/${id}`, data),
  delete: (id: string) => 
    api.delete(`/products/${id}`),
}

export const ordersAPI = {
  create: (data: any) => 
    api.post('/orders', data),
  getAll: (params?: any) => 
    api.get('/orders', { params }),
  getById: (id: string) => 
    api.get(`/orders/${id}`),
  updateStatus: (id: string, data: any) => 
    api.put(`/orders/${id}/status`, data),
  delete: (id: string) => 
    api.delete(`/orders/${id}`),
}

export const partnersAPI = {
  getAll: () => 
    api.get('/partners'),
  create: (data: any) => 
    api.post('/partners', data),
  getById: (id: string) => 
    api.get(`/partners/${id}`),
  getStats: (id: string) => 
    api.get(`/partners/${id}/stats`),
  update: (id: string, data: any) => 
    api.put(`/partners/${id}`, data),
  delete: (id: string) => 
    api.delete(`/partners/${id}`),
  regenerateQR: (id: string) => 
    api.get(`/partners/${id}/regenerate-qr`),
  createAccount: (id: string, password: string) =>
    api.post(`/partners/${id}/create-account`, { password }),
}

export const dashboardAPI = {
  getStats: (params?: any) => 
    api.get('/dashboard/stats', { params }),
  getRevenue: (params?: any) => 
    api.get('/dashboard/revenue', { params }),
  getTopProducts: () => 
    api.get('/dashboard/top-products'),
}

export const couponsAPI = {
  getAll: () => 
    api.get('/coupons'),
  validate: (data: { code: string; orderAmount: number; categories?: string[]; email?: string }) => 
    api.post('/coupons/validate', data),
  create: (data: any) => 
    api.post('/coupons', data),
  update: (id: string, data: any) => 
    api.put(`/coupons/${id}`, data),
  delete: (id: string) => 
    api.delete(`/coupons/${id}`),
  apply: (id: string) => 
    api.post(`/coupons/${id}/apply`),
}

export const importsAPI = {
  getAll: (params?: any) => 
    api.get('/imports', { params }),
  getStats: (params?: any) => 
    api.get('/imports/stats', { params }),
  getProfitReport: (params?: any) => 
    api.get('/imports/profit-report', { params }),
  create: (data: any) => 
    api.post('/imports', data),
  update: (id: string, data: any) => 
    api.put(`/imports/${id}`, data),
  updateStatus: (id: string, data: any) => 
    api.put(`/imports/${id}/status`, data),
  delete: (id: string) => 
    api.delete(`/imports/${id}`),
}

export const expensesAPI = {
  getAll: (params?: any) => 
    api.get('/expenses', { params }),
  getStats: (params?: any) => 
    api.get('/expenses/stats', { params }),
  getCategories: () => 
    api.get('/expenses/categories'),
  getReport: (params?: any) => 
    api.get('/expenses/report', { params }),
  create: (data: any) => 
    api.post('/expenses', data),
  update: (id: string, data: any) => 
    api.put(`/expenses/${id}`, data),
  updateStatus: (id: string, data: any) => 
    api.put(`/expenses/${id}/status`, data),
  delete: (id: string) => 
    api.delete(`/expenses/${id}`),
}

export const customersAPI = {
  getAll: (params?: any) => 
    api.get('/customers', { params }),
  getTop: (params?: any) => 
    api.get('/customers/top', { params }),
  getStats: () => 
    api.get('/customers/stats'),
  getById: (id: string) => 
    api.get(`/customers/${id}`),
  checkDiscount: (data: { email?: string; phone?: string }) => 
    api.post('/customers/check-discount', data),
  update: (id: string, data: any) => 
    api.put(`/customers/${id}`, data),
  addTags: (id: string, tags: string[]) => 
    api.post(`/customers/${id}/tags`, { tags }),
  getAppreciation: () => 
    api.get('/customers/appreciation/list'),
}

export const invoiceAPI = {
  getInvoiceData: (orderId: string) => 
    api.get(`/invoices/${orderId}`),
  getInvoiceHtml: (orderId: string) => 
    `${API_URL}/invoices/${orderId}/html`,
}

export const shippingAPI = {
  getOptions: (distance?: number) => 
    api.get('/shipping/options', { params: { distance } }),
  calculate: (data: { 
    address?: string; 
    postalCode?: string; 
    lat?: number; 
    lng?: number; 
    deliveryMethod?: string 
  }) => 
    api.post('/shipping/calculate', data),
  getStoreInfo: () => 
    api.get('/shipping/store'),
}

export const miniGameAPI = {
  getWheelConfig: (params?: { playerId?: string }) => 
    api.get('/mini-game/wheel/config', { params }),
  spinWheel: (data?: { playerId?: string; email?: string }) => 
    api.post('/mini-game/wheel/spin', data),
  playScratchCard: () => 
    api.post('/mini-game/scratch'),
  getRestaurantCoupon: () => 
    api.post('/mini-game/restaurant-coupon'),
}

export const affiliateAPI = {
  getDashboard: (token: string) => 
    api.get(`/affiliate/dashboard/${token}`),
  validateToken: (token: string) => 
    api.get(`/affiliate/validate/${token}`),
  getCommissionRates: (token: string) => 
    api.get(`/affiliate/commission-rates/${token}`),
  requestPayout: (token: string, data: any) => 
    api.post(`/affiliate/payout/${token}`, data),
}

export const studentVerificationAPI = {
  submit: (data: any) => api.post('/student-verification/submit', data),
  checkStatus: (email: string) => api.get(`/student-verification/status/${email}`),
  getAll: (params?: any) => api.get('/student-verification', { params }),
  getOne: (id: string) => api.get(`/student-verification/${id}`),
  approve: (id: string, data: any) => api.put(`/student-verification/${id}/approve`, data),
  reject: (id: string, data: any) => api.put(`/student-verification/${id}/reject`, data),
  getStats: () => api.get('/student-verification/stats/summary'),
}

export const chatAPI = {
  createSession: (data: any) => api.post('/chat/session', data),
  sendMessage: (chatId: string, data: any) => api.post(`/chat/${chatId}/message`, data),
  getAll: (params?: any) => api.get('/chat', { params }),
  getOne: (chatId: string) => api.get(`/chat/${chatId}`),
  sendAdminMessage: (chatId: string, data: any) => api.post(`/chat/${chatId}/admin-message`, data),
  closeChat: (chatId: string) => api.put(`/chat/${chatId}/close`),
  getUnreadStats: () => api.get('/chat/stats/unread'),
}

export const uploadAPI = {
  uploadImage: (image: string, folder?: string) => 
    api.post('/upload/image', { image, folder }),
  uploadProductImages: (images: string[]) => 
    api.post('/upload/product-images', { images }),
  uploadStudentId: (image: string) => 
    api.post('/upload/student-id', { image }),
  uploadReceipt: (image: string) => 
    api.post('/upload/receipt', { image }),
}

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.post('/settings/change-password', data),
  backup: () => api.post('/settings/backup'),
}

export const notificationsAPI = {
  sendEvent: (data: { 
    title: string; 
    description: string; 
    image?: string;
    startDate?: string;
    endDate?: string;
    couponCode?: string;
    discount?: number;
    targetGroup?: 'all' | 'returning' | 'new';
  }) => api.post('/notifications/send-event', data),
  getHistory: () => api.get('/notifications/history'),
}

export default api

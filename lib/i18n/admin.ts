// Admin Dashboard i18n translations
// Supports: Vietnamese (vi), Japanese (ja), English (en)

export const adminTranslations: Record<string, Record<string, string>> = {
  // Navigation & Common
  dashboard: { vi: 'Bảng điều khiển', ja: 'ダッシュボード', en: 'Dashboard' },
  products: { vi: 'Sản phẩm', ja: '商品', en: 'Products' },
  orders: { vi: 'Đơn hàng', ja: '注文', en: 'Orders' },
  customers: { vi: 'Khách hàng', ja: '顧客', en: 'Customers' },
  coupons: { vi: 'Mã giảm giá', ja: 'クーポン', en: 'Coupons' },
  partners: { vi: 'Đối tác', ja: 'パートナー', en: 'Partners' },
  chat: { vi: 'Chat hỗ trợ', ja: 'チャットサポート', en: 'Chat Support' },
  reports: { vi: 'Báo cáo', ja: 'レポート', en: 'Reports' },
  settings: { vi: 'Cài đặt', ja: '設定', en: 'Settings' },
  expenses: { vi: 'Chi phí', ja: '経費', en: 'Expenses' },
  imports: { vi: 'Nhập hàng', ja: '仕入れ', en: 'Imports' },
  loyalty: { vi: 'Khách hàng thân thiết', ja: 'ロイヤリティ', en: 'Loyalty' },
  studentVerification: { vi: 'Xác minh sinh viên', ja: '学生認証', en: 'Student Verification' },
  userManagement: { vi: 'Quản lý người dùng', ja: 'ユーザー管理', en: 'User Management' },

  // Actions
  add: { vi: 'Thêm', ja: '追加', en: 'Add' },
  edit: { vi: 'Sửa', ja: '編集', en: 'Edit' },
  delete: { vi: 'Xóa', ja: '削除', en: 'Delete' },
  save: { vi: 'Lưu', ja: '保存', en: 'Save' },
  cancel: { vi: 'Hủy', ja: 'キャンセル', en: 'Cancel' },
  confirm: { vi: 'Xác nhận', ja: '確認', en: 'Confirm' },
  search: { vi: 'Tìm kiếm', ja: '検索', en: 'Search' },
  filter: { vi: 'Lọc', ja: 'フィルター', en: 'Filter' },
  export: { vi: 'Xuất', ja: 'エクスポート', en: 'Export' },
  import: { vi: 'Nhập', ja: 'インポート', en: 'Import' },
  refresh: { vi: 'Làm mới', ja: '更新', en: 'Refresh' },
  view: { vi: 'Xem', ja: '表示', en: 'View' },
  details: { vi: 'Chi tiết', ja: '詳細', en: 'Details' },
  back: { vi: 'Quay lại', ja: '戻る', en: 'Back' },
  next: { vi: 'Tiếp theo', ja: '次へ', en: 'Next' },
  previous: { vi: 'Trước', ja: '前へ', en: 'Previous' },
  submit: { vi: 'Gửi', ja: '送信', en: 'Submit' },
  approve: { vi: 'Duyệt', ja: '承認', en: 'Approve' },
  reject: { vi: 'Từ chối', ja: '拒否', en: 'Reject' },

  // Status
  active: { vi: 'Hoạt động', ja: 'アクティブ', en: 'Active' },
  inactive: { vi: 'Không hoạt động', ja: '非アクティブ', en: 'Inactive' },
  pending: { vi: 'Đang chờ', ja: '保留中', en: 'Pending' },
  completed: { vi: 'Hoàn thành', ja: '完了', en: 'Completed' },
  cancelled: { vi: 'Đã hủy', ja: 'キャンセル済み', en: 'Cancelled' },
  processing: { vi: 'Đang xử lý', ja: '処理中', en: 'Processing' },
  shipped: { vi: 'Đã giao', ja: '発送済み', en: 'Shipped' },
  delivered: { vi: 'Đã nhận', ja: '配達済み', en: 'Delivered' },

  // Dashboard Stats
  totalRevenue: { vi: 'Tổng doanh thu', ja: '総売上', en: 'Total Revenue' },
  totalOrders: { vi: 'Tổng đơn hàng', ja: '総注文数', en: 'Total Orders' },
  totalCustomers: { vi: 'Tổng khách hàng', ja: '総顧客数', en: 'Total Customers' },
  totalProducts: { vi: 'Tổng sản phẩm', ja: '総商品数', en: 'Total Products' },
  todayRevenue: { vi: 'Doanh thu hôm nay', ja: '本日の売上', en: "Today's Revenue" },
  todayOrders: { vi: 'Đơn hàng hôm nay', ja: '本日の注文', en: "Today's Orders" },
  newCustomers: { vi: 'Khách hàng mới', ja: '新規顧客', en: 'New Customers' },
  recentOrders: { vi: 'Đơn hàng gần đây', ja: '最近の注文', en: 'Recent Orders' },
  topProducts: { vi: 'Sản phẩm bán chạy', ja: '人気商品', en: 'Top Products' },
  lowStock: { vi: 'Sắp hết hàng', ja: '在庫少', en: 'Low Stock' },

  // Products
  productName: { vi: 'Tên sản phẩm', ja: '商品名', en: 'Product Name' },
  productCode: { vi: 'Mã sản phẩm', ja: '商品コード', en: 'Product Code' },
  price: { vi: 'Giá', ja: '価格', en: 'Price' },
  originalPrice: { vi: 'Giá gốc', ja: '元価格', en: 'Original Price' },
  salePrice: { vi: 'Giá khuyến mãi', ja: 'セール価格', en: 'Sale Price' },
  stock: { vi: 'Tồn kho', ja: '在庫', en: 'Stock' },
  category: { vi: 'Danh mục', ja: 'カテゴリー', en: 'Category' },
  brand: { vi: 'Thương hiệu', ja: 'ブランド', en: 'Brand' },
  description: { vi: 'Mô tả', ja: '説明', en: 'Description' },
  images: { vi: 'Hình ảnh', ja: '画像', en: 'Images' },
  specifications: { vi: 'Thông số kỹ thuật', ja: '仕様', en: 'Specifications' },
  addProduct: { vi: 'Thêm sản phẩm', ja: '商品を追加', en: 'Add Product' },
  editProduct: { vi: 'Sửa sản phẩm', ja: '商品を編集', en: 'Edit Product' },

  // Orders
  orderNumber: { vi: 'Mã đơn hàng', ja: '注文番号', en: 'Order Number' },
  orderDate: { vi: 'Ngày đặt', ja: '注文日', en: 'Order Date' },
  orderStatus: { vi: 'Trạng thái', ja: 'ステータス', en: 'Status' },
  orderTotal: { vi: 'Tổng tiền', ja: '合計', en: 'Total' },
  shippingAddress: { vi: 'Địa chỉ giao hàng', ja: '配送先', en: 'Shipping Address' },
  paymentMethod: { vi: 'Phương thức thanh toán', ja: '支払い方法', en: 'Payment Method' },
  paymentStatus: { vi: 'Trạng thái thanh toán', ja: '支払い状況', en: 'Payment Status' },
  orderItems: { vi: 'Sản phẩm đặt', ja: '注文商品', en: 'Order Items' },
  updateStatus: { vi: 'Cập nhật trạng thái', ja: 'ステータス更新', en: 'Update Status' },

  // Customers
  customerName: { vi: 'Tên khách hàng', ja: '顧客名', en: 'Customer Name' },
  email: { vi: 'Email', ja: 'メール', en: 'Email' },
  phone: { vi: 'Số điện thoại', ja: '電話番号', en: 'Phone' },
  address: { vi: 'Địa chỉ', ja: '住所', en: 'Address' },
  joinDate: { vi: 'Ngày tham gia', ja: '登録日', en: 'Join Date' },
  totalSpent: { vi: 'Tổng chi tiêu', ja: '総支出', en: 'Total Spent' },
  orderCount: { vi: 'Số đơn hàng', ja: '注文数', en: 'Order Count' },

  // Coupons
  couponCode: { vi: 'Mã giảm giá', ja: 'クーポンコード', en: 'Coupon Code' },
  discountType: { vi: 'Loại giảm giá', ja: '割引タイプ', en: 'Discount Type' },
  discountValue: { vi: 'Giá trị giảm', ja: '割引額', en: 'Discount Value' },
  percentage: { vi: 'Phần trăm', ja: 'パーセント', en: 'Percentage' },
  fixedAmount: { vi: 'Số tiền cố định', ja: '固定金額', en: 'Fixed Amount' },
  minOrderAmount: { vi: 'Đơn hàng tối thiểu', ja: '最低注文額', en: 'Min Order Amount' },
  maxDiscount: { vi: 'Giảm tối đa', ja: '最大割引', en: 'Max Discount' },
  usageLimit: { vi: 'Giới hạn sử dụng', ja: '使用制限', en: 'Usage Limit' },
  usedCount: { vi: 'Đã sử dụng', ja: '使用回数', en: 'Used Count' },
  validFrom: { vi: 'Có hiệu lực từ', ja: '開始日', en: 'Valid From' },
  validUntil: { vi: 'Có hiệu lực đến', ja: '終了日', en: 'Valid Until' },
  createCoupon: { vi: 'Tạo mã giảm giá', ja: 'クーポン作成', en: 'Create Coupon' },

  // Chat
  conversations: { vi: 'Cuộc trò chuyện', ja: '会話', en: 'Conversations' },
  messages: { vi: 'Tin nhắn', ja: 'メッセージ', en: 'Messages' },
  sendMessage: { vi: 'Gửi tin nhắn', ja: 'メッセージ送信', en: 'Send Message' },
  typeMessage: { vi: 'Nhập tin nhắn...', ja: 'メッセージを入力...', en: 'Type a message...' },
  noMessages: { vi: 'Chưa có tin nhắn', ja: 'メッセージなし', en: 'No messages' },
  online: { vi: 'Trực tuyến', ja: 'オンライン', en: 'Online' },
  offline: { vi: 'Ngoại tuyến', ja: 'オフライン', en: 'Offline' },
  unreadMessages: { vi: 'Tin nhắn chưa đọc', ja: '未読メッセージ', en: 'Unread Messages' },

  // Reports
  salesReport: { vi: 'Báo cáo doanh thu', ja: '売上レポート', en: 'Sales Report' },
  inventoryReport: { vi: 'Báo cáo tồn kho', ja: '在庫レポート', en: 'Inventory Report' },
  customerReport: { vi: 'Báo cáo khách hàng', ja: '顧客レポート', en: 'Customer Report' },
  dateRange: { vi: 'Khoảng thời gian', ja: '期間', en: 'Date Range' },
  today: { vi: 'Hôm nay', ja: '今日', en: 'Today' },
  thisWeek: { vi: 'Tuần này', ja: '今週', en: 'This Week' },
  thisMonth: { vi: 'Tháng này', ja: '今月', en: 'This Month' },
  thisYear: { vi: 'Năm nay', ja: '今年', en: 'This Year' },
  custom: { vi: 'Tùy chỉnh', ja: 'カスタム', en: 'Custom' },

  // Settings
  generalSettings: { vi: 'Cài đặt chung', ja: '一般設定', en: 'General Settings' },
  storeInfo: { vi: 'Thông tin cửa hàng', ja: '店舗情報', en: 'Store Info' },
  storeName: { vi: 'Tên cửa hàng', ja: '店舗名', en: 'Store Name' },
  storeEmail: { vi: 'Email cửa hàng', ja: '店舗メール', en: 'Store Email' },
  storePhone: { vi: 'Điện thoại cửa hàng', ja: '店舗電話', en: 'Store Phone' },
  storeAddress: { vi: 'Địa chỉ cửa hàng', ja: '店舗住所', en: 'Store Address' },
  currency: { vi: 'Tiền tệ', ja: '通貨', en: 'Currency' },
  language: { vi: 'Ngôn ngữ', ja: '言語', en: 'Language' },
  notifications: { vi: 'Thông báo', ja: '通知', en: 'Notifications' },
  emailNotifications: { vi: 'Thông báo email', ja: 'メール通知', en: 'Email Notifications' },

  // Student Verification
  studentId: { vi: 'Mã sinh viên', ja: '学生ID', en: 'Student ID' },
  university: { vi: 'Trường đại học', ja: '大学', en: 'University' },
  verificationStatus: { vi: 'Trạng thái xác minh', ja: '認証状況', en: 'Verification Status' },
  verified: { vi: 'Đã xác minh', ja: '認証済み', en: 'Verified' },
  unverified: { vi: 'Chưa xác minh', ja: '未認証', en: 'Unverified' },
  idCard: { vi: 'Thẻ sinh viên', ja: '学生証', en: 'ID Card' },

  // Form Validation
  required: { vi: 'Trường này là bắt buộc', ja: 'この項目は必須です', en: 'This field is required' },
  invalidEmail: { vi: 'Email không hợp lệ', ja: '無効なメールアドレス', en: 'Invalid email address' },
  invalidPhone: { vi: 'Số điện thoại không hợp lệ', ja: '無効な電話番号', en: 'Invalid phone number' },
  minLength: { vi: 'Tối thiểu {min} ký tự', ja: '最低{min}文字', en: 'Minimum {min} characters' },
  maxLength: { vi: 'Tối đa {max} ký tự', ja: '最大{max}文字', en: 'Maximum {max} characters' },

  // Messages
  saveSuccess: { vi: 'Lưu thành công', ja: '保存しました', en: 'Saved successfully' },
  saveFailed: { vi: 'Lưu thất bại', ja: '保存に失敗しました', en: 'Save failed' },
  deleteSuccess: { vi: 'Xóa thành công', ja: '削除しました', en: 'Deleted successfully' },
  deleteFailed: { vi: 'Xóa thất bại', ja: '削除に失敗しました', en: 'Delete failed' },
  confirmDelete: { vi: 'Bạn có chắc muốn xóa?', ja: '削除してもよろしいですか？', en: 'Are you sure you want to delete?' },
  loading: { vi: 'Đang tải...', ja: '読み込み中...', en: 'Loading...' },
  noData: { vi: 'Không có dữ liệu', ja: 'データなし', en: 'No data' },
  error: { vi: 'Có lỗi xảy ra', ja: 'エラーが発生しました', en: 'An error occurred' },

  // Expenses
  expenseType: { vi: 'Loại chi phí', ja: '経費種類', en: 'Expense Type' },
  expenseAmount: { vi: 'Số tiền', ja: '金額', en: 'Amount' },
  expenseDate: { vi: 'Ngày chi', ja: '日付', en: 'Date' },
  expenseNote: { vi: 'Ghi chú', ja: '備考', en: 'Note' },
  addExpense: { vi: 'Thêm chi phí', ja: '経費追加', en: 'Add Expense' },

  // Imports
  supplier: { vi: 'Nhà cung cấp', ja: '仕入先', en: 'Supplier' },
  importDate: { vi: 'Ngày nhập', ja: '仕入日', en: 'Import Date' },
  importTotal: { vi: 'Tổng tiền nhập', ja: '仕入総額', en: 'Import Total' },
  importItems: { vi: 'Sản phẩm nhập', ja: '仕入商品', en: 'Import Items' },
  addImport: { vi: 'Thêm phiếu nhập', ja: '仕入追加', en: 'Add Import' },

  // Partners
  partnerName: { vi: 'Tên đối tác', ja: 'パートナー名', en: 'Partner Name' },
  partnerType: { vi: 'Loại đối tác', ja: 'パートナー種類', en: 'Partner Type' },
  commissionRate: { vi: 'Tỷ lệ hoa hồng', ja: '手数料率', en: 'Commission Rate' },
  addPartner: { vi: 'Thêm đối tác', ja: 'パートナー追加', en: 'Add Partner' },

  // Loyalty
  loyaltyPoints: { vi: 'Điểm tích lũy', ja: 'ポイント', en: 'Loyalty Points' },
  memberTier: { vi: 'Hạng thành viên', ja: '会員ランク', en: 'Member Tier' },
  bronze: { vi: 'Đồng', ja: 'ブロンズ', en: 'Bronze' },
  silver: { vi: 'Bạc', ja: 'シルバー', en: 'Silver' },
  gold: { vi: 'Vàng', ja: 'ゴールド', en: 'Gold' },
  platinum: { vi: 'Bạch kim', ja: 'プラチナ', en: 'Platinum' },
}

// Helper function to get translation
export const getAdminText = (language: string) => {
  return (key: string, params?: Record<string, string | number>) => {
    let text = adminTranslations[key]?.[language] || adminTranslations[key]?.vi || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }
}

export default adminTranslations

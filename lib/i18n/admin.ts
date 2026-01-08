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

  // Product Form - Add/Edit
  addNewProduct: { vi: 'Thêm sản phẩm mới', ja: '新商品追加', en: 'Add New Product' },
  editProductTitle: { vi: 'Chỉnh sửa sản phẩm', ja: '商品編集', en: 'Edit Product' },
  fillProductInfo: { vi: 'Điền thông tin sản phẩm bên dưới', ja: '以下に商品情報を入力してください', en: 'Fill in the product information below' },
  basicInfo: { vi: 'Thông tin cơ bản', ja: '基本情報', en: 'Basic Information' },
  productNameVi: { vi: 'Tên sản phẩm (Tiếng Việt)', ja: '商品名（ベトナム語）', en: 'Product Name (Vietnamese)' },
  productNameJa: { vi: 'Tên tiếng Nhật', ja: '商品名（日本語）', en: 'Product Name (Japanese)' },
  productNameEn: { vi: 'Tên tiếng Anh', ja: '商品名（英語）', en: 'Product Name (English)' },
  selectBrand: { vi: 'Chọn thương hiệu', ja: 'ブランドを選択', en: 'Select Brand' },
  other: { vi: 'Khác', ja: 'その他', en: 'Other' },
  electricBike: { vi: 'Xe đạp điện', ja: '電動自転車', en: 'Electric Bike' },
  normalBike: { vi: 'Xe đạp thường', ja: '普通自転車', en: 'Normal Bike' },
  sportBike: { vi: 'Xe đạp thể thao', ja: 'スポーツ自転車', en: 'Sport Bike' },
  priceJPY: { vi: 'Giá (¥)', ja: '価格（¥）', en: 'Price (¥)' },
  priceVND: { vi: 'Giá (VNĐ)', ja: '価格（VND）', en: 'Price (VND)' },
  condition: { vi: 'Tình trạng', ja: '状態', en: 'Condition' },
  conditionNew: { vi: 'Mới', ja: '新品', en: 'New' },
  conditionLikeNew: { vi: 'Như mới', ja: 'ほぼ新品', en: 'Like New' },
  conditionUsed: { vi: 'Đã qua sử dụng', ja: '中古', en: 'Used' },
  conditionPercentage: { vi: 'Phần trăm tình trạng (%)', ja: '状態パーセント（%）', en: 'Condition Percentage (%)' },
  
  // Product Description
  productDescription: { vi: 'Mô tả sản phẩm', ja: '商品説明', en: 'Product Description' },
  descriptionVi: { vi: 'Mô tả (Tiếng Việt)', ja: '説明（ベトナム語）', en: 'Description (Vietnamese)' },
  descriptionEn: { vi: 'Mô tả (English)', ja: '説明（英語）', en: 'Description (English)' },
  descriptionJa: { vi: 'Mô tả (日本語)', ja: '説明（日本語）', en: 'Description (Japanese)' },
  
  // Specifications
  technicalSpecs: { vi: 'Thông số kỹ thuật', ja: '仕様', en: 'Technical Specifications' },
  batteryType: { vi: 'Loại pin', ja: 'バッテリータイプ', en: 'Battery Type' },
  rangeKm: { vi: 'Quãng đường (km)', ja: '走行距離（km）', en: 'Range (km)' },
  motorPower: { vi: 'Công suất động cơ', ja: 'モーター出力', en: 'Motor Power' },
  frameSize: { vi: 'Kích thước khung', ja: 'フレームサイズ', en: 'Frame Size' },
  weight: { vi: 'Trọng lượng (kg)', ja: '重量（kg）', en: 'Weight (kg)' },
  color: { vi: 'Màu sắc', ja: '色', en: 'Color' },
  
  // Images & Video
  imagesAndVideo: { vi: 'Hình ảnh & Video', ja: '画像・動画', en: 'Images & Video' },
  videoUrl: { vi: 'URL Video (YouTube)', ja: '動画URL（YouTube）', en: 'Video URL (YouTube)' },
  productImages: { vi: 'Hình ảnh sản phẩm', ja: '商品画像', en: 'Product Images' },
  uploadOrEnterUrl: { vi: 'Tải ảnh lên hoặc nhập URL trực tiếp', ja: '画像をアップロードまたはURLを入力', en: 'Upload image or enter URL directly' },
  uploadImage: { vi: 'Tải ảnh lên', ja: '画像をアップロード', en: 'Upload Image' },
  addImageSlot: { vi: 'Thêm ô ảnh', ja: '画像スロット追加', en: 'Add Image Slot' },
  orEnterImageUrl: { vi: 'Hoặc nhập URL ảnh trực tiếp', ja: 'または画像URLを入力', en: 'Or enter image URL directly' },
  imageUploadSuccess: { vi: 'Đã tải ảnh lên thành công!', ja: '画像アップロード成功！', en: 'Image uploaded successfully!' },
  imageUploadFailed: { vi: 'Tải ảnh lên thất bại', ja: '画像アップロード失敗', en: 'Image upload failed' },
  
  // Replaced Parts
  replacedParts: { vi: 'Bộ phận đã thay', ja: '交換部品', en: 'Replaced Parts' },
  addPart: { vi: 'Thêm bộ phận', ja: '部品追加', en: 'Add Part' },
  partPlaceholder: { vi: 'VD: Lốp, Phanh, Xích...', ja: '例: タイヤ、ブレーキ、チェーン...', en: 'E.g: Tire, Brake, Chain...' },
  
  // Warranty
  warrantyInfo: { vi: 'Thông tin bảo hành', ja: '保証情報', en: 'Warranty Information' },
  batteryWarranty: { vi: 'Bảo hành pin (tháng)', ja: 'バッテリー保証（月）', en: 'Battery Warranty (months)' },
  motorWarranty: { vi: 'Bảo hành động cơ (tháng)', ja: 'モーター保証（月）', en: 'Motor Warranty (months)' },
  warrantyDiscount: { vi: 'Giảm giá bảo hành (%)', ja: '保証割引（%）', en: 'Warranty Discount (%)' },
  
  // Actions
  saving: { vi: 'Đang lưu...', ja: '保存中...', en: 'Saving...' },
  saveProduct: { vi: 'Lưu sản phẩm', ja: '商品を保存', en: 'Save Product' },
  createProduct: { vi: 'Tạo sản phẩm', ja: '商品を作成', en: 'Create Product' },
  updateProduct: { vi: 'Cập nhật sản phẩm', ja: '商品を更新', en: 'Update Product' },
  productCreated: { vi: 'Đã tạo sản phẩm mới', ja: '新商品を作成しました', en: 'Product created successfully' },
  productUpdated: { vi: 'Đã cập nhật sản phẩm', ja: '商品を更新しました', en: 'Product updated successfully' },
  productCreateFailed: { vi: 'Không thể tạo sản phẩm', ja: '商品作成に失敗しました', en: 'Failed to create product' },
  productUpdateFailed: { vi: 'Không thể cập nhật sản phẩm', ja: '商品更新に失敗しました', en: 'Failed to update product' },
  
  // Placeholders
  exampleYamahaPas: { vi: 'Ví dụ: Xe đạp điện Yamaha PAS', ja: '例: ヤマハPAS電動アシスト自転車', en: 'E.g: Yamaha PAS Electric Bicycle' },
  exampleBatteryType: { vi: 'VD: Lithium-ion 15.4Ah', ja: '例: リチウムイオン 15.4Ah', en: 'E.g: Lithium-ion 15.4Ah' },
  exampleMotorPower: { vi: 'VD: 250W', ja: '例: 250W', en: 'E.g: 250W' },
  exampleFrameSize: { vi: 'VD: 26 inch', ja: '例: 26インチ', en: 'E.g: 26 inch' },

  // Orders Page
  orderManagement: { vi: 'Quản lý đơn hàng', ja: '注文管理', en: 'Order Management' },
  allOrders: { vi: 'Tất cả đơn hàng', ja: '全注文', en: 'All Orders' },
  pendingOrders: { vi: 'Đơn chờ xử lý', ja: '保留中の注文', en: 'Pending Orders' },
  processingOrders: { vi: 'Đang xử lý', ja: '処理中', en: 'Processing' },
  shippedOrders: { vi: 'Đã gửi hàng', ja: '発送済み', en: 'Shipped' },
  deliveredOrders: { vi: 'Đã giao', ja: '配達済み', en: 'Delivered' },
  cancelledOrders: { vi: 'Đã hủy', ja: 'キャンセル済み', en: 'Cancelled' },
  viewOrder: { vi: 'Xem đơn hàng', ja: '注文を見る', en: 'View Order' },
  orderDetails: { vi: 'Chi tiết đơn hàng', ja: '注文詳細', en: 'Order Details' },
  customerInfo: { vi: 'Thông tin khách hàng', ja: '顧客情報', en: 'Customer Information' },
  shippingInfo: { vi: 'Thông tin giao hàng', ja: '配送情報', en: 'Shipping Information' },
  paymentInfo: { vi: 'Thông tin thanh toán', ja: '支払い情報', en: 'Payment Information' },
  orderNote: { vi: 'Ghi chú đơn hàng', ja: '注文メモ', en: 'Order Note' },
  printInvoice: { vi: 'In hóa đơn', ja: '請求書印刷', en: 'Print Invoice' },
  
  // Imports Page
  importManagement: { vi: 'Quản lý nhập hàng', ja: '仕入管理', en: 'Import Management' },
  newImport: { vi: 'Phiếu nhập mới', ja: '新規仕入', en: 'New Import' },
  importStatus: { vi: 'Trạng thái', ja: 'ステータス', en: 'Status' },
  addImportItem: { vi: 'Thêm sản phẩm', ja: '商品追加', en: 'Add Item' },
  importQuantity: { vi: 'Số lượng', ja: '数量', en: 'Quantity' },
  unitPrice: { vi: 'Đơn giá', ja: '単価', en: 'Unit Price' },
  totalPrice: { vi: 'Thành tiền', ja: '合計', en: 'Total' },
  
  // Expenses Page
  expenseManagement: { vi: 'Quản lý chi phí', ja: '経費管理', en: 'Expense Management' },
  newExpense: { vi: 'Chi phí mới', ja: '新規経費', en: 'New Expense' },
  expenseCategory: { vi: 'Danh mục chi phí', ja: '経費カテゴリ', en: 'Expense Category' },
  rent: { vi: 'Thuê mặt bằng', ja: '家賃', en: 'Rent' },
  utilities: { vi: 'Điện nước', ja: '光熱費', en: 'Utilities' },
  salary: { vi: 'Lương nhân viên', ja: '給与', en: 'Salary' },
  marketing: { vi: 'Marketing', ja: 'マーケティング', en: 'Marketing' },
  maintenance: { vi: 'Bảo trì', ja: 'メンテナンス', en: 'Maintenance' },
  otherExpense: { vi: 'Chi phí khác', ja: 'その他経費', en: 'Other Expense' },
  
  // Loyalty Page
  loyaltyManagement: { vi: 'Khách hàng thân thiết', ja: 'ロイヤルティ管理', en: 'Loyalty Management' },
  loyaltyProgram: { vi: 'Chương trình thân thiết', ja: 'ロイヤルティプログラム', en: 'Loyalty Program' },
  pointsEarned: { vi: 'Điểm tích lũy', ja: '獲得ポイント', en: 'Points Earned' },
  pointsRedeemed: { vi: 'Điểm đã dùng', ja: '使用ポイント', en: 'Points Redeemed' },
  pointsBalance: { vi: 'Điểm còn lại', ja: 'ポイント残高', en: 'Points Balance' },
  
  // Customers Page
  customerManagement: { vi: 'Quản lý khách hàng', ja: '顧客管理', en: 'Customer Management' },
  allCustomers: { vi: 'Tất cả khách hàng', ja: '全顧客', en: 'All Customers' },
  topCustomers: { vi: 'Khách hàng VIP', ja: 'VIP顧客', en: 'Top Customers' },
  customerDetails: { vi: 'Chi tiết khách hàng', ja: '顧客詳細', en: 'Customer Details' },
  orderHistory: { vi: 'Lịch sử đơn hàng', ja: '注文履歴', en: 'Order History' },
  customerTags: { vi: 'Nhãn khách hàng', ja: '顧客タグ', en: 'Customer Tags' },
  addTag: { vi: 'Thêm nhãn', ja: 'タグ追加', en: 'Add Tag' },
  
  // Users Page
  usersManagement: { vi: 'Quản lý người dùng', ja: 'ユーザー管理', en: 'User Management' },
  allUsers: { vi: 'Tất cả người dùng', ja: '全ユーザー', en: 'All Users' },
  addUser: { vi: 'Thêm người dùng', ja: 'ユーザー追加', en: 'Add User' },
  editUser: { vi: 'Sửa người dùng', ja: 'ユーザー編集', en: 'Edit User' },
  userRole: { vi: 'Vai trò', ja: '役割', en: 'Role' },
  admin: { vi: 'Quản trị viên', ja: '管理者', en: 'Admin' },
  userType: { vi: 'Người dùng', ja: 'ユーザー', en: 'User' },
  collaborator: { vi: 'Cộng tác viên', ja: 'コラボレーター', en: 'Collaborator' },
  password: { vi: 'Mật khẩu', ja: 'パスワード', en: 'Password' },
  confirmPassword: { vi: 'Xác nhận mật khẩu', ja: 'パスワード確認', en: 'Confirm Password' },
  
  // Partners Page
  partnersManagement: { vi: 'Quản lý đối tác', ja: 'パートナー管理', en: 'Partner Management' },
  allPartners: { vi: 'Tất cả đối tác', ja: '全パートナー', en: 'All Partners' },
  addPartnerNew: { vi: 'Thêm đối tác mới', ja: '新規パートナー追加', en: 'Add New Partner' },
  editPartner: { vi: 'Sửa đối tác', ja: 'パートナー編集', en: 'Edit Partner' },
  partnerCode: { vi: 'Mã đối tác', ja: 'パートナーコード', en: 'Partner Code' },
  totalCommission: { vi: 'Tổng hoa hồng', ja: '総手数料', en: 'Total Commission' },
  affiliate: { vi: 'Affiliate', ja: 'アフィリエイト', en: 'Affiliate' },
  reseller: { vi: 'Đại lý', ja: '代理店', en: 'Reseller' },
  regenerateQR: { vi: 'Tạo lại mã QR', ja: 'QR再生成', en: 'Regenerate QR' },
  
  // Coupons Page
  couponsManagement: { vi: 'Quản lý mã giảm giá', ja: 'クーポン管理', en: 'Coupon Management' },
  allCoupons: { vi: 'Tất cả mã giảm giá', ja: '全クーポン', en: 'All Coupons' },
  addCoupon: { vi: 'Thêm mã giảm giá', ja: 'クーポン追加', en: 'Add Coupon' },
  editCoupon: { vi: 'Sửa mã giảm giá', ja: 'クーポン編集', en: 'Edit Coupon' },
  couponType: { vi: 'Loại mã', ja: 'クーポンタイプ', en: 'Coupon Type' },
  percentDiscount: { vi: 'Giảm theo %', ja: 'パーセント割引', en: 'Percentage Discount' },
  fixedDiscount: { vi: 'Giảm cố định', ja: '固定割引', en: 'Fixed Discount' },
  freeShipping: { vi: 'Miễn phí ship', ja: '送料無料', en: 'Free Shipping' },
  
  // Student Verification Page
  studentVerificationManagement: { vi: 'Xác minh sinh viên', ja: '学生認証管理', en: 'Student Verification' },
  pendingVerifications: { vi: 'Chờ xác minh', ja: '認証待ち', en: 'Pending Verifications' },
  approvedVerifications: { vi: 'Đã duyệt', ja: '承認済み', en: 'Approved' },
  rejectedVerifications: { vi: 'Đã từ chối', ja: '拒否済み', en: 'Rejected' },
  studentName: { vi: 'Tên sinh viên', ja: '学生名', en: 'Student Name' },
  studentEmail: { vi: 'Email sinh viên', ja: '学生メール', en: 'Student Email' },
  universityName: { vi: 'Tên trường', ja: '大学名', en: 'University Name' },
  studentIdImage: { vi: 'Ảnh thẻ sinh viên', ja: '学生証画像', en: 'Student ID Image' },
  approveStudent: { vi: 'Duyệt sinh viên', ja: '学生を承認', en: 'Approve Student' },
  rejectStudent: { vi: 'Từ chối', ja: '拒否', en: 'Reject' },
  rejectionReason: { vi: 'Lý do từ chối', ja: '拒否理由', en: 'Rejection Reason' },
  
  // Reports Page
  reportsManagement: { vi: 'Báo cáo', ja: 'レポート', en: 'Reports' },
  revenueReport: { vi: 'Báo cáo doanh thu', ja: '売上レポート', en: 'Revenue Report' },
  profitReport: { vi: 'Báo cáo lợi nhuận', ja: '利益レポート', en: 'Profit Report' },
  expenseReportPage: { vi: 'Báo cáo chi phí', ja: '経費レポート', en: 'Expense Report' },
  exportExcel: { vi: 'Xuất Excel', ja: 'Excelエクスポート', en: 'Export Excel' },
  exportPdf: { vi: 'Xuất PDF', ja: 'PDFエクスポート', en: 'Export PDF' },
  
  // Settings Page
  settingsManagement: { vi: 'Cài đặt', ja: '設定', en: 'Settings' },
  storeSettings: { vi: 'Cài đặt cửa hàng', ja: '店舗設定', en: 'Store Settings' },
  paymentSettings: { vi: 'Cài đặt thanh toán', ja: '支払い設定', en: 'Payment Settings' },
  shippingSettings: { vi: 'Cài đặt giao hàng', ja: '配送設定', en: 'Shipping Settings' },
  emailSettings: { vi: 'Cài đặt email', ja: 'メール設定', en: 'Email Settings' },
  notificationSettings: { vi: 'Cài đặt thông báo', ja: '通知設定', en: 'Notification Settings' },
  
  // Common Actions & Messages
  actions: { vi: 'Thao tác', ja: 'アクション', en: 'Actions' },
  close: { vi: 'Đóng', ja: '閉じる', en: 'Close' },
  yes: { vi: 'Có', ja: 'はい', en: 'Yes' },
  no: { vi: 'Không', ja: 'いいえ', en: 'No' },
  all: { vi: 'Tất cả', ja: 'すべて', en: 'All' },
  none: { vi: 'Không có', ja: 'なし', en: 'None' },
  selected: { vi: 'Đã chọn', ja: '選択済み', en: 'Selected' },
  selectAll: { vi: 'Chọn tất cả', ja: 'すべて選択', en: 'Select All' },
  deselectAll: { vi: 'Bỏ chọn tất cả', ja: 'すべて解除', en: 'Deselect All' },
  showing: { vi: 'Đang hiển thị', ja: '表示中', en: 'Showing' },
  of: { vi: 'trong số', ja: '/', en: 'of' },
  results: { vi: 'kết quả', ja: '件', en: 'results' },
  noResults: { vi: 'Không có kết quả', ja: '結果なし', en: 'No results' },
  tryAgain: { vi: 'Thử lại', ja: '再試行', en: 'Try Again' },
  
  // Date & Time
  createdAt: { vi: 'Ngày tạo', ja: '作成日', en: 'Created At' },
  updatedAt: { vi: 'Ngày cập nhật', ja: '更新日', en: 'Updated At' },
  startDate: { vi: 'Ngày bắt đầu', ja: '開始日', en: 'Start Date' },
  endDate: { vi: 'Ngày kết thúc', ja: '終了日', en: 'End Date' },
  
  // Currency
  jpy: { vi: 'Yên Nhật', ja: '円', en: 'Japanese Yen' },
  vnd: { vi: 'Việt Nam Đồng', ja: 'ベトナムドン', en: 'Vietnamese Dong' },
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

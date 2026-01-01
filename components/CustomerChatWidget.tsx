'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Loader2 } from 'lucide-react'
import { chatAPI } from '@/lib/api'
import { connectSocket, joinChatRoom, leaveChatRoom } from '@/lib/socket'
import { useLanguageStore } from '@/lib/store'
import toast from 'react-hot-toast'

const getChatText = (language: string) => {
  const texts: Record<string, Record<string, string>> = {
    chatSupport: { vi: 'Hỗ trợ trực tuyến', ja: 'チャットサポート', en: 'Chat Support' },
    askAnything: { vi: 'Hãy hỏi chúng tôi bất cứ điều gì', ja: 'お気軽にお問い合わせください', en: 'Feel free to ask us anything' },
    welcome: { vi: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?', ja: 'こんにちは！何かお手伝いできることはありますか？', en: 'Hello! How can we help you?' },
    enterMessage: { vi: 'Nhập tin nhắn...', ja: 'メッセージを入力...', en: 'Enter message...' },
    products: { vi: 'Sản phẩm', ja: '製品について', en: 'Products' },
    shipping: { vi: 'Vận chuyển', ja: '配送について', en: 'Shipping' },
    warranty: { vi: 'Bảo hành', ja: '保証について', en: 'Warranty' },
    startChat: { vi: 'Bắt đầu chat', ja: 'チャットを開始', en: 'Start Chat' },
    yourName: { vi: 'Tên của bạn', ja: 'お名前', en: 'Your Name' },
    yourEmail: { vi: 'Email của bạn', ja: 'メールアドレス', en: 'Your Email' },
    yourPhone: { vi: 'Số điện thoại (tùy chọn)', ja: '電話番号（任意）', en: 'Phone (optional)' },
    connecting: { vi: 'Đang kết nối...', ja: '接続中...', en: 'Connecting...' },
    online: { vi: 'Trực tuyến', ja: 'オンライン', en: 'Online' },
  }
  return (key: string) => texts[key]?.[language] || texts[key]?.vi || key
}

export default function CustomerChatWidget() {
  const { language } = useLanguageStore()
  const getText = getChatText(language)
  
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate session ID on mount
  useEffect(() => {
    let storedSessionId = localStorage.getItem('chatSessionId')
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('chatSessionId', storedSessionId)
    }
    setSessionId(storedSessionId)

    // Check for existing customer info
    const storedInfo = localStorage.getItem('chatCustomerInfo')
    if (storedInfo) {
      const info = JSON.parse(storedInfo)
      setCustomerInfo(info)
      setShowForm(false)
    }
  }, [])

  // Connect to socket when chat is opened
  useEffect(() => {
    if (isOpen && chatId) {
      const socket = connectSocket()
      joinChatRoom(chatId)

      socket.on('newMessage', (data: any) => {
        if (data.chatId === chatId && data.message.sender === 'admin') {
          setMessages(prev => [...prev, data.message])
        }
      })

      return () => {
        socket.off('newMessage')
        leaveChatRoom(chatId)
      }
    }
  }, [isOpen, chatId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startChat = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast.error(language === 'ja' ? '名前とメールを入力してください' : 'Vui lòng nhập tên và email')
      return
    }

    setLoading(true)
    try {
      // Save customer info
      localStorage.setItem('chatCustomerInfo', JSON.stringify(customerInfo))

      // Create chat session
      const response = await chatAPI.createSession({
        sessionId,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone
      })

      setChatId(response.data.data.chatId)
      setMessages(response.data.data.messages || [])
      setShowForm(false)

      // Add welcome message if no messages
      if (!response.data.data.messages?.length) {
        setMessages([{
          sender: 'admin',
          content: getText('welcome'),
          createdAt: new Date()
        }])
      }
    } catch (error) {
      toast.error('Không thể kết nối chat')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !chatId) return

    const newMessage = {
      sender: 'customer',
      senderName: customerInfo.name,
      content: message.trim(),
      createdAt: new Date()
    }

    // Optimistically add message
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setSending(true)

    try {
      await chatAPI.sendMessage(chatId, {
        content: message.trim(),
        senderName: customerInfo.name
      })
    } catch (error) {
      toast.error('Không thể gửi tin nhắn')
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setSending(false)
    }
  }

  const handleQuickMessage = (text: string) => {
    setMessage(text)
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{getText('chatSupport')}</h3>
                  <p className="text-xs opacity-90 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {getText('online')}
                  </p>
                </div>
              </div>
            </div>

            {showForm ? (
              /* Customer Info Form */
              <div className="flex-1 p-4 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{getText('startChat')}</h4>
                  <p className="text-sm text-gray-500">{getText('askAnything')}</p>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={getText('yourName')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={getText('yourEmail')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder={getText('yourPhone')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={startChat}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {getText('connecting')}
                      </>
                    ) : (
                      getText('startChat')
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'customer'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-xs ${msg.sender === 'customer' ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleQuickMessage(getText('products'))}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {getText('products')}
                    </button>
                    <button
                      onClick={() => handleQuickMessage(getText('shipping'))}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {getText('shipping')}
                    </button>
                    <button
                      onClick={() => handleQuickMessage(getText('warranty'))}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {getText('warranty')}
                    </button>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={getText('enterMessage')}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !message.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

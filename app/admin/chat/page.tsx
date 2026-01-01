'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, Send, User, Clock, X, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { chatAPI } from '@/lib/api'
import { connectSocket, joinAdminRoom, joinChatRoom, leaveChatRoom } from '@/lib/socket'
import AdminSidebar from '@/components/admin/Sidebar'
import toast from 'react-hot-toast'

export default function AdminChatPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [chats, setChats] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [unreadStats, setUnreadStats] = useState({ unreadMessages: 0, activeChats: 0 })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    
    fetchChats()
    fetchUnreadStats()

    // Connect to socket and join admin room
    const socket = connectSocket()
    joinAdminRoom()

    // Listen for new messages
    socket.on('newMessage', (data: any) => {
      // Update chat list
      setChats(prev => prev.map(chat => 
        chat._id === data.chatId 
          ? { ...chat, lastMessageAt: new Date(), unreadCount: chat.unreadCount + 1 }
          : chat
      ))
      
      // Update selected chat if viewing
      if (selectedChat?._id === data.chatId) {
        setSelectedChat((prev: any) => ({
          ...prev,
          messages: [...(prev?.messages || []), data.message]
        }))
      }
      
      fetchUnreadStats()
    })

    return () => {
      socket.off('newMessage')
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getAll()
      setChats(response.data.data)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadStats = async () => {
    try {
      const response = await chatAPI.getUnreadStats()
      setUnreadStats(response.data.data)
    } catch (error) {
      console.error('Error fetching unread stats:', error)
    }
  }

  const selectChat = async (chat: any) => {
    if (selectedChat) {
      leaveChatRoom(selectedChat._id)
    }

    try {
      const response = await chatAPI.getOne(chat._id)
      setSelectedChat(response.data.data)
      joinChatRoom(chat._id)
      
      // Update local state
      setChats(prev => prev.map(c => 
        c._id === chat._id ? { ...c, unreadCount: 0 } : c
      ))
      fetchUnreadStats()
    } catch (error) {
      toast.error('Không thể tải cuộc trò chuyện')
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return

    setSending(true)
    try {
      const response = await chatAPI.sendAdminMessage(selectedChat._id, {
        content: message.trim()
      })
      
      setSelectedChat((prev: any) => ({
        ...prev,
        messages: [...(prev?.messages || []), response.data.data]
      }))
      setMessage('')
    } catch (error) {
      toast.error('Không thể gửi tin nhắn')
    } finally {
      setSending(false)
    }
  }

  const closeChat = async (chatId: string) => {
    try {
      await chatAPI.closeChat(chatId)
      toast.success('Đã đóng cuộc trò chuyện')
      setSelectedChat(null)
      fetchChats()
    } catch (error) {
      toast.error('Không thể đóng cuộc trò chuyện')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0f1419]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <AdminSidebar />

      <div className="flex-1 flex">
        {/* Chat List */}
        <div className="w-80 bg-[#1a1f2e] border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Tin nhắn
              {unreadStats.unreadMessages > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadStats.unreadMessages}
                </span>
              )}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {unreadStats.activeChats} cuộc trò chuyện đang hoạt động
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Chưa có tin nhắn nào
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-[#252b3b] transition-colors ${
                    selectedChat?._id === chat._id ? 'bg-[#252b3b]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white truncate">
                          {chat.customerName}
                        </span>
                        {chat.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{chat.customerEmail}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(chat.lastMessageAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-[#1a1f2e] border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{selectedChat.customerName}</h3>
                    <p className="text-sm text-gray-400">{selectedChat.customerEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => closeChat(selectedChat._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Đóng chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages?.map((msg: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'admin'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-[#1a1f2e] text-white rounded-bl-sm'
                    }`}>
                      <p>{msg.content}</p>
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        msg.sender === 'admin' ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        {msg.sender === 'admin' && msg.read && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-[#1a1f2e] border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-3 bg-[#0f1419] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !message.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Chọn một cuộc trò chuyện để bắt đầu</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

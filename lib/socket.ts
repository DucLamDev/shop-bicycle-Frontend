import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling']
    })
  }
  return socket
}

export const connectSocket = (): Socket => {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
  return s
}

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect()
  }
}

// Join admin room for receiving all messages
export const joinAdminRoom = (): void => {
  const s = getSocket()
  s.emit('joinAdmin')
}

// Join specific chat room
export const joinChatRoom = (chatId: string): void => {
  const s = getSocket()
  s.emit('joinChat', chatId)
}

// Leave chat room
export const leaveChatRoom = (chatId: string): void => {
  const s = getSocket()
  s.emit('leaveChat', chatId)
}

// Subscribe to dashboard updates
export const subscribeToDashboard = (): void => {
  const s = getSocket()
  s.emit('subscribeDashboard')
}

// Send typing indicator
export const sendTypingIndicator = (chatId: string, isTyping: boolean, senderName: string): void => {
  const s = getSocket()
  s.emit('typing', { chatId, isTyping, senderName })
}

export default socket

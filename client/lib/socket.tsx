import { io, Socket } from 'socket.io-client'

class SocketManager {
  private socket: Socket | null = null
  private static instance: SocketManager
  private userId: string | null = null
  private currentConversation: string | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  connect(userId?: string): Socket {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 20000,
      })

      this.setupEventHandlers()

      if (userId) {
        this.userId = userId
        this.socket.emit('join', userId)
      }
    }

    return this.socket
  }

  private setupEventHandlers(): void {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('✅ Connected to server:', this.socket?.id)
      this.reconnectAttempts = 0

      // Re-join user and conversation if they were set
      if (this.userId) {
        this.socket?.emit('join', this.userId)
      }
      if (this.currentConversation) {
        this.socket?.emit('joinConversation', this.currentConversation)
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error)
      this.reconnectAttempts++

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached')
      }
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`)
    })

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error)
    })
  }

  joinConversation(conversationId: string): void {
    if (this.socket && conversationId !== this.currentConversation) {
      // Leave current conversation if any
      if (this.currentConversation) {
        this.socket.emit('leaveConversation', this.currentConversation)
      }

      // Join new conversation
      this.socket.emit('joinConversation', conversationId)
      this.currentConversation = conversationId
      console.log(`🏠 Joined conversation: ${conversationId}`)
    }
  }

  leaveConversation(): void {
    if (this.socket && this.currentConversation) {
      this.socket.emit('leaveConversation', this.currentConversation)
      console.log(`🚪 Left conversation: ${this.currentConversation}`)
      this.currentConversation = null
    }
  }

  sendMessage(messageData: {
    wa_id: string
    name: string
    text: string
    tempId?: string
  }): void {
    if (this.socket) {
      this.socket.emit('sendMessage', messageData)
    }
  }

  updateMessageStatus(messageId: string, status: string): void {
    if (this.socket) {
      this.socket.emit('updateMessageStatus', { messageId, status })
    }
  }

  markAsRead(conversationId: string): void {
    if (this.socket) {
      this.socket.emit('markAsRead', { conversationId })
    }
  }

  setTyping(conversationId: string, isTyping: boolean): void {
    if (this.socket && conversationId) {
      this.socket.emit('typing', { conversationId, isTyping })
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.leaveConversation()
      this.socket.disconnect()
      this.socket = null
      this.userId = null
      this.currentConversation = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getCurrentConversation(): string | null {
    return this.currentConversation
  }
}

export default SocketManager

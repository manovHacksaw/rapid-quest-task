import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import SocketManager from '@/lib/socket'

interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  joinConversation: (conversationId: string) => void
  leaveConversation: () => void
  sendMessage: (messageData: {
    wa_id: string
    name: string
    text: string
    tempId?: string
  }) => void
  updateMessageStatus: (messageId: string, status: string) => void
  markAsRead: (conversationId: string) => void
  setTyping: (conversationId: string, isTyping: boolean) => void
}

export function useSocket(userId?: string): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketManagerRef = useRef<SocketManager | null>(null)

  useEffect(() => {
    if (!socketManagerRef.current) {
      socketManagerRef.current = SocketManager.getInstance()
      socketRef.current = socketManagerRef.current.connect(userId)

      // Set up connection status listeners
      socketRef.current.on('connect', () => {
        setIsConnected(true)
      })

      socketRef.current.on('disconnect', () => {
        setIsConnected(false)
      })

      // Initial connection state
      setIsConnected(socketRef.current.connected)
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // socketManagerRef.current?.disconnect()
    }
  }, [userId])

  const joinConversation = (conversationId: string) => {
    socketManagerRef.current?.joinConversation(conversationId)
  }

  const leaveConversation = () => {
    socketManagerRef.current?.leaveConversation()
  }

  const sendMessage = (messageData: {
    wa_id: string
    name: string
    text: string
    tempId?: string
  }) => {
    socketManagerRef.current?.sendMessage(messageData)
  }

  const updateMessageStatus = (messageId: string, status: string) => {
    socketManagerRef.current?.updateMessageStatus(messageId, status)
  }

  const markAsRead = (conversationId: string) => {
    socketManagerRef.current?.markAsRead(conversationId)
  }

  const setTyping = (conversationId: string, isTyping: boolean) => {
    socketManagerRef.current?.setTyping(conversationId, isTyping)
  }

  return {
    socket: socketRef.current,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    updateMessageStatus,
    markAsRead,
    setTyping
  }
}

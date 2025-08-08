import { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import SocketManager from '@/lib/socket'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socketManager = SocketManager.getInstance()
    socketRef.current = socketManager.connect()

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // socketManager.disconnect()
    }
  }, [])

  return socketRef.current
}

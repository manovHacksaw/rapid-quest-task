'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Reply, Forward, Star, Copy, Trash2, Info } from 'lucide-react'
import { Message } from '@/types/chat'

interface MessageContextMenuProps {
  message: Message
  isVisible: boolean
  position: { x: number; y: number }
  onClose: () => void
  onDeleteForMe: (messageId: string) => void
  onDeleteForEveryone: (messageId: string) => void
  onReply: (message: Message) => void
  onForward: (message: Message) => void
  onCopy: (text: string) => void
  isOutgoing: boolean
}

export function MessageContextMenu({
  message,
  isVisible,
  position,
  onClose,
  onDeleteForMe,
  onDeleteForEveryone,
  onReply,
  onForward,
  onCopy,
  isOutgoing
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const handleDeleteForMe = () => {
    onDeleteForMe(message.id)
    onClose()
  }

  const handleDeleteForEveryone = () => {
    onDeleteForEveryone(message.id)
    onClose()
  }

  const handleReply = () => {
    onReply(message)
    onClose()
  }

  const handleForward = () => {
    onForward(message)
    onClose()
  }

  const handleCopy = () => {
    onCopy(message.text)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[#233138] border border-[#3C4043] rounded-lg shadow-lg py-2 min-w-[200px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReply}
        className="w-full justify-start px-4 py-2 text-[#E9EDEF] hover:bg-[#3C4043] rounded-none"
      >
        <Reply className="h-4 w-4 mr-3" />
        Reply
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleForward}
        className="w-full justify-start px-4 py-2 text-[#E9EDEF] hover:bg-[#3C4043] rounded-none"
      >
        <Forward className="h-4 w-4 mr-3" />
        Forward
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start px-4 py-2 text-[#E9EDEF] hover:bg-[#3C4043] rounded-none"
      >
        <Star className="h-4 w-4 mr-3" />
        Star
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="w-full justify-start px-4 py-2 text-[#E9EDEF] hover:bg-[#3C4043] rounded-none"
      >
        <Copy className="h-4 w-4 mr-3" />
        Copy
      </Button>
      
      <div className="border-t border-[#3C4043] my-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDeleteForMe}
        className="w-full justify-start px-4 py-2 text-[#E9EDEF] hover:bg-[#3C4043] rounded-none"
      >
        <Trash2 className="h-4 w-4 mr-3" />
        Delete for me
      </Button>
      
      {isOutgoing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteForEveryone}
          className="w-full justify-start px-4 py-2 text-[#E9EDEF] hover:bg-[#3C4043] rounded-none"
        >
          <Trash2 className="h-4 w-4 mr-3" />
          Delete for everyone
        </Button>
      )}
      
      <div className="border-t border-[#3C4043] my-1" />
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start px-4 py-2 text-[#E9EDEF] hover:bg-[#3C4043] rounded-none"
      >
        <Info className="h-4 w-4 mr-3" />
        Message info
      </Button>
    </div>
  )
}

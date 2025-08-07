import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, RefreshCw, Phone, Video, MoreVertical } from 'lucide-react'
import { Conversation, Message } from '@/types/chat'
import { formatTimestamp, cn } from '@/lib/utils'

interface ChatAreaProps {
  conversation: Conversation | null
  messages: Message[]
  loading: boolean
  onSendMessage: (text: string) => void
  onRefresh: () => void
}

export function ChatArea({
  conversation,
  messages,
  loading,
  onSendMessage,
  onRefresh
}: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="text-gray-400">✓</span>
      case 'delivered':
        return <span className="text-gray-500">✓✓</span>
      case 'read':
        return <span className="text-blue-500">✓✓</span>
      default:
        return null
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Send className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">WhatsApp Web</h2>
          <p>Select a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                {getInitials(conversation.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-gray-900">{conversation.name}</h2>
              <p className="text-sm text-gray-500">{conversation._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex animate-pulse">
                <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages in this conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOutgoing = message.id.startsWith('frontend-')
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isOutgoing ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                      isOutgoing
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-900 shadow-sm"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={cn(
                      "flex items-center justify-end space-x-1 mt-1 text-xs",
                      isOutgoing ? "text-green-100" : "text-gray-500"
                    )}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {isOutgoing && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Phone, Video, MoreVertical, ArrowLeft, Search, Smile, Paperclip, Mic } from 'lucide-react'
import { Conversation, Message } from '@/types/chat'
import { formatTimestamp, cn } from '@/lib/utils'

interface ChatAreaProps {
  conversation: Conversation | null
  messages: Message[]
  loading: boolean
  onSendMessage: (text: string) => void
  onRefresh: () => void
  onBack?: () => void
}

export function ChatArea({
  conversation,
  messages,
  loading,
  onSendMessage,
  onRefresh,
  onBack
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
        return <span className="text-[#8696A0] text-xs">✓</span>
      case 'delivered':
        return <span className="text-[#8696A0] text-xs">✓✓</span>
      case 'read':
        return <span className="text-[#53BDEB] text-xs">✓✓</span>
      default:
        return null
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center whatsapp-chat-bg">
        <div className="text-center text-[#8696A0] max-w-xl px-8">
          <div className="w-80 h-80 mx-auto mb-8 flex items-center justify-center">
            <svg viewBox="0 0 320 320" className="h-full w-full">
              <defs>
                <linearGradient id="whatsapp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#25D366" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#128C7E" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <rect width="320" height="200" rx="20" fill="url(#whatsapp-gradient)" />
              <circle cx="120" cy="100" r="12" fill="#25D366" opacity="0.3"/>
              <circle cx="160" cy="100" r="12" fill="#25D366" opacity="0.3"/>
              <circle cx="200" cy="100" r="12" fill="#25D366" opacity="0.3"/>
              <rect x="80" y="140" width="160" height="8" rx="4" fill="#25D366" opacity="0.2"/>
              <rect x="100" y="160" width="120" height="6" rx="3" fill="#25D366" opacity="0.15"/>
            </svg>
          </div>
          <h2 className="text-3xl font-light text-[#E9EDEF] mb-4">WhatsApp Web</h2>
          <p className="text-[#8696A0] text-sm leading-relaxed mb-6">
            Send and receive messages without keeping your phone online. <br/>
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[#8696A0]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your personal messages are end-to-end encrypted
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="whatsapp-header px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-9 w-9 p-0 hover:bg-[#3C4043] text-[#8696A0] md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#6B7C85] text-[#E9EDEF] font-medium text-sm">
                {getInitials(conversation.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-[#E9EDEF] text-base">{conversation.name}</h2>
              <p className="text-xs text-[#8696A0]">click here for contact info</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0]"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0]"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 whatsapp-chat-bg scrollbar-thin">
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex animate-pulse">
                  <div className="bg-[#3C4043] rounded-lg p-3 max-w-xs">
                    <div className="h-4 bg-[#2A3942] rounded mb-2" />
                    <div className="h-3 bg-[#2A3942] rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-[#8696A0] py-8">
              <p>No messages in this conversation</p>
            </div>
          ) : (
            <div className="space-y-2">
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
                        "max-w-md px-3 py-2 rounded-lg message-bubble shadow-sm",
                        isOutgoing
                          ? "outgoing bg-[#005C4B] text-[#E9EDEF]"
                          : "incoming bg-[#202C33] text-[#E9EDEF]"
                      )}
                    >
                      <p className="text-sm leading-relaxed mb-1">{message.text}</p>
                      <div className="flex items-center justify-end gap-1 text-xs text-[#8696A0]">
                        <span>{formatTimestamp(message.timestamp)}</span>
                        {isOutgoing && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="whatsapp-input-area px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0]"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0]"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="whatsapp-input rounded-lg h-10 px-4 focus:ring-0 focus:outline-none"
            />
          </div>
          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-[#25D366] hover:bg-[#128C7E] rounded-full h-10 w-10 p-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0]"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

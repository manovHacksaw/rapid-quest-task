import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Conversation, Message } from '@/types/chat'
import { formatTimestamp, cn } from '@/lib/utils'

interface SearchResultsProps {
  query: string
  conversations: Conversation[]
  messages: Message[]
  onSelectConversation: (conversation: Conversation) => void
  onSelectMessage: (conversation: Conversation, message: Message) => void
}

export function SearchResults({
  query,
  conversations,
  messages,
  onSelectConversation,
  onSelectMessage
}: SearchResultsProps) {
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(query.toLowerCase())
  )

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(query.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-[#25D366] text-[#111B21] px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  if (!query) return null

  return (
    <ScrollArea className="flex-1 scrollbar-thin">
      <div className="p-4">
        {/* Contacts */}
        {filteredConversations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#25D366] text-sm font-medium mb-3">Contacts</h3>
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className="w-full p-3 text-left hover:bg-[#2A3942] rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#6B7C85] text-[#E9EDEF] font-medium text-sm">
                        {getInitials(conversation.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#E9EDEF] text-sm">
                        {highlightText(conversation.name, query)}
                      </h4>
                      <p className="text-xs text-[#8696A0] truncate">
                        +{conversation._id}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {filteredMessages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#25D366] text-sm font-medium mb-3">Messages</h3>
            <div className="space-y-1">
              {filteredMessages.map((message) => {
                const conversation = conversations.find(c => c._id === message.wa_id)
                if (!conversation) return null
                
                return (
                  <button
                    key={message.id}
                    onClick={() => onSelectMessage(conversation, message)}
                    className="w-full p-3 text-left hover:bg-[#2A3942] rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#6B7C85] text-[#E9EDEF] font-medium text-sm">
                          {getInitials(conversation.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-[#E9EDEF] text-sm">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-[#8696A0]">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-[#8696A0] truncate">
                          {highlightText(message.text, query)}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredConversations.length === 0 && filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 opacity-30">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#8696A0]" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <p className="text-[#8696A0] text-sm">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Search, Calendar } from 'lucide-react'
import { Message } from '@/types/chat'
import { formatMessageDate, highlightSearchText } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ConversationSearchProps {
  messages: Message[]
  onClose: () => void
  onMessageSelect: (messageId: string) => void
}

export function ConversationSearch({ messages, onClose, onMessageSelect }: ConversationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMessages = messages.filter(msg =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedResults = filteredMessages.reduce((groups: { [key: string]: Message[] }, message) => {
    const dateKey = formatMessageDate(message.timestamp)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(message)
    return groups
  }, {})

  return (
    <div className="absolute inset-0 bg-[#111B21] z-50 flex flex-col">
      {/* Search Header */}
      <div className="whatsapp-header px-4 py-3 border-b border-[#313D45]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0]"
          >
            <X className="h-5 w-5" />
          </Button>
          <h2 className="text-[#E9EDEF] text-lg font-medium">Search messages</h2>
        </div>
        
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8696A0]" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="whatsapp-input pl-10 pr-10 h-10 rounded-full border-2 border-[#25D366] focus:ring-0 focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-[#3C4043] text-[#8696A0]"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <ScrollArea className="flex-1 scrollbar-thin">
        {!searchQuery ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[#8696A0]">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>Search for messages</p>
            </div>
          </div>
        ) : Object.keys(groupedResults).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[#8696A0]">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>No messages found for "{searchQuery}"</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {Object.entries(groupedResults).map(([date, msgs]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-[#25D366]" />
                  <h3 className="text-[#25D366] text-sm font-medium">{date}</h3>
                </div>
                <div className="space-y-2">
                  {msgs.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => onMessageSelect(message.id)}
                      className="w-full p-3 text-left hover:bg-[#2A3942] rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#8696A0]">
                          {new Date(parseInt(message.timestamp.toString()) * 1000).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-[#E9EDEF] leading-relaxed">
                        {highlightSearchText(message.text, searchQuery)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

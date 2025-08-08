import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MoreVertical, MessageCircle, Users, Archive, Search, X, Camera, QrCode } from 'lucide-react'
import { Conversation, Message } from '@/types/chat'
import { formatTimestamp, truncateMessage } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { SearchResults } from './search-results'
import { MobileHeaderMenu } from './mobile-header-menu'
import { StraightTick } from './ui/straight-tick'

interface ConversationsListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
  loading: boolean
  onRefresh: () => void
  messages: Message[]
}

export function ConversationsList({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading,
  onRefresh,
  messages
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

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
    case "sent":
      return <StraightTick />;
    case "delivered":
      return (
        <div className="flex relative">
          <div className="absolute left-1">
            <StraightTick />
          </div>
          <StraightTick />
        </div>
      );
    case "read":
      return (
        <div className="flex relative">
          <div className="absolute left-1">
            <StraightTick color="#53BDEB" />
          </div>
          <StraightTick color="#53BDEB" />
        </div>
      );
    default:
      return null;
  }
};
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setIsSearching(value.length > 0)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearching(false)
  }

  const handleSelectMessage = (conversation: Conversation, message: Message) => {
    onSelectConversation(conversation)
    clearSearch()
  }

  return (
    <div className="whatsapp-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="whatsapp-header p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[#E9EDEF] text-xl font-medium">WhatsApp</h1>
          <div className="flex items-center gap-2">
            {/* Desktop icons */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0] hidden md:flex"
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0] hidden md:flex"
            >
              <Archive className="h-5 w-5" />
            </Button>
            
            {/* Mobile icons */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#E9EDEF] md:hidden"
            >
              <QrCode className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#E9EDEF] md:hidden"
            >
              <Camera className="h-5 w-5" />
            </Button>
            
            {/* Menu - different for mobile and desktop */}
            <div className="md:hidden">
              <MobileHeaderMenu />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0] hidden md:flex"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8696A0]" />
          <Input
            placeholder={isSearching ? "Search..." : "Ask Meta AI or Search"}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="whatsapp-input pl-10 pr-10 h-12 md:h-9 rounded-full md:rounded-lg border-none focus:ring-0 focus:outline-none text-base md:text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-[#3C4043] text-[#8696A0]"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Filter tabs - only show when not searching */}
        {!isSearching && (
          <div className="flex gap-1 mt-4 overflow-x-auto scrollbar-none">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 bg-[#25D366] text-[#111B21] hover:bg-[#25D366]/90 rounded-full text-sm font-medium whitespace-nowrap"
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-[#8696A0] hover:bg-[#3C4043] rounded-full text-sm whitespace-nowrap"
            >
              Unread
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-[#8696A0] hover:bg-[#3C4043] rounded-full text-sm whitespace-nowrap"
            >
              Favourites
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-[#8696A0] hover:bg-[#3C4043] rounded-full text-sm whitespace-nowrap"
            >
              Groups
            </Button>
          </div>
        )}
      </div>

      {/* Search Results or Conversations List */}
      {isSearching ? (
        <SearchResults
          query={searchQuery}
          conversations={conversations}
          messages={messages}
          onSelectConversation={onSelectConversation}
          onSelectMessage={handleSelectMessage}
        />
      ) : (
        <ScrollArea className="flex-1 scrollbar-thin">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 animate-pulse">
                  <div className="w-12 h-12 bg-[#3C4043] rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#3C4043] rounded w-3/4" />
                    <div className="h-3 bg-[#3C4043] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-[#8696A0]">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-[#3C4043]" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div>
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className={cn(
                    "conversation-item w-full p-3 text-left hover:bg-[#2A3942] transition-colors",
                    selectedConversation?._id === conversation._id && "selected bg-[#2A3942]"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-[#6B7C85] text-[#E9EDEF] font-medium text-sm">
                        {getInitials(conversation.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-[#E9EDEF] truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-[#8696A0]">
                          {formatTimestamp(conversation.lastTimestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1">
                         <div className="flex items-center">
                          {getStatusIcon(conversation.status)}
                        </div>
                        <p className="text-sm text-[#8696A0] truncate">
                          {truncateMessage(conversation.lastMessage || 'No messages yet', 40)}
                        </p>
                       
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}

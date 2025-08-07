import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RefreshCw, MessageCircle } from 'lucide-react'
import { Conversation } from '@/types/chat'
import { formatTimestamp } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ConversationsListProps {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
  loading: boolean
  onRefresh: () => void
}

export function ConversationsList({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading,
  onRefresh
}: ConversationsListProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-gray-400'
      case 'delivered':
        return 'text-gray-500'
      case 'read':
        return 'text-blue-500'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-green-600" />
            Chats
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => onSelectConversation(conversation)}
                className={cn(
                  "w-full p-4 text-left hover:bg-gray-50 transition-colors",
                  selectedConversation?._id === conversation._id && "bg-green-50 border-r-4 border-green-500"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                      {getInitials(conversation.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(conversation.lastTimestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      <div className={cn("text-xs", getStatusColor(conversation.status))}>
                        {conversation.status === 'sent' && '✓'}
                        {conversation.status === 'delivered' && '✓✓'}
                        {conversation.status === 'read' && '✓✓'}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {conversation._id}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  )
}

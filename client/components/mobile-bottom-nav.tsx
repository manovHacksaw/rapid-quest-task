import { Button } from '@/components/ui/button'
import { MessageCircle, Radio, Users, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileBottomNavProps {
  activeTab: 'chats' | 'updates' | 'communities' | 'calls'
  onTabChange: (tab: 'chats' | 'updates' | 'communities' | 'calls') => void
  unreadCount?: number
  showChat?: boolean // Add this prop to control visibility
}

export function MobileBottomNav({ activeTab, onTabChange, unreadCount, showChat = false }: MobileBottomNavProps) {
  const tabs = [
    {
      id: 'chats' as const,
      icon: MessageCircle,
      label: 'Chats'
    },
    {
      id: 'updates' as const,
      icon: Radio,
      label: 'Updates'
    },
    {
      id: 'communities' as const,
      icon: Users,
      label: 'Communities'
    },
    {
      id: 'calls' as const,
      icon: Phone,
      label: 'Calls'
    },
  ]

  // Hide bottom nav when a chat is open on mobile
  if (showChat) {
    return null
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#202C33] border-t border-[#313D45] px-2 py-1">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 h-16 px-4 py-2 rounded-none hover:bg-transparent",
              activeTab === tab.id ? "text-[#25D366]" : "text-[#8696A0]"
            )}
          >
            <div className="relative">
              <tab.icon className="h-6 w-6" />
              {tab.id === 'chats' && unreadCount && unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center">
                  {/* <span className="text-[#111B21] text-xs font-medium">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span> */}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </Button>
        ))}
      </div>
      
      {/* Home indicator for iOS-style devices */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-32 h-1 bg-[#8696A0] rounded-full opacity-30" />
      </div>
    </div>
  )
}
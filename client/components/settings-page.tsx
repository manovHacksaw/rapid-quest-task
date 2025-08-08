import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Key, Shield, MessageSquare, Bell, Keyboard, HelpCircle, LogOut, Edit } from 'lucide-react'

export function SettingsPage() {
  const settingsItems = [
    {
      icon: Key,
      title: 'Account',
      description: 'Security notifications, account info',
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Blocked contacts, disappearing messages',
    },
    {
      icon: MessageSquare,
      title: 'Chats',
      description: 'Theme, wallpaper, chat settings',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Message notifications',
    },
    {
      icon: Keyboard,
      title: 'Keyboard shortcuts',
      description: 'Quick actions',
    },
    {
      icon: HelpCircle,
      title: 'Help',
      description: 'Help center, contact us, privacy policy',
    },
    // Adding more items to demonstrate scrolling
    {
      icon: Key,
      title: 'Storage and data',
      description: 'Network usage, auto-download',
    },
    {
      icon: Shield,
      title: 'Business tools',
      description: 'Business profile, catalog',
    },
    {
      icon: MessageSquare,
      title: 'Linked devices',
      description: 'Connect WhatsApp Web and Desktop',
    },
    {
      icon: Bell,
      title: 'Two-step verification',
      description: 'Add extra security to your account',
    },
    {
      icon: Keyboard,
      title: 'Change number',
      description: 'Change your phone number',
    },
    {
      icon: HelpCircle,
      title: 'Request account info',
      description: 'Request a report of your account information and settings',
    },
  ]

  return (
    <div className="whatsapp-sidebar flex flex-col h-full bg-[#111B21]">
      {/* Header - Fixed */}
      <div className="whatsapp-header p-4 flex-shrink-0">
        <h1 className="text-[#E9EDEF] text-xl font-medium mb-4">Settings</h1>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8696A0]" />
          <Input
            placeholder="Search settings"
            className="bg-[#2A3942] text-[#E9EDEF] placeholder-[#8696A0] pl-10 h-9 rounded-lg border-none focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-3 p-3 hover:bg-[#2A3942] rounded-lg cursor-pointer mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-[#6B7C85] text-[#E9EDEF] font-medium text-lg">
              ME
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-[#E9EDEF] text-lg">Manobendra</h3>
            <p className="text-sm text-[#8696A0]">Hey there! I am using WhatsApp.</p>
          </div>
        </div>
      </div>

      {/* Settings List - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4">
            {settingsItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-4 p-4 hover:bg-[#2A3942] rounded-lg transition-colors text-left"
              >
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-[#8696A0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#E9EDEF] text-base">{item.title}</h4>
                  <p className="text-sm text-[#8696A0] mt-1">{item.description}</p>
                </div>
              </button>
            ))}
            
            {/* Log out */}
            <button className="w-full flex items-center space-x-4 p-4 hover:bg-[#2A3942] rounded-lg transition-colors text-left mt-4">
              <div className="flex-shrink-0">
                <LogOut className="h-6 w-6 text-[#F15C6D]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[#F15C6D] text-base">Log out</h4>
              </div>
            </button>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
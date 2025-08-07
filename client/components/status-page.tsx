import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, MoreVertical, Search } from 'lucide-react'

export function StatusPage() {
  return (
    <div className="whatsapp-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="whatsapp-header p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[#E9EDEF] text-xl font-medium">Status</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#8696A0]"
            >
              <Plus className="h-5 w-5" />
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

      {/* My Status */}
      <div className="px-4 pb-4">
        <div className="flex items-center space-x-3 p-3 hover:bg-[#2A3942] rounded-lg cursor-pointer">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#6B7C85] text-[#E9EDEF] font-medium text-sm">
                ME
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center border-2 border-[#2A2F32]">
              <Plus className="h-3 w-3 text-[#111B21]" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-[#E9EDEF] text-sm">My status</h3>
            <p className="text-xs text-[#8696A0]">Tap to add status update</p>
          </div>
        </div>
      </div>

      {/* Status List */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="px-4">
          {/* Recent Section */}
          <div className="mb-4">
            <h3 className="text-[#25D366] text-sm font-medium mb-3">Recent</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 opacity-30">
                <svg viewBox="0 0 24 24" className="w-full h-full text-[#8696A0]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-[#8696A0] text-sm">No recent status updates</p>
            </div>
          </div>

          {/* Viewed Section */}
          <div className="mb-4">
            <h3 className="text-[#25D366] text-sm font-medium mb-3">Viewed</h3>
            <div className="text-center py-8">
              <p className="text-[#8696A0] text-sm">No viewed status updates</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

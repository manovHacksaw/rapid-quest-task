import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Edit, Camera } from 'lucide-react'

export function ProfilePage() {
  return (
    <div className="whatsapp-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="whatsapp-header p-4">
        <h1 className="text-[#E9EDEF] text-xl font-medium mb-8">Profile</h1>
        
        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Avatar className="h-48 w-48">
              <AvatarFallback className="bg-[#6B7C85] text-[#E9EDEF] font-medium text-4xl">
                MB
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 h-12 w-12 p-0 bg-[#2A3942] hover:bg-[#3C4043] rounded-full"
            >
              <Camera className="h-6 w-6 text-[#E9EDEF]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="px-4 pb-4">
          {/* Name Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8696A0] text-sm">Your name</span>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-[#2A3942] rounded-lg cursor-pointer">
              <div className="flex-1">
                <h3 className="font-medium text-[#E9EDEF] text-lg">Manobendra</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-[#3C4043] text-[#8696A0]"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[#8696A0] text-sm mt-2 px-4">
              This is not your username or PIN. This name will be visible to your WhatsApp contacts.
            </p>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#8696A0] text-sm">About</span>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-[#2A3942] rounded-lg cursor-pointer">
              <div className="flex-1">
                <p className="text-[#E9EDEF] text-base">Hey there! I am using WhatsApp.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-[#3C4043] text-[#8696A0]"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

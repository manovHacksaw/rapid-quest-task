import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Users, AirplayIcon as Broadcast, Link, Star, CreditCard, Eye, Settings } from 'lucide-react'

export function MobileHeaderMenu() {
  const menuItems = [
    { icon: Users, label: 'New group' },
    { icon: Users, label: 'New community' },
    { icon: Broadcast, label: 'New broadcast' },
    { icon: Link, label: 'Linked devices' },
    { icon: Star, label: 'Starred' },
    { icon: CreditCard, label: 'Payments' },
    { icon: Eye, label: 'Read all' },
    { icon: Settings, label: 'Settings' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 hover:bg-[#3C4043] text-[#E9EDEF]"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-[#2A3942] border-[#313D45] text-[#E9EDEF]"
      >
        {menuItems.map((item, index) => (
          <DropdownMenuItem 
            key={index}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[#3C4043] cursor-pointer"
          >
            <item.icon className="h-5 w-5 text-[#8696A0]" />
            <span className="text-[#E9EDEF]">{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

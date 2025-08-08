import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: string | number): string {
  const date = new Date(parseInt(timestamp.toString()) * 1000)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    // Show time for today
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } else if (diffInHours < 24 * 7) {
    // Show day of week for this week
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  } else {
    // Show date for older messages
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
}

export function formatMessageDate(timestamp: string | number): string {
  const date = new Date(parseInt(timestamp.toString()) * 1000)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  } else {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

export function truncateMessage(message: string, maxLength: number = 70): string {
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
}

export function groupMessagesByDate(messages: any[]) {
  const groups: { [key: string]: any[] } = {}
  
  messages.forEach(message => {
    const dateKey = formatMessageDate(message.timestamp)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(message)
  })
  
  return groups
}

export function highlightSearchText(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'i'); // removed 'g'
  const parts = text.split(new RegExp(`(${query})`, 'gi')); // keep g here for split
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-[#25D366] text-[#111B21] px-1 rounded">
        {part}
      </span>
    ) : (part) 
  );
}

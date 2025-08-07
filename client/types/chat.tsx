export interface Message {
  id: string
  wa_id: string
  name: string
  text: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

export interface Conversation {
  _id: string
  name: string
  lastMessage: string
  lastTimestamp: string
  status: 'sent' | 'delivered' | 'read'
}

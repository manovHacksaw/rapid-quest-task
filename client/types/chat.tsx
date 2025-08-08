export interface Conversation {
  _id: string
  name: string
  lastMessage: string
  lastTimestamp: string | number
  status: string
}

export interface Message {
  id: string
  wa_id: string
  name: string
  text: string
  timestamp: string | number
  status: string
}

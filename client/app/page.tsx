'use client'

import { useState, useEffect } from 'react'
import { ConversationsList } from '@/components/conversation-list'
import { ChatArea } from '@/components/chat-area'
import { Conversation, Message } from '@/types/chat'

const API_BASE_URL = 'http://localhost:5000/api'

export default function WhatsAppClone() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations()
  }, [])

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/conversations`)
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (wa_id: string) => {
    try {
      setMessagesLoading(true)
      const response = await fetch(`${API_BASE_URL}/messages/${wa_id}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setMessagesLoading(false)
    }
  }

  const sendMessage = async (text: string) => {
    if (!selectedConversation || !text.trim()) return

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wa_id: selectedConversation._id,
          name: selectedConversation.name,
          text: text.trim(),
        }),
      })

      if (response.ok) {
        // Refresh messages after sending
        await fetchMessages(selectedConversation._id)
        // Refresh conversations to update last message
        await fetchConversations()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <ConversationsList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          loading={loading}
          onRefresh={fetchConversations}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea
          conversation={selectedConversation}
          messages={messages}
          loading={messagesLoading}
          onSendMessage={sendMessage}
          onRefresh={() => selectedConversation && fetchMessages(selectedConversation._id)}
        />
      </div>
    </div>
  )
}

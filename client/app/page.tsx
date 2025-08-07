'use client'

import { useState, useEffect } from 'react'
import { ConversationsList } from '@/components/conversation-list'
import { ChatArea } from '@/components/chat-area'
import { StatusPage } from '@/components/status-page'
import { StatusWelcome } from '@/components/status-welcome'
import { LeftNavigation } from '@/components/left-navigation'
import { Conversation, Message } from '@/types/chat'
import { WhatsAppLoading } from '@/components/whatsapp-loading'

const API_BASE_URL = 'http://localhost:5000/api'

type ActiveTab = 'chats' | 'status' | 'channels' | 'communities' | 'settings' | 'profile'

export default function WhatsAppClone() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats')

  // Fetch conversations on component mount
  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setInitialLoading(false)
      fetchConversations()
      fetchAllMessages()
    }, 3000) // 3 seconds loading time

    return () => clearTimeout(timer)
  }, [])

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation && activeTab === 'chats') {
      fetchMessages(selectedConversation._id)
      setShowChat(true)
    }
  }, [selectedConversation, activeTab])

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`)
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
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

  const fetchAllMessages = async () => {
    try {
      // Fetch all messages for search functionality
      const response = await fetch(`${API_BASE_URL}/messages`)
      const data = await response.json()
      setAllMessages(data)
    } catch (error) {
      console.error('Failed to fetch all messages:', error)
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
        // Refresh all messages for search
        await fetchAllMessages()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleBack = () => {
    setShowChat(false)
    setSelectedConversation(null)
  }

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab)
    if (tab !== 'chats') {
      setShowChat(false)
      setSelectedConversation(null)
    }
  }

  if (initialLoading) {
    return <WhatsAppLoading />
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <>
            {/* Sidebar - Hidden on mobile when chat is open */}
            <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] lg:w-[420px] flex-col border-r border-[#313D45]`}>
              <ConversationsList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
                loading={false}
                onRefresh={fetchConversations}
                messages={allMessages}
              />
            </div>

            {/* Main Chat Area - Full width on mobile when chat is open */}
            <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
              <ChatArea
                conversation={selectedConversation}
                messages={messages}
                loading={messagesLoading}
                onSendMessage={sendMessage}
                onRefresh={() => selectedConversation && fetchMessages(selectedConversation._id)}
                onBack={handleBack}
              />
            </div>
          </>
        )
      case 'status':
        return (
          <>
            <div className="w-full md:w-[400px] lg:w-[420px] flex-col border-r border-[#313D45] flex">
              <StatusPage />
            </div>
            <div className="flex-1 flex-col hidden md:flex">
              <StatusWelcome />
            </div>
          </>
        )
      case 'channels':
      case 'communities':
      case 'settings':
      case 'profile':
        return (
          <div className="flex-1 flex items-center justify-center whatsapp-chat-bg">
            <div className="text-center text-[#8696A0]">
              <h2 className="text-2xl font-light text-[#E9EDEF] mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-sm">This feature is coming soon</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-[#111B21] overflow-hidden">
      {/* Left Navigation */}
      <LeftNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadCount={99}
      />

      {/* Main Content */}
      <div className="flex flex-1">
        {renderMainContent()}
      </div>
    </div>
  )
}

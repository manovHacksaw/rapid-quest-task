'use client'

import { useState, useEffect } from 'react'
import { ConversationsList } from '@/components/conversation-list'
import { ChatArea } from '@/components/chat-area'
import { StatusPage } from '@/components/status-page'
import { StatusWelcome } from '@/components/status-welcome'
import { LeftNavigation } from '@/components/left-navigation'
import { Conversation, Message } from '@/types/chat'
import { WhatsAppLoading } from '@/components/whatsapp-loading'
import { SettingsPage } from '@/components/settings-page'
import { SettingsWelcome } from '@/components/settings-welcome'
import { ProfilePage } from '@/components/profile-page'
import { ProfileWelcome } from '@/components/profile-welcome'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { MobileStatusBar } from '@/components/mobile-status-bar'
import { useSocket } from '@/hooks/use-socket'

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
  const [mobileActiveTab, setMobileActiveTab] = useState<'chats' | 'updates' | 'communities' | 'calls'>('chats')

  const socket = useSocket();

   useEffect(() => {
    if (!socket) return

    // Listen for new messages
    const handleNewMessage = (newMessage: Message) => {
      console.log('📨 New message received:', newMessage)
      
      // Update messages if it's for the current conversation
      if (selectedConversation && newMessage.wa_id === selectedConversation._id) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id)
          if (exists) return prev
          return [...prev, newMessage]
        })
      }

      // Update all messages for search
      setAllMessages(prev => {
        const exists = prev.some(msg => msg.id === newMessage.id)
        if (exists) return prev
        return [...prev, newMessage]
      })

      // Update conversations list
      fetchConversations()
    }

    // Listen for message status updates
    const handleMessageStatusUpdate = (data: { messageId: string, status: string }) => {
      console.log('🔄 Message status updated:', data)
      
      // Update current messages
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, status: data.status }
            : msg
        )
      )

      // Update all messages
      setAllMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, status: data.status }
            : msg
        )
      )
    }

    socket.on('newMessage', handleNewMessage)
    socket.on('messageStatusUpdate', handleMessageStatusUpdate)

    return () => {
      socket.off('newMessage', handleNewMessage)
      socket.off('messageStatusUpdate', handleMessageStatusUpdate)
    }
  }, [socket, selectedConversation])

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

  const handleMobileTabChange = (tab: 'chats' | 'updates' | 'communities' | 'calls') => {
    setMobileActiveTab(tab)
    // Map mobile tabs to main tabs
    switch (tab) {
      case 'chats':
        setActiveTab('chats')
        break
      case 'updates':
        setActiveTab('status')
        break
      case 'communities':
        setActiveTab('communities')
        break
      case 'calls':
        // Handle calls tab - could be a separate feature
        break
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
      case 'settings':
        return (
          <>
            <div className="w-full md:w-[400px] lg:w-[420px] flex-col border-r border-[#313D45] flex">
              <SettingsPage />
            </div>
            <div className="flex-1 flex-col hidden md:flex">
              <SettingsWelcome />
            </div>
          </>
        )
      case 'profile':
        return (
          <>
            <div className="w-full md:w-[400px] lg:w-[420px] flex-col border-r border-[#313D45] flex">
              <ProfilePage />
            </div>
            <div className="flex-1 flex-col hidden md:flex">
              <ProfileWelcome />
            </div>
          </>
        )
      case 'channels':
      case 'communities':
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

  // Calculate real unread count
  const unreadCount = conversations.filter(conv => conv.status === 'unread').length

  return (
    <div className="flex h-screen bg-[#111B21] overflow-hidden">
      {/* Left Navigation - Hidden on mobile */}
      <div className="hidden md:block">
        <LeftNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadCount={unreadCount}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex flex-1">
          {renderMainContent()}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeTab={mobileActiveTab}
          onTabChange={handleMobileTabChange}
          unreadCount={unreadCount}
          showChat={showChat}
        />
      </div>
    </div>
  )
}

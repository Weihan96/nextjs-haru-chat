"use client"

import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getComprehensiveChatData, getChatMessagesPage, type ComprehensiveChatData } from '@/lib/actions/chat'
import { ChatListDatum, ChatMessage, CompanionData } from '@/types/chat'

// Helper function to transform comprehensive chats to chat previews
function transformToChatListData(chats: ComprehensiveChatData[]): ChatListDatum[] {
  return chats.map(chat => ({
    id: chat.id,
    name: chat.companion.name,
    avatar: chat.companion.imageUrl || '/placeholder-avatar.png',
    lastMessage: chat.recentMessages[0]?.content || 'No messages yet',
    timestamp: chat.recentMessages[0]?.createdAt.toISOString() || chat.lastMessageAt.toISOString(),
    unread: false, // TODO: Implement unread logic
    unreadCount: 0, // TODO: Implement unread count
  }))
}

// Helper function to transform comprehensive companion data to UI format
function transformToCompanionData(companion: ComprehensiveChatData['companion']): CompanionData {
  return {
    id: companion.id,
    name: companion.name,
    avatar: companion.imageUrl ?? '/placeholder-avatar.png',
    description: companion.description ?? '',
    tags: companion.tags.map(ct => ct.tag.name)
  }
}

// Helper function to transform comprehensive messages to chat messages
function transformToChatMessages(messages: ComprehensiveChatData['recentMessages'], userId: string): ChatMessage[] {
  return messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    timestamp: msg.createdAt.toISOString(),
    isUser: msg.senderId === userId, // Compares database user IDs (external_id or Clerk ID)
    image: msg.attachments[0]?.imageUrl
  })).reverse() // Reverse to show oldest first (normal chat order)
}

// Main comprehensive chat data hook
export function useComprehensiveChat(options?: {
  enabled?: boolean
}) {
  const { enabled = true } = options || {}
  
  const query = useInfiniteQuery({
    queryKey: ['chats', 'comprehensive'],
    queryFn: ({ pageParam = 0 }) => getComprehensiveChatData(pageParam),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasNextPage ? pages.length : undefined,
    enabled: enabled, // Pure enabled prop, no userId dependency
    staleTime: 1 * 60 * 1000, // 1 minute
    initialPageParam: 0
  })

  // Handle errors with toast notifications
  useEffect(() => {
    if (query.error) {
      let errorMessage = 'An unexpected error occurred'
      let debugInfo = query.error.message

      try {
        const errorData = JSON.parse(query.error.message)
        errorMessage = errorData.message || errorMessage
        debugInfo = errorData.debug
      } catch {
        // Use default message for non-JSON errors
      }

      console.error('🔴 useComprehensiveChat error:', debugInfo)
      toast.error('Failed to load chat data', {
        description: errorMessage,
        duration: Infinity
      })
    }
  }, [query.error])

  // Transform data for easy consumption
  const allChats = query.data?.pages.flatMap(page => page.chats) ?? []
  const chatListItems = transformToChatListData(allChats)

  return {
    ...query,
    allChats,
    chatListItems,
    // Helper functions to get specific chat data
    getChatData: (chatId?: string) => allChats.find(chat => chat.id === chatId),
    getCompanionData: (chatId?: string) => {
      const chat = allChats.find(chat => chat.id === chatId)
      return chat ? transformToCompanionData(chat.companion) : undefined
    },
    getRecentMessages: (chatId: string) => {
      const chat = allChats.find(chat => chat.id === chatId)
      if (!chat) return []
      
      return transformToChatMessages(chat.recentMessages, chat.userId)
    }
  }
}

// Hook for infinite scrolling of additional messages within a chat
export function useInfiniteChatMessages(chatId: string, options?: {
  enabled?: boolean
  initialData?: {
    pages: ChatMessage[][]
    pageParams: number[]
  }
}) {
  const { enabled = true, initialData } = options || {}
  
  const query = useInfiniteQuery({
    queryKey: ['chat', 'messages', chatId],
    queryFn: ({ pageParam = 0 }) => 
      getChatMessagesPage(chatId, pageParam),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasNextPage ? pages.length : undefined,
    enabled: enabled, // Pure enabled prop, chatId is guaranteed to exist
    staleTime: 30 * 1000, // 30 seconds
    initialPageParam: 0,
    // Convert initial ChatMessage[] to the expected server response format
    initialData: initialData ? {
      pages: initialData.pages.map(messages => ({
        messages,
        hasNextPage: true // Assume there might be more messages
      })),
      pageParams: initialData.pageParams
    } : undefined
  })

  // Handle errors with toast notifications
  useEffect(() => {
    if (query.error) {
      let errorMessage = 'An unexpected error occurred'
      let debugInfo = query.error.message

      try {
        const errorData = JSON.parse(query.error.message)
        errorMessage = errorData.message || errorMessage
        debugInfo = errorData.debug
      } catch {
        // Use default message for non-JSON errors
      }

      console.error('🔴 useInfiniteChatMessages error:', debugInfo)
      toast.error('Failed to load messages', {
        description: errorMessage,
        duration: Infinity
      })
    }
  }, [query.error])

  // Flatten and reverse messages to show oldest first
  const allMessages = query.data?.pages.flatMap(page => page.messages).reverse() ?? []

  return {
    ...query,
    data: allMessages
  }
} 
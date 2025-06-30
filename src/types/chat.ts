// UI-specific types for chat functionality

export interface ChatListDatum {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: boolean
  unreadCount?: number
}

export interface ChatMessage {
  id: string
  content: string
  timestamp: string
  isUser: boolean
  image?: string
}

// Companion data that UI components expect
export interface CompanionData {
  id: string
  name: string
  avatar: string
  description: string
  tags: string[]
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  snippet: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  // From ChatMessage
  isUser?: boolean;
  image?: string;
  // From ChatPreview
  name?: string;
  avatar?: string;
  unread?: boolean;
  lastMessage?: string; // Add this to avoid needing to duplicate in ChatPreview
}

export type ChatMessage = Message;
export type ChatPreview = Pick<Message, 'id' | 'name' | 'avatar' | 'timestamp' | 'unread'> & {
  content: string; // Keep this for type compatibility
  lastMessage: string; // This is required for chat previews
  unreadCount?: number; // Number of unread messages
};

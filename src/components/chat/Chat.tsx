"use client"

import React from 'react';
import { useParams } from "next/navigation";
import { useIsMobile } from '@/hooks/use-mobile';
import { MOCK_CHATS, INITIAL_MESSAGES } from '@/data/messages';
import { COMPANION_BY_ID } from '@/data/companions';
import ChatMobileLayout from '@/components/chat/ChatMobileLayout';
import ChatDesktopLayout from '@/components/chat/ChatDesktopLayout';

const Chat = () => {
  const params = useParams();
  const chatId = params.chatId as string;
  const isMobile = useIsMobile();
  
  const currentChat = chatId ? COMPANION_BY_ID[chatId] : null;
  const currentMessages = chatId ? INITIAL_MESSAGES[chatId] || [] : [];
  
  // Mobile view with nested navigation
  if (isMobile) {
    return (
        <ChatMobileLayout 
          currentChat={currentChat} 
          currentMessages={currentMessages}
          chatId={chatId}
          chatHistories={MOCK_CHATS}
        />
    );
  }
  
  // Desktop view with resizable panels
  return (
      <ChatDesktopLayout 
        currentChat={currentChat}
        currentMessages={currentMessages}
        chatHistories={MOCK_CHATS}
      />
  );
};

export default Chat;

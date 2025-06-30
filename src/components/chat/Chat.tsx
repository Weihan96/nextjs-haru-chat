"use client"

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatMobileLayout from '@/components/chat/ChatMobileLayout';
import ChatDesktopLayout from '@/components/chat/ChatDesktopLayout';

const Chat = () => {
  const isMobile = useIsMobile();
  
  // Mobile view with nested navigation
  if (isMobile) {
    return <ChatMobileLayout />;
  }
  
  // Desktop view with resizable panels
  return <ChatDesktopLayout />;
};

export default Chat;

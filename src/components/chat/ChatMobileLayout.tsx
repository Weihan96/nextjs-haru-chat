"use client"

import React from 'react';
import { useRouter } from "next/navigation";
import { ChatMessage, ChatPreview } from '@/types/chat';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInfoPanel from '@/components/chat/ChatInfoPanel';
import ChatHeader from '@/components/chat/ChatHeader';
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"
import CompanionProfile from './CompanionProfile';
import { MOCK_CHAT_HISTORIES } from '@/data/messages';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface ChatMobileLayoutProps {
  currentChat: {
    id: string;
    name: string;
    avatar: string;
    description: string;
    tags: string[];
  } | null;
  currentMessages: ChatMessage[];
  chatId: string | undefined;
  chatHistories: ChatPreview[];
}

const ChatMobileLayout = ({ 
  currentChat, 
  currentMessages, 
  chatId,
  chatHistories
}: ChatMobileLayoutProps) => {
  const router = useRouter();
  // Show chat list when no conversation is selected
  if (!chatId || !currentChat) {
    return (
        <ChatList chats={chatHistories} />
    );
  }  
  // Show chat window with info panel in a drawer
  return (
    <Drawer defaultOpen={false}>
      <div className="flex flex-col h-full">
        <ChatHeader companion={currentChat}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <Info size={20} />
            </Button>
          </DrawerTrigger>
        </ChatHeader>
        <div className='flex-1 overflow-hidden'>
          <ChatWindow
            companion={currentChat}
            initialMessages={currentMessages}
          />
        </div>
      </div>
      <DrawerContent>
        <div className="h-[80vh] max-h-[80vh] overflow-scroll overscroll-contain">
        {/* Companion Profile */}
        <DrawerHeader>
          <DrawerTitle className='flex items-center justify-center'>
            <CompanionProfile companion={currentChat}/>
          </DrawerTitle>
          <DrawerDescription>{currentChat.description}</DrawerDescription>
        </DrawerHeader>
        {/* Chat Info Panel */}
        <ChatInfoPanel
          companion={currentChat}
          chatHistories={MOCK_CHAT_HISTORIES}
          onRestart={() => router.push(`/chat/${currentChat.id}`)}
        />
        </div>
      </DrawerContent>          
    </Drawer>
  );
};

export default ChatMobileLayout;

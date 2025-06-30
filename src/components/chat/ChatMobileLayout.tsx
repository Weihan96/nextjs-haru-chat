"use client"

import React from 'react';
import { useParams, useRouter } from "next/navigation";
import { useComprehensiveChat } from '@/hooks/use-chat';
import { useUser } from '@clerk/nextjs';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInfoPanel from '@/components/chat/ChatInfoPanel';
import ChatHeader from '@/components/chat/ChatHeader';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import CompanionProfile from './CompanionProfile';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMobileLayoutProps {
  className?: string;
}

const ChatMobileLayout = ({ className }: ChatMobileLayoutProps) => {
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;
  
  // Handle authentication
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.externalId || undefined;
  
  // Get chat data
  const { getCompanionData, isLoading, error } = useComprehensiveChat({
    enabled: isLoaded && isSignedIn && !!userId
  });
  
  // Get current chat data from the comprehensive fetch
  const companion = getCompanionData(chatId);

  // Loading and error states
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chats…</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading chats</div>;
  }
  
  // Show chat list when no conversation is selected
  if (!chatId || !companion) {
    return <ChatList />;
  }  
  
  // Show chat window with info panel in a drawer
  return (
    <Drawer defaultOpen={false}>
      <div className="flex flex-col h-full">
        <ChatHeader>
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
          <ChatWindow />
        </div>
      </div>
      <DrawerContent>
        <div className="h-[80vh] max-h-[80vh] overflow-scroll overscroll-contain">
        {/* Companion Profile */}
        <DrawerHeader>
          <DrawerTitle className='flex items-center justify-center'>
            <CompanionProfile />
          </DrawerTitle>
          <DrawerDescription>{companion.description}</DrawerDescription>
        </DrawerHeader>
        {/* Chat Info Panel */}
        <ChatInfoPanel
            onRestart={() => router.push(`/chat/${chatId}`)}
        />
        </div>
      </DrawerContent>          
    </Drawer>
  );
};

export default ChatMobileLayout;

"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { useComprehensiveChat } from '@/hooks/use-chat';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

import RestartButton from './RestartButton';
import ChatHistory from './ChatHistory';
import ChatSettings from './ChatSettings';
import { ChatHistoryItem } from '@/types/chat';


interface ChatInfoPanelProps {
  onRestart?: () => void;
  className?: string;
}

const ChatInfoPanel = ({
  onRestart,
  className,
}: ChatInfoPanelProps) => {
  const params = useParams();
  const chatId = params.chatId as string;
  
  // Handle authentication
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.externalId || undefined;
  
  // Get current companion data from comprehensive hook
  const { getCompanionData, chatListItems } = useComprehensiveChat({
    enabled: isLoaded && isSignedIn && !!userId
  });
  const companion = getCompanionData(chatId);
  
  // Transform chat previews to chat history format
  const chatHistories: ChatHistoryItem[] = chatListItems.slice(0, 5).map(chat => ({
    id: chat.id,
    title: chat.name,
    date: new Date(chat.timestamp).toLocaleDateString(),
    snippet: chat.lastMessage
  }));
  
  if (!companion) {
    return (
      <div className={cn("flex flex-col h-full p-4", className)}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No chat selected
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col h-full p-4", className)}>      
        {/* Restart Button */}
        {onRestart && companion && (
          <RestartButton 
            onRestart={onRestart} 
            companionName={companion.name} 
            className="w-full mb-8" 
          />
        )}
        
        {/* Chat History */}
        <ChatHistory 
          chatHistories={chatHistories} 
          className="mb-6" 
        />
        
        {/* Chat Settings */}
        <ChatSettings className='pb-20'/>
    </div>
  );
};

export default ChatInfoPanel;

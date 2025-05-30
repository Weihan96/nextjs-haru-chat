"use client"

import React from 'react';
import { cn } from '@/lib/utils';

import RestartButton from './RestartButton';
import ChatHistory from './ChatHistory';
import ChatSettings from './ChatSettings';

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  snippet: string;
}

interface ChatInfoPanelProps {
  companion: {
    id: string;
    name: string;
    avatar: string;
    description: string;
    tags: string[];
  };
  chatHistories: ChatHistory[];
  onRestart: () => void;
  className?: string;
}

const ChatInfoPanel = ({
  companion,
  chatHistories,
  onRestart,
  className,
}: ChatInfoPanelProps) => {
  
  return (
    <div className={cn("flex flex-col h-full p-4", className)}>      
        {/* Restart Button */}
        <RestartButton 
          onRestart={onRestart} 
          companionName={companion.name} 
          className="w-full mb-8" 
        />
        
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

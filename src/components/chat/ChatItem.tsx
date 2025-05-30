"use client"

import React from 'react';
import Link from "next/link";
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChatPreview } from '@/types/chat';
import { cn } from '@/lib/utils';
import StableImage from '@/components/global/StableImage';

interface ChatItemProps {
  chat: ChatPreview;
  isSelected?: boolean;
  isActive?: boolean;
  isManageMode: boolean;
  onSelectChat?: (chatId: string) => void;
}

const ChatItem = ({ 
  chat, 
  isSelected = false, 
  isActive = false,
  isManageMode, 
  onSelectChat 
}: ChatItemProps) => {
  if (isManageMode) {
    return (
      <div 
        className={cn(
          "flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer",
          isActive && "bg-secondary/50"
        )}
        onClick={() => onSelectChat && onSelectChat(chat.id)}
      >
        <Checkbox 
          checked={isSelected}
          className="my-auto"
          onCheckedChange={() => onSelectChat && onSelectChat(chat.id)}
        />
        <ChatItemContent chat={chat} />
      </div>
    );
  }

  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors",
        isActive && "bg-secondary/50"
      )}
    >
      <ChatItemContent chat={chat} />
    </Link>
  );
};

// Extracted the content to avoid duplication
const ChatItemContent = ({ chat }: { chat: ChatPreview }) => {
  return (
    <>
      <Avatar className="h-12 w-12">
        <StableImage src={chat.avatar ?? "no image"} alt={chat.name ?? "no name"} className="object-cover" />
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate">{chat.name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {chat.timestamp}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className={cn(
            "text-sm truncate",
            chat.unread ? "font-medium text-foreground" : "text-muted-foreground"
          )}>
            {chat.lastMessage}
          </p>
          
          {!!chat.unreadCount && chat.unreadCount > 0 && (
            <Badge 
              variant="default" 
              className="ml-2 text-xs h-5 min-w-5 flex items-center justify-center rounded-full bg-primary px-1.5"
            >
              {chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatItem;

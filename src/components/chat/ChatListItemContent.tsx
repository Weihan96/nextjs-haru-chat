"use client"

import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { ChatListDatum } from '@/types/chat';
import { cn } from '@/lib/utils';
import Image from "next/image";



// Extracted the content to avoid duplication
const ChatListItemContent = ({ chat }: { chat: ChatListDatum }) => {
  return (
    <>
      <Avatar className="h-12 w-12">
        <Image src={chat.avatar ?? "placeholder.svg"} alt={chat.name ?? "no name"} className="object-cover" width={48} height={48}/>
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

export default ChatListItemContent;

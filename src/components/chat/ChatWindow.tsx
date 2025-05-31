"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatInput from './ChatInput';
import Image from "next/image";

interface ChatWindowProps {
  companion?: {
    id: string;
    name: string;
    avatar: string;
  };
  initialMessages: Message[];

  className?: string;
}

const ChatWindow = ({ companion, initialMessages, className }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Update messages when initialMessages prop changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (input: string) => {
    if (input.trim() && companion) {
      // Add user message
      const userMessage = {
        id: `u${Date.now()}`,
        content: input,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse = {
          id: `a${Date.now()}`,
          content: `This is a simulated response to: "${input}"`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([...updatedMessages, aiResponse]);
      }, 1000);
    }
  };

  // No chat selected state (desktop only)
  if (!companion) {
    if(isMobile) return null;
     return (
        <div className={cn("flex flex-col h-full items-center justify-center bg-muted/10", className)}>
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-2">Select a chat</h2>
            <p className="text-muted-foreground">
              Choose a conversation from the sidebar to start messaging.
            </p>
          </div>
        </div>
      );
  }

  return (
    <div className={cn("flex flex-col flex-1 h-full", className)}>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "chat-bubble",
                  message.isUser ? "chat-bubble-user" : "chat-bubble-ai"
                )}
              >
                <div className="flex gap-2">
                  {!message.isUser && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <Image src={companion.avatar} alt={companion.name} className="object-cover" width={32} height={32}/>
                    </Avatar>
                  )}
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="whitespace-pre-wrap break-all max-w-80vw md:max-w-65vw">
                      {message.content}
                    </div>
                    
                    {message.image && (
                      <div className="mt-2 relative">
                        <Image
                          src={message.image}
                          alt="Shared content"
                          className="rounded-md max-w-full" width={500} height={300} />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      {!message.isUser && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full p-0">
                          <Bookmark size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;

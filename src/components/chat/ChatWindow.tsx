"use client"


import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bookmark, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatWindowProps {
  companion?: {
    id: string;
    name: string;
    avatar: string;
  };
  initialMessages: Message[];
  onOpenInfo?: () => void;
  className?: string;
}

const ChatWindow = ({ companion, initialMessages, onOpenInfo, className }: ChatWindowProps) => {
  const [input, setInput] = useState('');
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
  
  const handleSendMessage = () => {
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
      setInput('');
      
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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // No chat selected state (desktop only)
  if (!companion && !isMobile) {
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
    <>
      <ScrollArea className="flex-1 overscroll-contain">
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
                {!message.isUser && companion && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <img src={companion.avatar} alt={companion.name} className="object-cover" />
                  </Avatar>
                )}
                <div className="flex-1 space-y-1">
                  {message.content}
                  
                  {message.image && (
                    <div className="mt-2 relative">
                      <img
                        src={message.image}
                        alt="Shared content"
                        className="rounded-md max-w-full"
                      />
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
      
      {companion && (
        <div className="p-3 border-t border-border sticky bottom-0 bg-background">
          <div className="relative">
            <Textarea
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-12 resize-none min-h-[60px]"
              rows={1}
            />
            <Button
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
              onClick={handleSendMessage}
              disabled={!input.trim()}
            >
              <Send size={16} />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;

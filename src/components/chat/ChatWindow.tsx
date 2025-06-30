"use client"

import React, { useEffect, useRef } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bookmark, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComprehensiveChat, useInfiniteChatMessages } from '@/hooks/use-chat';
import { ChatMessage } from '@/types/chat';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatInput from './ChatInput';
import Image from "next/image";
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

// LoadMoreAnchor component for auto-loading more messages when in viewport
const LoadMoreAnchor: React.FC<{ 
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}> = ({ hasNextPage, isFetchingNextPage, fetchNextPage }) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: '100px', // Trigger 100px before entering viewport
        threshold: 0.1
      }
    );

    observer.observe(anchor);

    return () => {
      observer.unobserve(anchor);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Only render if there are more pages to load
  if (!hasNextPage && !isFetchingNextPage) return null;

  return (
    <div ref={anchorRef} className="p-4 text-center">
      {isFetchingNextPage ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading older messages...</span>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Scroll up to load more messages</div>
      )}
    </div>
  );
};

// ScrollToBottomAnchor component for auto-scrolling when new messages arrive
const ScrollToBottomAnchor: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  useEffect(() => {
    // Scroll to bottom only when new messages are added (not when edited)
    if (messages.length > prevMessagesLengthRef.current) {
      anchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  return <div ref={anchorRef} />;
};

interface ChatWindowProps {
  className?: string;
}

const ChatWindow = ({ 
  className 
}: ChatWindowProps) => {
  const isMobile = useIsMobile();
  
  const params = useParams();
  const chatId = params.chatId as string;
  
  // Handle authentication
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.externalId || undefined;
  
  // Get companion and recent messages from comprehensive hook (always call hooks)
  const { getCompanionData, getRecentMessages } = useComprehensiveChat({
    enabled: isLoaded && isSignedIn && !!userId && !!chatId
  });
  
  // Call infinite messages hook conditionally but safely
  const shouldFetchMessages = !!chatId && isLoaded && isSignedIn && !!userId;
  const {
    data: messages,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteChatMessages(chatId || '', {
    enabled: shouldFetchMessages,
    // Provide initial data in the correct infinite query format
    initialData: shouldFetchMessages && chatId ? (() => {
      const initialMessages = getRecentMessages(chatId);
      return initialMessages.length > 0 ? {
        pages: [initialMessages],
        pageParams: [0]
      } : undefined;
    })() : undefined
  });
  
  // Early return for no chat selected (desktop only)
  if (!chatId) {
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
  
  const companion = getCompanionData(chatId);

  const handleSendMessage = (input: string) => {
    if (input.trim() && companion) {
      // TODO: Implement actual message sending via mutation
      // For now, just show optimistic update
      console.log('Sending message:', input);
    }
  };

  // No companion found
  if (!companion) {
    if(isMobile) return null;
    return (
      <div className={cn("flex flex-col h-full items-center justify-center bg-muted/10", className)}>
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-2">Chat not found</h2>
          <p className="text-muted-foreground">
            The selected conversation could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center", className)}>
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center", className)}>
        <p className="text-red-500">Error loading messages</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col flex-1 h-full", className)}>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {/* Auto-load more messages when in viewport */}
            <LoadMoreAnchor 
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />

            {/* Messages */}
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
            
            <ScrollToBottomAnchor messages={messages} />
          </div>
        </ScrollArea>
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow; 
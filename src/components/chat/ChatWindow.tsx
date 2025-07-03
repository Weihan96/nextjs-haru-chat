"use client"

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComprehensiveChat, useInfiniteChatMessages } from '@/hooks/use-chat';
import { ChatMessage } from '@/types/chat';
import { useIsMobile } from '@/hooks/use-mobile';
import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

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
  const { getCompanionData, getRecentMessages, getChatData } = useComprehensiveChat({
    enabled: isLoaded && isSignedIn && !!userId && !!chatId
  });
  
  // Get companion data and chat data
  const companion = getCompanionData(chatId);
  const chatData = getChatData(chatId);
  
  // Call infinite messages hook conditionally but safely
  const shouldFetchMessages = !!chatId && isLoaded && isSignedIn && !!userId;
  const {
    data: actualMessages,
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
  
  // Inject start message when we've loaded all messages (hasNextPage is false)
  const messages = (() => {
    if (!hasNextPage && companion && chatData) {
      const startMessage: ChatMessage = {
        id: `start-message-${chatId}`,
        content: companion.startMessage,
        timestamp: chatData.createdAt.toISOString(),
        isUser: false,
        image: undefined
      };
      
      // Add start message at the beginning if not already present
      if (actualMessages.length === 0 || actualMessages[0]?.id !== startMessage.id) {
        return [startMessage, ...actualMessages];
      }
    }
    
    return actualMessages;
  })();

  const handleSendMessage = (input: string) => {
    if (input.trim() && companion) {
      // TODO: Implement actual message sending via mutation
      // For now, just show optimistic update
      console.log('Sending message:', input);
    }
  };

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

  // Show loading spinner
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
            {/* Auto-load more messages when in viewport (only if we have enough messages) */}
            {messages.length >= 10 && (
              <LoadMoreAnchor 
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              />
            )}

            {/* Messages using ChatBubble component */}
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                companionAvatar={companion.avatar}
                companionName={companion.name}
                isUnread={false} // Will be true for real-time messages later
                />
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

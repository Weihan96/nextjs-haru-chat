"use client"

import React, { useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useComprehensiveChat } from '@/hooks/use-chat';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { useUser } from '@clerk/nextjs';

import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ChatInfoPanel from './ChatInfoPanel';
import ChatHeader from './ChatHeader';
import CompanionProfile from './CompanionProfile';

import { ScrollArea } from '@/components/ui/scroll-area';

const ChatDesktopLayout = () => {
  const params = useParams();
  const chatId = params.chatId as string;
  const router = useRouter();
  
  // Handle authentication
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.externalId || undefined;
  
  // Get chat data
  const { getCompanionData, isLoading, error } = useComprehensiveChat({
    enabled: isLoaded && isSignedIn && !!userId
  });
  
  // Get current chat data from the comprehensive fetch
  const companion = getCompanionData(chatId);

  const ref = React.useRef<ImperativePanelHandle>(null);

  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  
  // Handle panel size changes
  const handlePanelResize = (size: number) => {
    setIsPanelExpanded(size > 0);
  };

  const toggleInfoPanel = () => {
    const panel = ref.current;
    if (panel) {
      if (panel.isExpanded()) panel.collapse()
      else panel.expand();
    }
  };

  const [isResizing, setIsResizing] = useState(false);

  // Loading and error states
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full">Loading authentication…</div>;
  }

  if (!isSignedIn) {
    return <div className="flex items-center justify-center h-full">Please sign in to access chats</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading chats…</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error loading chats</div>;
  }

  return (
    <ResizablePanelGroup autoSaveId="chat-list" direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={50}>
        <ChatList />
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel defaultSize={75}>
        <div className="flex flex-col h-full">
          {companion && (
            <ChatHeader >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleInfoPanel}
                className={cn(isPanelExpanded && "text-primary")}
              >
                <Info size={20} />
              </Button>
            </ChatHeader>
          )}
          <ResizablePanelGroup autoSaveId="chat-window" direction="horizontal">
            <ResizablePanel>
              <ChatWindow />
            </ResizablePanel>
            
            <ResizableHandle onDragging={(e) => setIsResizing(e)}/>
            
            {companion && <ResizablePanel 
              ref={ref}
              defaultSize={40} minSize={30} maxSize={60}
              collapsible={true}
              collapsedSize={0}
              onResize={handlePanelResize}
              className={cn(
                !isResizing && "transition-all duration-200 ease-out"
              )}
            >
              
              <ScrollArea className='h-full'>
                {/* Companion Profile */}
                <CompanionProfile className='p-4' />
                <p className="px-4 text-sm font-normal text-muted-foreground">{companion.description}</p>
                {/* Chat Info Panel */}
                <ChatInfoPanel
                  onRestart={() => router.push(`/chat/${chatId}`)}
                />
              </ScrollArea>
            </ResizablePanel>}
          </ResizablePanelGroup>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatDesktopLayout;

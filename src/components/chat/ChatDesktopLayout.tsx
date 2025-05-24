"use client"


import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { ImperativePanelHandle } from 'react-resizable-panels';

import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ChatInfoPanel from './ChatInfoPanel';
import ChatHeader from './ChatHeader';
import CompanionProfile from './CompanionProfile';

import { MOCK_CHAT_HISTORIES } from '@/data/messages';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatDesktopLayoutProps {
  currentChat: {
    id: string;
    name: string;
    avatar: string;
    description: string;
    tags: string[];
  } | null;
  currentMessages: any[];
  chatHistories: any[];
}

const ChatDesktopLayout = ({ 
  currentChat, 
  currentMessages,
  chatHistories 
}: ChatDesktopLayoutProps) => {
  const router = useRouter();

  const ref = React.useRef<ImperativePanelHandle>(null);

  const [showInfoPanel, setShowInfoPanel] = useState(false); 
  
  // Update showInfoPanel based on panel state
  React.useEffect(() => {
    const panel = ref.current;
    if (panel) {
      setShowInfoPanel(panel.isExpanded());
    }
  }, [ref.current, showInfoPanel]);

  // Toggle info panel
  const toggleInfoPanel = () => setShowInfoPanel(prev=>{
    const panel = ref.current;
    if (panel) {
      if (panel.isExpanded()) panel.collapse()
      else panel.expand();
    }
    return !prev;
  });

  const [isResizing, setIsResizing] = useState(false);

  return (
    <ResizablePanelGroup autoSaveId="chat-list" direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={50}>
        {/* The chat list is somehow jiggle when the panel is resized */}
        <ChatList 
          chats={chatHistories}
          className="h-full"
        />
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel defaultSize={75}>
        {currentChat && (
          <ChatHeader 
            companion={currentChat} 
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleInfoPanel}
              className={cn(showInfoPanel && "text-primary")}
            >
              <Info size={20} />
            </Button>
          </ChatHeader>
        )}
        
        <ResizablePanelGroup autoSaveId="chat-window" direction="horizontal" className='pt-16'>
          <ResizablePanel>
            <ChatWindow
              companion={currentChat || undefined}
              initialMessages={currentMessages}
            />
          </ResizablePanel>
          
          <ResizableHandle onDragging={(e) => setIsResizing(e)}/>
          
          <ResizablePanel 
          ref={ref}
          defaultSize={40} minSize={30} maxSize={60}
          collapsible={true}
          collapsedSize={0}
          className={cn(
            !isResizing && "transition-all duration-200 ease-out"
            )}
          >
            {currentChat && 
            <ScrollArea className='h-full overscroll-contain'>
              {/* Companion Profile */}
              <CompanionProfile className='p-4' companion={currentChat}/>
              <p className="px-4 text-sm font-normal text-muted-foreground">{currentChat.description}</p>
              {/* Chat Info Panel */}
              <ChatInfoPanel
                companion={currentChat}
                chatHistories={MOCK_CHAT_HISTORIES}
                onRestart={() => router.push(`/chat/${currentChat.id}`)}
              />
            </ScrollArea>}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatDesktopLayout;

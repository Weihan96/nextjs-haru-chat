"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { MoreVertical, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useParams } from "next/navigation";
import { ChatPreview } from '@/types/chat';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import ChatSearch from './ChatSearch';
import ChatItem from './ChatItem';
import ChatManageMode from './ChatManageMode';
import ChatDeleteDialog from './ChatDeleteDialog';
import { useSyncWidth } from '@/hooks/use-sync-width';

interface ChatListProps {
  chats: ChatPreview[];
  className?: string;
}

const ChatList = ({ chats, className }: ChatListProps) => {
  const params = useParams();
  const chatId = params.chatId as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Handle search functionality
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredChats(chats);
      return;
    }
    
    const filtered = chats.filter(
      chat => chat.name?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredChats(filtered);
  }, [chats]);

  const toggleManageMode = () => {
    if (isManageMode) {
      // Exit manage mode
      setIsManageMode(false);
      setSelectedChats([]);
      setSelectAll(false);
    } else {
      // Enter manage mode
      setIsManageMode(true);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChats(prev => {
      if (prev.includes(chatId)) {
        return prev.filter(id => id !== chatId);
      } else {
        return [...prev, chatId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedChats([]);
      setSelectAll(false);
    } else {
      // Select all
      setSelectedChats(filteredChats.map(chat => chat.id));
      setSelectAll(true);
    }
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedChats.length > 0) {
      // Here you would actually delete the chats
      toast.success(`${selectedChats.length} conversation${selectedChats.length > 1 ? 's' : ''} deleted`, {
        description: "The selected conversations have been successfully removed.",
      });
      setDeleteDialogOpen(false);
      // Exit manage mode after deletion
      toggleManageMode();
    }
  };
  
  // Update filtered chats when the chats prop or search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setFilteredChats(chats);
    }
  }, [chats, searchQuery, handleSearch]);

  // Update selectAll state when selectedChats changes
  useEffect(() => {
    if (selectedChats.length === filteredChats.length && filteredChats.length > 0) {
      setSelectAll(true);
    } else if (selectAll && selectedChats.length !== filteredChats.length) {
      setSelectAll(false);
    }
  }, [selectedChats, filteredChats, selectAll]);
  
  const {sourceRef, targetRef} = useSyncWidth<HTMLDivElement, HTMLDivElement>();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div ref={sourceRef} className="px-4 py-3 border-b border-border bg-background">
        {!isManageMode ? (
          <div className="flex items-center gap-2">
            <ChatSearch 
              searchQuery={searchQuery} 
              onSearch={handleSearch} 
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-[70]">
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={toggleManageMode}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Manage chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <ChatManageMode 
            selectedChats={selectedChats}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
            onDelete={openDeleteDialog}
            onCancel={toggleManageMode}
          />
        )}
      </div>
      
      <ScrollArea className="flex-1 overscroll-contain">
        <div ref={targetRef} className="divide-y divide-border">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div key={chat.id} className="relative">
                <ChatItem 
                  chat={chat}
                  isSelected={selectedChats.includes(chat.id)}
                  isActive={chatId === chat.id}
                  isManageMode={isManageMode}
                  onSelectChat={handleSelectChat}
                />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No chats found. Start a conversation with an AI companion.
            </div>
          )}
        </div>
      </ScrollArea>
         
      <ChatDeleteDialog 
        isOpen={deleteDialogOpen}
        selectedCount={selectedChats.length}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ChatList;

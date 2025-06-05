"use client"

import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchWithinChat } from '@/hooks/useSearch';

interface ChatSearchProps {
  chatId: string;
  onMessageClick?: (messageId: string) => void;
  onClose?: () => void;
}

const ChatSearch = ({ chatId, onMessageClick, onClose }: ChatSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading } = useSearchWithinChat(
    chatId, 
    searchQuery,
    searchQuery.trim().length >= 2
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMessageClick = (messageId: string) => {
    onMessageClick?.(messageId);
    onClose?.();
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search in this conversation..."
              className="pl-9 pr-10"
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-hidden">
        {!searchQuery.trim() ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Type to search messages in this conversation</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Searching...</span>
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Found {searchResults.length} message{searchResults.length !== 1 ? 's' : ''}
              </p>
              {searchResults.map((message) => (
                <div
                  key={message.id}
                  className="p-3 border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => handleMessageClick(message.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>
                        {(message.sender?.displayName || message.sender?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">
                          {message.sender?.displayName || message.sender?.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>No messages found matching &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSearch;

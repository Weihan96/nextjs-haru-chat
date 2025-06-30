"use client";

import React, { useState, useMemo } from "react";
import { Link, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ChatListDatum } from "@/types/chat";
import ChatListItemContent from "./ChatListItemContent";
import { cn } from "@/lib/utils";

interface ChatSearchContextValue {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredChats: ChatListDatum[];
}

const ChatSearchContext = React.createContext<
  ChatSearchContextValue | undefined
>(undefined);

interface ChatSearchProviderProps {
  children: React.ReactNode;
  chatListItems: ChatListDatum[];
}

const ChatSearchProvider = ({
  children,
  chatListItems,
}: ChatSearchProviderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatListItems;
    }
    return chatListItems.filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatListItems, searchQuery]);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      filteredChats,
    }),
    [searchQuery, filteredChats, chatListItems]
  );

  return (
    <ChatSearchContext.Provider value={value}>
      {children}
    </ChatSearchContext.Provider>
  );
};

function useChatSearch() {
  const context = React.useContext(ChatSearchContext);
  if (context === undefined) {
    throw new Error("useChatSearch must be used within a ChatSearchProvider");
  }
  return context;
}

interface ChatSearchInputProps {
  onInputFocus: () => void;
  onInputBlur: () => void;
}

const ChatSearchInput = ({
  onInputFocus,
  onInputBlur,
}: ChatSearchInputProps) => {
  const { searchQuery, setSearchQuery } = useChatSearch();
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search conversations"
        className="pl-9 pr-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
      <X
        className={cn(
          "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer transition-opacity duration-200 ease-in-out",
          searchQuery
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSearchQuery("")}
        aria-label="Clear search"
      />
    </div>
  );
};

const ChatSearchResult = () => {
  const { filteredChats, searchQuery } = useChatSearch();
  if (searchQuery.length === 0)
    return null; // TODO: Add recent search and recommended chats
  return (
    <div className="divide-y divide-border">
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <div key={chat.id} className="relative">
            <Link
              href={`/chat/${chat.id}`}
              className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
            >
              <ChatListItemContent chat={chat} />
            </Link>
          </div>
        ))
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          No chats found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export { ChatSearchInput, ChatSearchResult, ChatSearchProvider, useChatSearch };

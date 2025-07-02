"use client";

import React, { useState } from "react";
import { MoreVertical, Settings } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useComprehensiveChat } from "@/hooks/use-chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ChatManageHeader, {
  ChatManageItem,
  ChatManageProvider,
} from "./ChatManageMode";
import { useSyncWidth } from "@/hooks/use-sync-width";
import { ChatListDatum } from "@/types/chat";
import ChatListItemContent from "./ChatListItemContent";
import {
  ChatSearchInput,
  ChatSearchResult,
  ChatSearchProvider,
} from "./ChatSearch";

interface ChatListItemProps {
  chat: ChatListDatum;
  isActive?: boolean;
}

const ChatListItem = ({ chat, isActive = false }: ChatListItemProps) => {
  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors",
        isActive && "bg-secondary/50"
      )}
    >
      <ChatListItemContent chat={chat} />
    </Link>
  );
};

interface ChatListProps {
  className?: string;
}

const ChatList = ({ className }: ChatListProps) => {
  const params = useParams();
  const chatId = params.chatId as string;

  // Handle authentication
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.externalId || undefined;

  // Get chats from hook
  const { chatListItems } = useComprehensiveChat({
    enabled: isLoaded && isSignedIn && !!userId,
  });

  const [mode, setMode] = useState<"search" | "manage" | "default">("default");
  const isManageMode = mode === "manage";
  const isSearchMode = mode === "search";

  const hasChats = chatListItems.length > 0;

  const { sourceRef, targetRef } = useSyncWidth<
    HTMLDivElement,
    HTMLDivElement
  >();

  if (!hasChats) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <div className="p-6 text-center text-muted-foreground">
          No chats found. Start a conversation with an AI companion.
        </div>
      </div>
    );
  }

  return (
    <ChatSearchProvider chatListItems={chatListItems}>
      <ChatManageProvider chatListItems={chatListItems}>
        <div className={cn("flex flex-col h-full", className)}>
          <div
            ref={sourceRef}
            className="px-4 py-3 border-b border-border bg-background"
          >
            {isManageMode ? (
              <ChatManageHeader onCancel={() => setMode("default")} />
            ) : (
              <div className="flex items-center gap-2">
                <ChatSearchInput
                  onInputFocus={() => setMode("search")}
                  onInputBlur={() => setMode("default")}
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
                      onClick={() => setMode("manage")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Manage chat</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div ref={targetRef} className="divide-y divide-border">
                {isSearchMode ? (
                  <ChatSearchResult />
                ) : (
                  chatListItems.map((chat) => (
                    <div key={chat.id} className="relative">
                      {isManageMode ? (
                        <ChatManageItem chat={chat} isActive={false} />
                      ) : (
                        <ChatListItem
                          chat={chat}
                          isActive={chatId === chat.id}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </ChatManageProvider>
    </ChatSearchProvider>
  );
};

export default ChatList;

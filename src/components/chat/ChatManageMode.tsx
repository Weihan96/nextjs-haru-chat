"use client";

import React, { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, X } from "lucide-react";
import { ChatListDatum } from "@/types/chat";
import { cn } from "@/lib/utils";
import ChatListItemContent from "./ChatListItemContent";

interface ChatManageContextValue {
  selectedChats: string[];
  handleSelectedChat: (chatId: string) => void;
  selectAll: boolean;
  handleSelectAll: () => void;
}

const ChatManageContext = React.createContext<
  ChatManageContextValue | undefined
>(undefined);

interface ChatManageProviderProps {
  chatListItems: ChatListDatum[];
  children: React.ReactNode;
}

const ChatManageProvider = ({
  chatListItems,
  children,
}: ChatManageProviderProps) => {
  const [selectedChats, setSelectedChats] = useState<string[]>([]);

  const handleSelectedChat = (chatId: string) => {
    setSelectedChats((prev) => {
      if (prev.includes(chatId)) {
        return prev.filter((id) => id !== chatId);
      } else {
        return [...prev, chatId];
      }
    });
  };

  const selectAll = useMemo(() => {
    return (
      selectedChats.length === chatListItems.length && chatListItems.length > 0
    );
  }, [selectedChats, chatListItems]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedChats([]);
    } else {
      setSelectedChats(chatListItems.map((chat) => chat.id));
    }
  };

  const value: ChatManageContextValue = {
    selectedChats,
    handleSelectedChat,
    selectAll,
    handleSelectAll,
  };

  return (
    <ChatManageContext.Provider value={value}>
      {children}
    </ChatManageContext.Provider>
  );
};

function useChatManage() {
  const context = React.useContext(ChatManageContext);
  if (context === undefined) {
    throw new Error("useChatManage must be used within a ChatManageProvider");
  }
  return context;
}

interface ChatManageHeaderProps {
  onCancel: () => void;
}

const ChatManageHeader = ({
  onCancel,
}: ChatManageHeaderProps) => {
  const { selectedChats, selectAll, handleSelectAll } = useChatManage();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox
          id="selectAll"
          checked={selectAll}
          onCheckedChange={handleSelectAll}
        />
        <div className="flex items-center gap-2">
          <p className="text-sm select-none">Select all</p>
          {selectedChats.length > 0 && (
            <Badge
              variant="default"
              className="text-xs h-5 min-w-5 flex items-center justify-center rounded-full bg-primary px-1.5"
            >
              {selectedChats.length}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <ChatDeleteButton />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cancel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatManageHeader;

interface ChatManageItemProps {
  chat: ChatListDatum;
  isActive?: boolean;
}

const ChatManageItem = ({ chat, isActive = false }: ChatManageItemProps) => {
  const { selectedChats, handleSelectedChat } = useChatManage();

  const isSelected = selectedChats.includes(chat.id);
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer",
        isActive && "bg-secondary/50"
      )}
      onClick={() => handleSelectedChat(chat.id)}
    >
      <Checkbox
        checked={isSelected}
        className="my-auto"
        onCheckedChange={() => handleSelectedChat(chat.id)}
      />
      <ChatListItemContent chat={chat} />
    </div>
  );
};

const ChatDeleteButton = () => {
  const [isOpen, onOpenChange] = useState(false);
  const { selectedChats } = useChatManage();
  const selectedCount = selectedChats.length;

  const handleConfirmDelete = () => {
    if (selectedCount > 0) {
      // TODO: Delete chats
      toast.success(
        `${selectedCount} conversation${selectedCount > 1 ? "s" : ""} deleted`,
        {
          description:
            "The selected conversations have been successfully removed.",
        }
      );
    }
  };

  const deleteDisabled = selectedChats.length === 0;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="disabled:pointer-events-auto">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 disabled:cursor-not-allowed"
              disabled={deleteDisabled}
              onClick={() => onOpenChange(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {deleteDisabled ? <p>Select chats to delete</p> : <p>Delete</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className="z-[80]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedCount} Conversation{selectedCount !== 1 && "s"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} selected
              conversation{selectedCount !== 1 && "s"}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export {
  ChatManageProvider,
  ChatManageItem,
  ChatDeleteButton,
  ChatManageHeader,
  useChatManage,
};

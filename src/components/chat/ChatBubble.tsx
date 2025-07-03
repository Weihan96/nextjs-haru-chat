import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import Image from "next/image";

interface ChatBubbleProps {
  message: ChatMessage;
  companionAvatar?: string;
  companionName?: string;
  isUnread?: boolean; // Only animate if this is a truly new message
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  companionAvatar,
  companionName,
  isUnread = false,
}) => {
  return (
    <div
      className={cn(
        "chat-bubble",
        message.isUser ? "chat-bubble-user" : "chat-bubble-ai",
        isUnread && "animate-bubble-pop"
      )}
    >
      <div className="flex gap-2">
        {!message.isUser && companionAvatar && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <Image
              src={companionAvatar}
              alt={companionName || "Companion"}
              className="object-cover"
              width={32}
              height={32}
            />
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
                className="rounded-md max-w-full"
                width={500}
                height={300}
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {message.timestamp}
            </span>
            {!message.isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full p-0"
              >
                <Bookmark size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;

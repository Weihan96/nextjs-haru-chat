"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSyncHeight } from "@/hooks/use-sync-height";

const STORAGE_KEY = "haru-chat-draft-message";
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  className?: string;
}

const ChatInput = ({ onSendMessage, className }: ChatInputProps) => {
  const isMobile = useIsMobile();
  const {sourceRef, targetRef} = useSyncHeight<HTMLDivElement, HTMLDivElement>();
  
  const [input, setInput] = useState("");
  const [rows, setRows] = useState(1);

  // Load saved input from localStorage on mount
  useEffect(() => {
    const savedInput = localStorage.getItem(STORAGE_KEY);
    if (savedInput) {
      setInput(savedInput);
      // Count newlines to determine rows
      const lineCount = (savedInput.match(/\n/g) ?? []).length + 1;
      setRows(Math.min(lineCount, 4));
    }
  }, []);

  // Save input to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, input);
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Count newlines to determine rows (up to max 4)
    const lineCount = (newValue.match(/\n/g) ?? []).length + 1;
    setRows(Math.min(lineCount, 4));
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
      setRows(1); // Reset rows after sending
      localStorage.removeItem(STORAGE_KEY); // Clear stored draft after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Command/Ctrl+Enter
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendMessage();
    }
    // Regular Enter or Shift+Enter will add a line break (default behavior)
  };

  const sharedProps = {
    input,
    rows,
    onInputChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onSendMessage: handleSendMessage,
  };

  if (isMobile)
    return (
      <>
        <div ref={targetRef} className="w-full" />
        <ChatInputImpl
          ref={sourceRef}
          {...sharedProps}
          className={cn("fixed bottom-0 left-0 right-0", className)}
        />
      </>
    );

  return <ChatInputImpl {...sharedProps} className={className} />;
};

interface ChatInputImplProps extends ChatInputProps {
  input: string;
  rows: number;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
}


const ChatInputImpl = React.forwardRef<HTMLDivElement, ChatInputImplProps>(
  ({ input, rows, onInputChange, onKeyDown, onSendMessage, className }, ref) => {
    return (
      <div ref={ref} className={cn("p-3 border-t border-border bg-background", className)}>
        <div className="relative">
          <Textarea
            placeholder="Type a message..."
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            className="pr-12 resize-none min-h-[60px]"
            rows={rows}
          />
          <Button
            className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
            onClick={() => onSendMessage()}
            disabled={!input.trim()}
          >
            <Send size={16} />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    );
  }
);


export default ChatInput;

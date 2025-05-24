"use client"


import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from "next/navigation";
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatHeaderProps {
  companion?: {
    id: string;
    name: string;
    avatar: string;
  };
  className?: string;
  children?: React.ReactNode;
}

const ChatHeader = ({ 
  companion,
  className,
  children
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleBackToList = () => {
    router.push('/chat');
  };

  // No chat selected
  if (!companion) {
    return null;
  }

  return (
    <div className={cn("p-3 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10", className)}>
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-1">
            <ArrowLeft size={20} />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <img src={companion.avatar} alt={companion.name} className="object-cover" />
        </Avatar>
        <h2 className="font-medium">{companion.name}</h2>
      </div>
      {children}
    </div>
  );
};

export default ChatHeader;

"use client"


import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from "next/navigation";
import { useIsMobile } from '@/hooks/use-mobile';
import Image from "next/image";

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
    <>
      {isMobile && <div className="h-[65px]"/>}
      <div className={cn("p-3 border-b border-border flex items-center justify-between", isMobile && "fixed top-0 left-0 right-0", className)}>
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-1">
              <ArrowLeft size={20} />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <Image src={companion.avatar} alt={companion.name} className="object-cover" width={40} height={40} />
          </Avatar>
          <h2 className="font-medium">{companion.name}</h2>
        </div>
        {children}
      </div>
    </>
  );
};

export default ChatHeader;

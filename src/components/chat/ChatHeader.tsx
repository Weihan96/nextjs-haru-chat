"use client"

import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from "next/navigation";
import { useIsMobile } from '@/hooks/use-mobile';
import Image from "next/image";
import { useComprehensiveChat } from '@/hooks/use-chat';
import { useUser } from '@clerk/nextjs';

interface ChatHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const ChatHeader = ({ 
  children,
  className,
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();

  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  
  // Handle authentication
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.externalId || undefined;
  
  // Get companion data from comprehensive hook
  const { getCompanionData } = useComprehensiveChat({
    enabled: isLoaded && isSignedIn && !!userId
  });

  const companion = getCompanionData(chatId);
  
  if(!companion || !chatId) {
    return null;
  }
  const handleBackToList = () => {
    router.push('/chat');
  };


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

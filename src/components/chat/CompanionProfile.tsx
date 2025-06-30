import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from "next/image";
import { useParams } from 'next/navigation';
import { useComprehensiveChat } from '@/hooks/use-chat';
import { useUser } from '@clerk/nextjs';

interface CompanionProfileProps {
  className?: string;
}

const CompanionProfile = ({
  className,
}: CompanionProfileProps) => {
  const params = useParams();
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
  return (
      <div className={cn("flex items-center gap-3", className)}>
        <Avatar className="h-16 w-16">
          <Image src={companion.avatar} alt={companion.name} className="object-cover" width={64} height={64}/>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{companion.name}</h2>
          <div className="flex flex-wrap gap-1 mt-1">
            {companion.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
  );
};

export default CompanionProfile;

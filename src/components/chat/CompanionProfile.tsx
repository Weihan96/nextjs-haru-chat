
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from "next/image";

interface CompanionProfileProps {
  companion: {
    id: string;
    name: string;
    avatar: string;
    description: string;
    tags: string[];
  };
  className?: string;
}

const CompanionProfile = ({
  companion,
  className,
}: CompanionProfileProps) => {
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

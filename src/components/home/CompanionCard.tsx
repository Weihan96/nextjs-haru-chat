"use client"


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare } from 'lucide-react';
import Link from "next/link";
import { cn } from '@/lib/utils';
import Image from "next/image";
interface CompanionCardProps {
  id: string;
  name: string;
  avatar: string;
  description: string;
  tags: string[];
  likes: number;
  messages: number;
  className?: string;
}

const CompanionCard = ({
  id,
  name,
  avatar,
  description,
  tags,
  likes,
  messages,
  className
}: CompanionCardProps) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  return (
    <div className={cn("companion-card group", className)}>
      <div className="relative">
        <Image src={avatar} alt={name} className="companion-card-image" width={500} height={300} />
        <Button 
          size="icon" 
          variant="ghost" 
          className={cn(
            "absolute top-2 right-2 bg-black/30 hover:bg-black/40 transition-colors",
            isLiked && "text-primary"
          )}
          onClick={handleLike}
        >
          <Heart className={cn(
            "size-5 transition-transform",
            isLiked && "fill-current animate-scale-in"
          )} />
        </Button>
      </div>
      
      <div className="companion-card-content">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lg truncate">{name}</h3>
        </div>
        
        <div className="flex gap-1 flex-wrap mb-1">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>{messages}</span>
            </div>
          </div>
          
          <Link href={`/chat/${id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanionCard;

"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star } from 'lucide-react';
import Link from "next/link";
import StableImage from '@/components/global/StableImage';
import Image from "next/image";
interface CollectionCardProps {
  id: string;
  type: 'companion' | 'message' | 'history';
  title: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
  content?: string;
  timestamp?: string;
  link: string;
}

const CollectionCard = ({
  id: _id,
  type,
  title,
  subtitle,
  image,
  tags,
  content,
  timestamp,
  link
}: CollectionCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {type === 'companion' && (
        <Link href={link}>
          <div className="relative">
            <Image
              src={image}
              alt={title}
              className="w-full h-40 object-cover" width={500} height={300} />
            <div className="absolute top-2 right-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-medium">{title}</h3>
            {tags && tags.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-1">
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
            )}
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {subtitle}
            </p>
          </div>
        </Link>
      )}

      {type === 'message' && (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              {image && <StableImage src={image} alt={title} className="object-cover" />}
            </Avatar>
            <div>
              <h3 className="font-medium">{title}</h3>
              {timestamp && (
                <span className="text-xs text-muted-foreground">{timestamp}</span>
              )}
            </div>
          </div>
          <p className="text-sm mb-3">{content}</p>
          <div className="flex justify-between items-center">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <Link href={link}>
              <Button size="sm" variant="ghost">
                View in Chat
              </Button>
            </Link>
          </div>
        </div>
      )}

      {type === 'history' && (
        <Link href={link}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{title}</h3>
              {timestamp && (
                <span className="text-xs text-muted-foreground">{timestamp}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-8 w-8">
                {image && <StableImage src={image} alt={title} className="object-cover" />}
              </Avatar>
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{content}</p>
            <div className="flex justify-end mt-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Link>
      )}
    </Card>
  );
};

export default CollectionCard;

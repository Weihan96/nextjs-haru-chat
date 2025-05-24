"use client"


import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface ChatHistoryProps {
  chatHistories: {
    id: string;
    title: string;
    date: string;
    snippet: string;
  }[];
  onViewAll?: () => void;
  className?: string;
}

const ChatHistory = ({
  chatHistories,
  onViewAll,
  className
}: ChatHistoryProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Saved Chat History</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs text-muted-foreground"
          onClick={onViewAll}
        >
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chatHistories && chatHistories.length > 0 ? (
          chatHistories.slice(0, 4).map((history) => (
            <Card key={history.id} className="p-3 cursor-pointer hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{history.date}</span>
              </div>
              <h4 className="text-sm font-medium line-clamp-1">{history.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{history.snippet}</p>
            </Card>
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 text-center p-4 text-muted-foreground">
            No saved chat history yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;

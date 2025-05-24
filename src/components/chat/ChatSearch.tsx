"use client"


import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatSearchProps {
  searchQuery: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatSearch = ({ searchQuery, onSearch }: ChatSearchProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search conversations"
        className="pl-9 pr-4"
        value={searchQuery}
        onChange={onSearch}
      />
    </div>
  );
};

export default ChatSearch;

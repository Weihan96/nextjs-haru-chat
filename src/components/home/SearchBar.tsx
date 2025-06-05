"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, Clock, Flame, User, Bot, ArrowLeft, Loader2 } from 'lucide-react';
import { useDebouncedGlobalSearch, useRecentSearches } from '@/hooks/useSearch';
import { MOCK_TRENDING_SEARCHES } from '@/data/search';

interface SearchBarProps {
  initialValue?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const SearchBar = ({ initialValue = '', showBackButton = false, onBackClick }: SearchBarProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  
  // Use the recent searches hook
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearches();

  // Use debounced search for suggestions
  const { data: searchResults, isLoading } = useDebouncedGlobalSearch(
    inputValue, 
    300 // 300ms delay
  );

  // Update input value when initialValue prop changes
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    // Add to recent searches
    addRecentSearch(searchTerm);
    
    // Navigate to search page with query
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      handleSearch(inputValue);
    }
  };

  return (
    <div className="sticky top-0 z-[50] bg-background px-4 py-3 border-b border-border">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBackClick}
            className="h-10 w-10 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1 cursor-text group">
              <Input
                type="text"
                placeholder="What are you looking for?"
                className="pl-9 pr-4"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hidden group-focus-within:inline">
                Press Enter ↵
              </span>
            </div>
          </PopoverTrigger>
          
          <PopoverContent className='p-0 w-[--radix-popover-trigger-width] z-[70]' align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
            <Command>
              <CommandList className='max-h-[calc(100vh-8rem)]'>
                <CommandEmpty>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    "No results found."
                  )}
                </CommandEmpty>
                
                {inputValue && searchResults ? (
                  <>
                    {searchResults.companions.length > 0 && (
                      <CommandGroup heading="Characters">
                        {searchResults.companions.slice(0, 5).map(companion => (
                          <CommandItem
                            key={companion.id}
                            onSelect={() => handleSearch(companion.name)}
                            className="cursor-pointer"
                          >
                            <Bot className="mr-2 h-4 w-4" />
                            <div className="flex flex-col">
                              <span>{companion.name}</span>
                              {companion.description && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {companion.description}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    {searchResults.users.length > 0 && (
                      <>
                        {searchResults.companions.length > 0 && <CommandSeparator />}
                        <CommandGroup heading="People">
                          {searchResults.users.slice(0, 3).map(user => (
                            <CommandItem
                              key={user.id}
                              onSelect={() => handleSearch(user.displayName || user.username || '')}
                              className="cursor-pointer"
                            >
                              <User className="mr-2 h-4 w-4" />
                              <div className="flex flex-col">
                                <span>{user.displayName || user.username}</span>
                                {user.bio && (
                                  <span className="text-xs text-muted-foreground truncate">
                                    {user.bio}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {recentSearches.length > 0 && (
                      <CommandGroup heading="Recent">
                        {recentSearches.map(term => (
                          <CommandItem
                            key={term}
                            onSelect={() => handleSearch(term)}
                            className="cursor-pointer flex justify-between"
                          >
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>{term}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentSearch(term);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    <CommandSeparator />
                    
                    <CommandGroup heading="Trending">
                      {MOCK_TRENDING_SEARCHES.map(term => (
                        <CommandItem
                          key={term}
                          onSelect={() => handleSearch(term)}
                          className="cursor-pointer"
                        >
                          <Flame className="mr-2 h-4 w-4" />
                          <span>{term}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SearchBar;

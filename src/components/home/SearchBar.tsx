"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, Clock, Flame, User, Bot, ArrowLeft } from 'lucide-react';

// Mock search history - in a real app, this would be stored in localStorage or a database
const MOCK_RECENT_SEARCHES = [
  'anime characters',
  'sci-fi companions',
  'historical figures'
];

// Mock trending searches
const MOCK_TRENDING_SEARCHES = [
  'celebrity AI',
  'fantasy characters',
  'gaming companions',
  'philosophical mentors'
];

// Mock suggested companions
const MOCK_SUGGESTED_COMPANIONS = [
  { id: '1', name: 'Alena Moniaga', type: 'Character' },
  { id: '2', name: 'Tom Lancaster', type: 'Character' },
  { id: '3', name: 'Miko', type: 'Character' },
  { id: '4', name: 'Captain Nova', type: 'Character' }
];

// Mock suggested people
const MOCK_SUGGESTED_PEOPLE = [
  { id: '10', name: 'Alexander', type: 'Person' },
  { id: '11', name: 'Olivia', type: 'Person' },
  { id: '12', name: 'Marcus', type: 'Person' }
];

interface SearchBarProps {
  initialValue?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const SearchBar = ({ initialValue = '', showBackButton = false, onBackClick }: SearchBarProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState(MOCK_RECENT_SEARCHES);

  // Update input value when initialValue prop changes
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5)); // Keep only the 5 most recent
    }
    
    // Navigate to search page with query
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setOpen(false);
  };

  const removeRecentSearch = (searchTerm: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(term => term !== searchTerm));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      handleSearch(inputValue);
    }
  };

  // Filter suggestions based on input
  const filterSuggestions = (items: Array<{id: string, name: string, type: string}>, input: string) => {
    if (!input) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(input.toLowerCase()) ||
      item.type.toLowerCase().includes(input.toLowerCase())
    );
  };

  const filteredCompanions = filterSuggestions(MOCK_SUGGESTED_COMPANIONS, inputValue);
  const filteredPeople = filterSuggestions(MOCK_SUGGESTED_PEOPLE, inputValue);

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
                <CommandEmpty>No results found.</CommandEmpty>
                
                {inputValue ? (
                  <>
                    {filteredCompanions.length > 0 && (
                      <CommandGroup heading="Characters">
                        {filteredCompanions.map(companion => (
                          <CommandItem
                            key={companion.id}
                            onSelect={() => handleSearch(companion.name)}
                            className="cursor-pointer"
                          >
                            <Bot className="mr-2 h-4 w-4" />
                            <span>{companion.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    {filteredPeople.length > 0 && (
                      <>
                        {filteredCompanions.length > 0 && <CommandSeparator />}
                        <CommandGroup heading="People">
                          {filteredPeople.map(person => (
                            <CommandItem
                              key={person.id}
                              onSelect={() => handleSearch(person.name)}
                              className="cursor-pointer"
                            >
                              <User className="mr-2 h-4 w-4" />
                              <span>{person.name}</span>
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
                              onClick={(e) => removeRecentSearch(term, e)}
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

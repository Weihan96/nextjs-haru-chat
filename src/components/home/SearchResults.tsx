"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from '@/components/home/SearchBar';
import CompanionCard from '@/components/home/CompanionCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { MOCK_COMPANIONS } from '@/data/companions';

// Mock tags for search results
const RESULT_TAGS = ['Anime', 'Celebrity', 'Fantasy', 'Sci-Fi', 'Historical', 'Romance', 'Comedy'];

// Mock users for search results
const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
  { id: '2', name: 'Bob Smith', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
  { id: '3', name: 'Charlie Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
  { id: '4', name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: '5', name: 'Eva Brown', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
  { id: '6', name: 'Frank Martin', avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf' }
];

const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [companions, setCompanions] = useState(Object.values(MOCK_COMPANIONS).flat());

  useEffect(() => {
    // Filter companions based on search query
    if (searchQuery) {
      const allCompanions = Object.values(MOCK_COMPANIONS).flat();
      const filtered = allCompanions.filter(companion => 
        companion.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        companion.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setCompanions(filtered);
    }
  }, [searchQuery]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Further filter companions by selected tags
  const filteredCompanions = companions.filter(companion => 
    selectedTags.length === 0 || 
    selectedTags.some(tag => companion.tags.includes(tag))
  );
  
  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen pb-20">
      <SearchBar 
        initialValue={searchQuery} 
        showBackButton={true}
        onBackClick={handleBackClick}
      />
      
      <div className="px-4 py-5">
        <h1 className="text-2xl font-bold mb-4">Results for "{searchQuery}"</h1>
        
        <Tabs defaultValue="companions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="companions">Companions</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
          
          <TabsContent value="companions" className="space-y-6">
            <div className="sticky top-16 bg-background pt-2 pb-4 z-10">
              <h2 className="text-lg font-medium mb-3">Filter by tags:</h2>
              <div className="flex flex-wrap gap-2">
                {RESULT_TAGS.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {filteredCompanions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredCompanions.map(companion => (
                  <CompanionCard
                    key={companion.id}
                    id={companion.id}
                    name={companion.name}
                    avatar={companion.avatar}
                    description={companion.description}
                    tags={companion.tags}
                    likes={companion.likes}
                    messages={companion.messages}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No companions found matching your search.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="people" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MOCK_USERS.map(user => (
                <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/30 transition-colors">
                  <Avatar className="h-12 w-12">
                    <img src={user.avatar} alt={user.name} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">User</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchResults;

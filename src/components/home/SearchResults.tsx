"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from '@/components/home/SearchBar';
import CompanionCard from '@/components/home/CompanionCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGlobalSearch } from '@/hooks/useSearch';
import Image from "next/image";


const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use React Query for search
  const { data: searchResults, isLoading, error } = useGlobalSearch(searchQuery);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter companions by selected tags (this would need tag data from server)
  const filteredCompanions = searchResults?.companions || [];
  
  const handleBackClick = () => {
    router.push('/');
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );

  const UserCard = ({ user }: { user: any }) => (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.imageUrl || ''} alt={user.displayName || user.username || 'User'} />
        <AvatarFallback>
          {(user.displayName || user.username || 'U').charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.displayName || user.username}</p>
        <p className="text-sm text-muted-foreground">User</p>
        {user.bio && (
          <p className="text-xs text-muted-foreground truncate mt-1">{user.bio}</p>
        )}
      </div>
    </div>
  );

  const MessageCard = ({ message }: { message: any }) => (
    <div className="p-4 border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.chat.companion.imageUrl || ''} alt={message.chat.companion.name} />
          <AvatarFallback>
            {message.chat.companion.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm">{message.chat.companion.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
          {message.chat.title && (
            <p className="text-xs text-muted-foreground mt-1">in {message.chat.title}</p>
          )}
        </div>
      </div>
    </div>
  );

  const CheckpointCard = ({ checkpoint }: { checkpoint: any }) => (
    <div className="p-4 border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm line-clamp-1">{checkpoint.title}</h3>
          <Badge variant="secondary" className="text-xs">{checkpoint.usageCount} uses</Badge>
        </div>
        {checkpoint.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{checkpoint.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>by {checkpoint.creator.displayName || checkpoint.creator.username}</span>
          {checkpoint.isPublic && <Badge variant="outline" className="text-xs">Public</Badge>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <SearchBar 
        initialValue={searchQuery} 
        showBackButton={true}
        onBackClick={handleBackClick}
      />
      
      <div className="px-4 py-5">
        <h1 className="text-2xl font-bold mb-4">Results for &ldquo;{searchQuery}&rdquo;</h1>
        
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">Error loading search results. Please try again.</p>
          </div>
        )}
        
        <Tabs defaultValue="companions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="companions">
              Companions ({searchResults?.companions.length || 0})
            </TabsTrigger>
            <TabsTrigger value="people">
              People ({searchResults?.users.length || 0})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({searchResults?.messages.length || 0})
            </TabsTrigger>
            <TabsTrigger value="checkpoints">
              Checkpoints ({searchResults?.checkpoints.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="companions" className="space-y-6">
            {/* Temporarily disable tag filtering until we have tag data from server */}
            {/* <div className="sticky top-16 bg-background pt-2 pb-4 z-10">
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
            </div> */}
            
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredCompanions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCompanions.map(companion => (
                  <div key={companion.id} className="p-4 border rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={companion.imageUrl || ''} alt={companion.name} />
                        <AvatarFallback>
                          {companion.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{companion.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {companion.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>by {companion.creator.displayName || companion.creator.username}</span>
                          {companion.isPublic && <Badge variant="outline" className="text-xs">Public</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No companions found matching your search.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="people" className="space-y-4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : searchResults?.users.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.users.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No users found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : searchResults?.messages.length ? (
              <div className="space-y-3">
                {searchResults.messages.map(message => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No messages found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="checkpoints" className="space-y-4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : searchResults?.checkpoints.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.checkpoints.map(checkpoint => (
                  <CheckpointCard key={checkpoint.id} checkpoint={checkpoint} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No checkpoints found matching your search.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchResults;

"use client"

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import CollectionCard from '@/components/collections/CollectionCard';
import { CREATED_COMPANIONS, LIKED_COMPANIONS, RECENT_COMPANIONS } from '@/data/companions';
import { SAVED_HISTORY, STARRED_MESSAGES } from '@/data/messages';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import Link from "next/link";

type FilterableItem = {
  id: string;
  name?: string;
  description?: string;
  title?: string;
  content?: string;
  avatar?: string;
  tags?: string[];
  image?: string;
  subtitle?: string;
  timestamp?: string;
};

const Collections = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filterItems = (items: FilterableItem[], query: string) => {
    if (!query.trim()) return items;
    
    return items.filter(item => {
      if (item.name && item.description) {
        return item.name.toLowerCase().includes(query.toLowerCase()) ||
               item.description.toLowerCase().includes(query.toLowerCase());
      }
      
      if (item.title) {
        return item.title.toLowerCase().includes(query.toLowerCase()) ||
               (item.content && item.content.toLowerCase().includes(query.toLowerCase()));
      }
      
      return false;
    });
  };
  
  const filteredCreated = filterItems(CREATED_COMPANIONS, searchQuery);
  const filteredLiked = filterItems(LIKED_COMPANIONS, searchQuery);
  const filteredRecent = filterItems(RECENT_COMPANIONS, searchQuery);
  const filteredHistory = filterItems(SAVED_HISTORY, searchQuery);
  const filteredStarred = filterItems(STARRED_MESSAGES, searchQuery);
  
  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen pb-20">
        <div className="relative p-4">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search collections..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="companions">
          <div className="px-4 py-2 w-full bg-background">          
            <TabsList className="w-full">
              <TabsTrigger value="companions" className="flex-1">Companions</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Chat History</TabsTrigger>
              <TabsTrigger value="starred" className="flex-1">Starred</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="companions" className="p-4">
            {(filteredCreated.length > 0 || filteredLiked.length > 0 || filteredRecent.length > 0) ? (
              <>
                {/* Created Companions Section */}
                <>
                  <h2 className="text-xl font-bold mb-4">Created Companions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {filteredCreated.map(companion => (
                      <CollectionCard
                        key={companion.id}
                        id={companion.id}
                        type="companion"
                        title={companion.name!}
                        subtitle={companion.description!}
                        image={companion.avatar!}
                        tags={companion.tags!}
                        link={`/chat/${companion.id}`}
                      />
                    ))}
                    
                    {/* Create New Companion Button */}
                    <Link href="/create">
                      <Card className="flex flex-col items-center justify-center h-full min-h-[220px] border-dashed border-2 hover:border-primary hover:bg-secondary/20 transition-all">
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="rounded-full bg-secondary p-3 mb-4">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                          <p className="font-medium">Create New Companion</p>
                        </div>
                      </Card>
                    </Link>
                  </div>
                </>
              
                {/* Liked Companions Section */}
                {filteredLiked.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold mb-4">Liked Companions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                      {filteredLiked.map(companion => (
                        <CollectionCard
                          key={companion.id}
                          id={companion.id}
                          type="companion"
                          title={companion.name!}
                          subtitle={companion.description!}
                          image={companion.avatar!}
                          tags={companion.tags!}
                          link={`/chat/${companion.id}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Recently Viewed Section */}
                {filteredRecent.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredRecent.map(companion => (
                        <CollectionCard
                          key={companion.id}
                          id={companion.id}
                          type="companion"
                          title={companion.name!}
                          subtitle={companion.description!}
                          image={companion.avatar!}
                          tags={companion.tags!}
                          link={`/chat/${companion.id}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No companions found</h3>
                <p className="text-muted-foreground">Try adjusting your search query.</p>
              </div>
            )}
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="p-4">
            {filteredHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHistory.map(history => (
                  <CollectionCard
                    key={history.id}
                    id={history.id}
                    type="history"
                    title={history.title!}
                    subtitle={history.subtitle!}
                    image={history.image!}
                    content={history.content!}
                    timestamp={history.timestamp!}
                    link={`/chat/1?history=${history.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No chat history found</h3>
                <p className="text-muted-foreground">Try adjusting your search query.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Starred Tab */}
          <TabsContent value="starred" className="p-4">
            {filteredStarred.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStarred.map(message => (
                  <CollectionCard
                    key={message.id}
                    id={message.id}
                    type="message"
                    title={message.title!}
                    image={message.image!}
                    content={message.content!}
                    timestamp={message.timestamp!}
                    link={`/chat/1?message=${message.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No starred messages found</h3>
                <p className="text-muted-foreground">Try adjusting your search query.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>      
    </ScrollArea>
  );
};

export default Collections;

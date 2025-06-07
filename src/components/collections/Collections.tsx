"use client"

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'
import CollectionCard from '@/components/collections/CollectionCard'
import { CollectionsSkeleton } from '@/components/collections/CollectionsSkeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import Link from "next/link"
import { getCollectionsData } from '@/lib/actions/collections'
import type { CollectionCompanion, ChatHistory, StarredMessage } from '@/types/companions'

type FilterableCompanion = {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  tags: { tag: { name: string } }[]
}

type FilterableChatHistory = {
  id: string
  title?: string | null
  companion: {
    id: string
    name: string
    imageUrl?: string | null
  }
  messages: {
    content?: string | null
    createdAt: Date
  }[]
}

type FilterableStarredMessage = {
  id: string
  content?: string | null
  sender: {
    displayName?: string | null
    imageUrl?: string | null
  }
  chat: {
    companion: {
      id: string
      name: string
      imageUrl?: string | null
    }
  }
  createdAt: Date
}

const Collections = () => {
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: collectionsData, isLoading, error, refetch } = useQuery({
    queryKey: ['collections-data'],
    queryFn: getCollectionsData,
  })

  // Handle errors with toast notifications and frontend logging
  useEffect(() => {
    if (error) {
      // Parse and log detailed error info to frontend console
      try {
        const errorData = JSON.parse(error.message)
        console.error('🔴 Collections fetch error:', errorData.debug)
        
        toast.error('Failed to load collections', {
          description: errorData.message || 'Unable to fetch collection data. Please try again later.',
          duration: Infinity, // Keep error toast open until user dismisses
          action: {
            label: 'Retry',
            onClick: () => refetch(),
          },
        })
      } catch {
        // Fallback for non-JSON error messages
        console.error('🔴 Collections fetch error:', error)
        toast.error('Failed to load collections', {
          description: error.message || 'Unable to fetch collection data. Please try again later.',
          duration: Infinity, // Keep error toast open until user dismisses
          action: {
            label: 'Retry',
            onClick: () => refetch(),
          },
        })
      }
    }
  }, [error, refetch])
  
  const filterCompanions = (companions: FilterableCompanion[], query: string) => {
    if (!query.trim()) return companions
    
    return companions.filter(companion => 
      companion.name.toLowerCase().includes(query.toLowerCase()) ||
      (companion.description && companion.description.toLowerCase().includes(query.toLowerCase()))
    )
  }

  const filterChatHistory = (history: FilterableChatHistory[], query: string) => {
    if (!query.trim()) return history
    
    return history.filter(chat => 
      chat.companion.name.toLowerCase().includes(query.toLowerCase()) ||
      (chat.title && chat.title.toLowerCase().includes(query.toLowerCase())) ||
      chat.messages.some(msg => 
        msg.content && msg.content.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  const filterStarredMessages = (messages: FilterableStarredMessage[], query: string) => {
    if (!query.trim()) return messages
    
    return messages.filter(message => 
      message.chat.companion.name.toLowerCase().includes(query.toLowerCase()) ||
      (message.content && message.content.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Show skeleton during loading or error states
  if (isLoading || error) {
    return <CollectionsSkeleton />
  }

  if (!collectionsData) {
    return <CollectionsSkeleton />
  }

  const filteredCreated = filterCompanions(collectionsData.createdCompanions, searchQuery)
  const filteredLiked = filterCompanions(collectionsData.likedCompanions, searchQuery)
  const filteredRecent = filterCompanions(collectionsData.recentCompanions, searchQuery)
  const filteredHistory = filterChatHistory(collectionsData.chatHistory, searchQuery)
  const filteredStarred = filterStarredMessages(collectionsData.starredMessages, searchQuery)
  
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
                <h2 className="text-xl font-bold mb-4">Created Companions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {filteredCreated.map(companion => (
                    <CollectionCard
                      key={companion.id}
                      id={companion.id}
                      type="companion"
                      title={companion.name}
                      subtitle={companion.description || 'No description available'}
                      image={companion.imageUrl || '/default-avatar.png'}
                      tags={companion.tags.map(t => t.tag.name)}
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
                          title={companion.name}
                          subtitle={companion.description || 'No description available'}
                          image={companion.imageUrl || '/default-avatar.png'}
                          tags={companion.tags.map(t => t.tag.name)}
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
                          title={companion.name}
                          subtitle={companion.description || 'No description available'}
                          image={companion.imageUrl || '/default-avatar.png'}
                          tags={companion.tags.map(t => t.tag.name)}
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
                <p className="text-muted-foreground">Try adjusting your search query or create your first companion!</p>
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
                    title={history.title || 'Untitled Chat'}
                    subtitle={`with ${history.companion.name}`}
                    image={history.companion.imageUrl || '/default-avatar.png'}
                    content={history.messages[0]?.content || 'No messages yet'}
                    timestamp={new Date(history.messages[0]?.createdAt || new Date()).toLocaleDateString()}
                    link={`/chat/${history.companion.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No chat history found</h3>
                <p className="text-muted-foreground">Try adjusting your search query or start your first conversation!</p>
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
                    title={message.chat.companion.name}
                    image={message.chat.companion.imageUrl || '/default-avatar.png'}
                    content={message.content || 'No content'}
                    timestamp={new Date(message.createdAt).toLocaleDateString()}
                    link={`/chat/${message.chat.companion.id}?message=${message.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No starred messages found</h3>
                <p className="text-muted-foreground">Try adjusting your search query or star some interesting messages!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>      
    </ScrollArea>
  )
}

export default Collections

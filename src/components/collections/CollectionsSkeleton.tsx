import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'

function CompanionCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-40" />
      <div className="p-3">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex gap-1 flex-wrap mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  )
}

function HistoryCardSkeleton() {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-full mb-2" />
      <div className="flex justify-end">
        <Skeleton className="h-4 w-4" />
      </div>
    </Card>
  )
}

function MessageCardSkeleton() {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-6 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-12 w-full mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-8 w-20" />
      </div>
    </Card>
  )
}

function CreateCompanionSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center h-full min-h-[220px] border-dashed border-2">
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-secondary p-3 mb-4">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <Skeleton className="h-5 w-36" />
      </div>
    </Card>
  )
}

export function CollectionsSkeleton() {
  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen pb-20">
        <div className="relative p-4">
          <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search collections..."
            className="pl-9 pr-4"
            disabled
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
            {/* Created Companions Section */}
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <CompanionCardSkeleton key={`created-${index}`} />
              ))}
              <CreateCompanionSkeleton />
            </div>
            
            {/* Liked Companions Section */}
            <Skeleton className="h-8 w-44 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <CompanionCardSkeleton key={`liked-${index}`} />
              ))}
            </div>
            
            {/* Recently Viewed Section */}
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <CompanionCardSkeleton key={`recent-${index}`} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <HistoryCardSkeleton key={`history-${index}`} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="starred" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <MessageCardSkeleton key={`starred-${index}`} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>      
    </ScrollArea>
  )
} 
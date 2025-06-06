import { Skeleton } from "@/components/ui/skeleton"

export function CategorySkeleton() {
  return (
    <div className="mb-8 px-4">
      {/* Category title skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Companion cards skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CompanionCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="px-4 py-6">
      <Skeleton className="h-12 w-full max-w-md mx-auto rounded-lg" />
    </div>
  )
}

function CompanionCardSkeleton() {
  return (
    <div className="companion-card group">
      {/* Image skeleton */}
      <div className="relative">
        <Skeleton className="companion-card-image h-48 w-full rounded-lg" />
        <Skeleton className="absolute top-2 right-2 h-10 w-10 rounded-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="companion-card-content p-4 space-y-3">
        {/* Name */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
} 
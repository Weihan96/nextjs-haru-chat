'use client'

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import SearchBar from '@/components/home/SearchBar';
import CategorySection from '@/components/home/CategorySection';
import { CategorySkeleton } from '@/components/home/CategorySkeleton';
import { getCategorizedCompanions } from '@/lib/actions/companions';
import { CATEGORIES } from '@/types/companions';
import { ScrollArea } from '@/components/ui/scroll-area';

const Home = () => {
  const { data: categorizedCompanions, isLoading, error, refetch } = useQuery({
    queryKey: ['categorized-companions'],
    queryFn: getCategorizedCompanions,
  })

  // Handle errors with toast notifications and frontend logging
  useEffect(() => {
    if (error) {
      // Parse and log detailed error info to frontend console
      try {
        const errorData = JSON.parse(error.message)
        console.error('🔴 Companions fetch error:', errorData.debug)
        
        toast.error('Failed to load companions', {
          description: errorData.message || 'Unable to fetch companion data. Please try again later.',
          duration: Infinity, // Keep error toast open until user dismisses
          action: {
            label: 'Retry',
            onClick: () => refetch(),
          },
        })
      } catch {
        // Fallback for non-JSON error messages
        console.error('🔴 Companions fetch error:', error)
        toast.error('Failed to load companions', {
          description: error.message || 'Unable to fetch companion data. Please try again later.',
          duration: Infinity, // Keep error toast open until user dismisses
          action: {
            label: 'Retry',
            onClick: () => refetch(),
          },
        })
      }
    }
  }, [error, refetch])

  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen pb-20">
      <SearchBar />
      <div className="animate-fade-in">
        {(isLoading || error) ? (
          // Loading state
          CATEGORIES.map((category) => (
            <div key={`skeleton-${category}`}>
              <CategorySkeleton />
            </div>
          ))
        ) : categorizedCompanions ? (
          // Success state - show data (toast handles errors)
          <>
            {CATEGORIES.map((category) => {
              const companions = categorizedCompanions[category]
              return (
                <CategorySection
                  key={category}
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                  companions={companions}
                  viewAllUrl={`/category/${category}`}
                />
              )
            })}
            
            {/* Show message if all categories are empty (legitimate empty state) */}
            {CATEGORIES.every(cat => categorizedCompanions[cat].length === 0) && (
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground mb-2">No companions available</p>
                  <p className="text-sm text-muted-foreground">Check back later for new companions!</p>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
      </div>
    </ScrollArea>
  );
};

export default Home;

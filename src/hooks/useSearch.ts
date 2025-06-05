"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  globalSearch, 
  searchCompanions, 
  searchUsers, 
  searchMessages, 
  searchCheckpoints, 
  searchWithinChat,
  type SearchResults 
} from '@/actions/search'

// Global search hook
export function useGlobalSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', 'global', query],
    queryFn: () => globalSearch(query),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 2, // 2 minutes - good for dynamic search results
  })
}

// Search companions hook
export function useSearchCompanions(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', 'companions', query],
    queryFn: () => searchCompanions(query),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes - companions change less frequently
  })
}

// Search users hook
export function useSearchUsers(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', 'users', query],
    queryFn: () => searchUsers(query),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes - user data is relatively stable
  })
}

// Search messages hook
export function useSearchMessages(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', 'messages', query],
    queryFn: () => searchMessages(query),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 1, // 1 minute - messages change more frequently
  })
}

// Search checkpoints hook
export function useSearchCheckpoints(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', 'checkpoints', query],
    queryFn: () => searchCheckpoints(query),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes - checkpoints are relatively stable
  })
}

// Search within chat hook
export function useSearchWithinChat(chatId: string, query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', 'chat', chatId, query],
    queryFn: () => searchWithinChat(chatId, query),
    enabled: enabled && !!chatId && !!query.trim(),
    staleTime: 1000 * 60 * 1, // 1 minute - chat messages can change frequently
  })
}

// Debounced search hook for real-time search
export function useDebouncedGlobalSearch(query: string, delay: number = 500) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(query)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), delay)
    return () => clearTimeout(timer)
  }, [query, delay])

  return useGlobalSearch(debouncedQuery, debouncedQuery.trim().length >= 2)
}

// Export types for consumers
export type { SearchResults }

// Utility hook for managing recent searches
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('haru-recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
    }
  }, []);

  const addRecentSearch = React.useCallback((query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(term => term !== query);
      const updated = [query, ...filtered].slice(0, 10); // Keep only 10 recent searches
      
      try {
        localStorage.setItem('haru-recent-searches', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save recent searches:', error);
      }
      
      return updated;
    });
  }, []);

  const removeRecentSearch = React.useCallback((query: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(term => term !== query);
      
      try {
        localStorage.setItem('haru-recent-searches', JSON.stringify(filtered));
      } catch (error) {
        console.warn('Failed to save recent searches:', error);
      }
      
      return filtered;
    });
  }, []);

  const clearRecentSearches = React.useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('haru-recent-searches');
    } catch (error) {
      console.warn('Failed to clear recent searches:', error);
    }
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
} 
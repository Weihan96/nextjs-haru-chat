"use client"

import React from 'react'
import { useAuth } from '@clerk/nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Types
interface SearchHistoryItem {
  id: string
  query: string
  timestamp: Date
  category?: 'companions' | 'users' | 'messages' | 'global'
}

// Server actions (you'd implement these)
async function saveSearchToServer(query: string, category?: string) {
  // Implementation would save to database
  // return await fetch('/api/search-history', { method: 'POST', ... })
}

async function getServerSearchHistory(): Promise<SearchHistoryItem[]> {
  // Implementation would fetch from database
  // return await fetch('/api/search-history').then(res => res.json())
  return []
}

async function deleteServerSearchHistory(id: string) {
  // return await fetch(`/api/search-history/${id}`, { method: 'DELETE' })
}

// Local storage utilities
const LOCAL_STORAGE_KEY = 'haru-search-history'

function getLocalSearchHistory(): SearchHistoryItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }))
    }
  } catch (error) {
    console.warn('Failed to load local search history:', error)
  }
  return []
}

function saveLocalSearchHistory(history: SearchHistoryItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.warn('Failed to save local search history:', error)
  }
}

// Main hook
export function useSearchHistory() {
  const { isSignedIn, userId } = useAuth()
  const queryClient = useQueryClient()
  
  // Local state for non-authenticated users
  const [localHistory, setLocalHistory] = React.useState<SearchHistoryItem[]>([])
  
  // Load local history on mount
  React.useEffect(() => {
    if (!isSignedIn) {
      setLocalHistory(getLocalSearchHistory())
    }
  }, [isSignedIn])
  
  // Server query for authenticated users
  const { data: serverHistory = [] } = useQuery({
    queryKey: ['search-history', userId],
    queryFn: getServerSearchHistory,
    enabled: !!isSignedIn && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  // Mutation for saving to server
  const saveToServerMutation = useMutation({
    mutationFn: ({ query, category }: { query: string; category?: string }) => 
      saveSearchToServer(query, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history', userId] })
    },
  })
  
  // Mutation for deleting from server
  const deleteFromServerMutation = useMutation({
    mutationFn: deleteServerSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history', userId] })
    },
  })
  
  // Get current history
  const history = isSignedIn ? serverHistory : localHistory
  
  // Add search to history
  const addSearch = React.useCallback((query: string, category?: string) => {
    if (!query.trim()) return
    
    const newItem: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      query: query.trim(),
      timestamp: new Date(),
      category: category as any
    }
    
    if (isSignedIn) {
      // Save to server
      saveToServerMutation.mutate({ query: query.trim(), category })
    } else {
      // Save to local storage
      setLocalHistory(prev => {
        const filtered = prev.filter(item => item.query !== query)
        const updated = [newItem, ...filtered].slice(0, 20) // Keep 20 items
        saveLocalSearchHistory(updated)
        return updated
      })
    }
  }, [isSignedIn, saveToServerMutation])
  
  // Remove search from history
  const removeSearch = React.useCallback((query: string) => {
    if (isSignedIn) {
      // Find and delete from server
      const item = serverHistory.find(h => h.query === query)
      if (item) {
        deleteFromServerMutation.mutate(item.id)
      }
    } else {
      // Remove from local storage
      setLocalHistory(prev => {
        const filtered = prev.filter(item => item.query !== query)
        saveLocalSearchHistory(filtered)
        return filtered
      })
    }
  }, [isSignedIn, serverHistory, deleteFromServerMutation])
  
  // Clear all history
  const clearHistory = React.useCallback(() => {
    if (isSignedIn) {
      // Clear server history (you'd implement this API)
      queryClient.setQueryData(['search-history', userId], [])
    } else {
      setLocalHistory([])
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }, [isSignedIn, queryClient, userId])
  
  // Get recent searches (just the queries)
  const recentSearches = React.useMemo(() => 
    history.map(item => item.query).slice(0, 10),
    [history]
  )
  
  return {
    history,
    recentSearches,
    addSearch,
    removeSearch,
    clearHistory,
    isLoading: isSignedIn ? saveToServerMutation.isPending : false,
    // Backward compatibility with existing hook
    addRecentSearch: addSearch,
    removeRecentSearch: removeSearch,
    clearRecentSearches: clearHistory,
  }
} 